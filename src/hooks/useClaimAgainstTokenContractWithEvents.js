import useWeb3 from "@/connectors/hooks";
import {formatEther, parseEther} from "@ethersproject/units";
import {BigNumber} from "@ethersproject/bignumber";
import {
  useClaimAgainstTokenContractWithFee
} from "@/hooks/useContract";
import {ref, onBeforeUnmount} from 'vue';
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {Web3Provider} from "@ethersproject/providers";
import parseError from "@/services/utils/parseError";
import {useToast} from "primevue/usetoast";

const 
useClaimAgainstTokenContractWithEvents = () => {
    const {converEthToUSD} = useExchangeRate();
    const {account, provider} = useWeb3();
    const toast = useToast();
    const contractAddress = ref(null);
    const claimantAddress = ref(null);
    const mergedEvents = ref([]);
    const price = ref(0);
    const humanReadablePrice = ref(0);
    const endsAt = ref(0);
    const startsAt = ref(0);
    const minimumStartsAt = ref(0);
    let contract = null;

    const createNormalizedEvent = async (contractEvent, type) => {
        const trx = await contractEvent.getTransaction();
        const blockNumber = await contractEvent.getBlock();
        const tx = trx.hash;
        // Map the event to current structure
        // The same event will cale through event listener
        const evt = contractEvent.decode(contractEvent.data, contractEvent.topics);

        // event ClaimedAgainstTokenId(address indexed claimant, uint256 indexed tokenId, uint256 timestamp);

        let walletAddress;
        let tokenId;
        if(type === 'claimAgainstTokenId') {
            walletAddress = evt.claimant;
            tokenId = evt.tokenId.toString() * 1;
        }

        const event = {
          created_at: new Date(blockNumber.timestamp * 1000),
          event_type: type,
          id: Math.random(),
          tx,
          updated_at: null,
          value_in_usd: converEthToUSD(price.value),
          wallet_address: walletAddress,
          token_id: tokenId,
          raw: JSON.stringify(evt)
        };
        return event;
    };

    const mergeEvents = (event) => {
        const evts = [...mergedEvents.value];
        const existingEvt = evts.find(evt => evt.token_id === event.token_id);
        if (existingEvt) {
            return;
        } else {
            const insertIndex = evts.findIndex(evt => new Date(evt.created_at) >= event.created_at);
            if (insertIndex != null) {
                evts.splice(insertIndex, 0, event);
            } else {
                evts.push(event);
            }
        }
        mergedEvents.value = evts;
    };

    const initializeContractEvents = async (useContractAddress, useClaimantAddress, fallbackIdList = [], onlySaveContractAddress = false) => {
        try {

            console.log({useClaimantAddress})

            contractAddress.value = useContractAddress;
            claimantAddress.value = useClaimantAddress;

            minimumStartsAt.value = 0;

            if (onlySaveContractAddress) {
                return;
            }
            mergedEvents.value = [];

            // !! IMPORTANT !! remove listeners on beforeDestroy
            if (!contractAddress.value) {
              return;
            }

            contract = useClaimAgainstTokenContractWithFee(contractAddress.value)
            console.log({contract})
            let check = await contract.claimFee();
            console.log({check, 'check.toString()': check.toString()});
            price.value = await contract.claimFee();
            humanReadablePrice.value = formatEther(BigNumber.from(price.value.toString()));
            let closingTimeUnix = await contract.closingTimeUnix();
            endsAt.value = new Date(closingTimeUnix.mul(1000).toNumber()).getTime();
            let openingTimeUnix = await contract.openingTimeUnix();
            startsAt.value = new Date(openingTimeUnix.mul(1000).toNumber()).getTime();

            console.log({'price.value': price.value});

            await contract.on("ClaimedAgainstTokenId", async (claimant, tokenId, timestamp, evt) => {
                // Handle bid event: check SUPPLY LEFT, add evt to Events (same decoding process as auction)
                // console.log(fromAddress, amount.toString(), evt)
                const event = await createNormalizedEvent(evt, 'claimAgainstTokenId');
                mergeEvents(event);
            });

            let claimsFilter = contract.filters.ClaimedAgainstTokenId(useClaimantAddress, null, null);
            const claims = await contract.queryFilter(claimsFilter);
            console.group('Past Events - ClaimedAgainstTokenId');
            
            for(let claim of claims) {
                fallbackIdList = fallbackIdList.filter(id => id !== Number(claim.args.tokenId));
                const event = await createNormalizedEvent(claim, 'claimAgainstTokenId');
                mergeEvents(event);
            }
            console.log({fallbackIdList})
            for(let fallbackId of fallbackIdList) {
                // Run an explicit check against any tokens which haven't been detected as claimed
                let explicitCheckClaimFilter = contract.filters.ClaimedAgainstTokenId(null, fallbackId, null);
                const explicitClaims = await contract.queryFilter(explicitCheckClaimFilter);
                for(let explicitClaim of explicitClaims) {
                    const event = await createNormalizedEvent(explicitClaim, 'claimAgainstTokenId');
                    mergeEvents(event);
                }
            }
            console.groupEnd('Past Events - ClaimedAgainstTokenId');

          return true;
        }catch(e){
            console.log({'initializeContractEvents error': e})
        }
    };

    const claimAgainstTokenIds = async (tokenIds = [], setWalletCheckStateFn = false) => {

        const value = BigNumber.from(tokenIds.length.toString()).mul(price.value)

        console.log({value, 'value.toString': value.toString()})

        if (price.value == null || tokenIds.length == 0 || !tokenIds) return;

        if (!contractAddress.value || !claimantAddress.value) return;

        let temporaryContract = useClaimAgainstTokenContractWithFee(contractAddress.value, true);

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        if(setWalletCheckStateFn) {
            setWalletCheckStateFn(true);
        }

        let tx;
        tx = await temporaryContract.claimAgainstTokenIds(tokenIds, {
            gasPrice: gasPrice.toString(),
            value: value.toString(),
            from: account.value
        }).catch(e => {
            let message = parseError(e.message)
            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
            return false;
        });

        if(setWalletCheckStateFn) {
            setWalletCheckStateFn(false);
        }

        return tx.wait()
            .then(async (response) => {
                if(response.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully claimed against your tokens.',
                        life: 3000
                    });
                    // Fallback check in case event emission is not auto detected via event listener
                    setTimeout(async () => {
                        let claimsFilter = contract.filters.ClaimedAgainstTokenId(claimantAddress.value, null, null);
                        const claims = await contract.queryFilter(claimsFilter);
                        claims.forEach(async (claim) => {
                            const event = await createNormalizedEvent(claim, 'claimAgainstTokenId');
                            mergeEvents(event);
                        });
                        return true;
                    }, 3000);
                }else {
                    toast.add({severity: 'error', summary: 'Error', detail: 'Transaction Reverted', life: 3000});
                    return false;
                }
            }).catch((e) => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                return false;
            })
    };

    onBeforeUnmount(() => {
        if (contract) {
            contract.removeAllListeners();
        }
    });

    return {
        mergedEvents,
        endsAt,
        startsAt,
        price,
        humanReadablePrice,
        initializeContractEvents,
        claimAgainstTokenIds
    };
}

export default useClaimAgainstTokenContractWithEvents;

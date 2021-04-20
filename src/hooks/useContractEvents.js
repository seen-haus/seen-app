import useWeb3 from "@/connectors/hooks";
import {formatEther, parseEther} from "@ethersproject/units";
import {BigNumber} from "@ethersproject/bignumber";
import {useV1AuctionContract, useV1NftContract, useV2AuctionContract} from "@/hooks/useContract";
import {computed, ref, onBeforeUnmount} from 'vue';
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {Web3Provider} from "@ethersproject/providers";
import parseError from "@/services/utils/parseError";
import {useToast} from "primevue/usetoast";

export default function useContractEvents() {
    const {converEthToUSD} = useExchangeRate();
    const {account, provider} = useWeb3();
    const toast = useToast();
    const collectable = ref(null);
    const contractAddress = ref(null);
    const mergedEvents = ref([]);
    const supply = ref(0);
    const endsAt = ref(0);
    let contract = null;

    const isAuction = computed(() => collectable.value.purchase_type === PURCHASE_TYPE.AUCTION);
    const version = computed(() => collectable.value ? collectable.value.version : '1.0');

    const createNormalizedEvent = async (contractEvent, type) => {
        const trx = await contractEvent.getTransaction();
        const blockNumber = await contractEvent.getBlock();
        const tx = trx.hash;
        // Map the event to current structure
        // The same event will cale through event listener
        const evt = contractEvent.decode(contractEvent.data, contractEvent.topics);
        const wallet_address = type === 'bid' ? evt.who : evt.buyer;
        const ethAmount = type === 'bid'
            ? parseFloat(formatEther(evt.amount), 10)
            : parseInt(evt.amount) * collectable.value.price;

        const event = {
            collectable_id: collectable.value.id,
            created_at: new Date(blockNumber.timestamp * 1000),
            event_type: type,
            id: Math.random(),
            tx,
            updated_at: null,
            value: ethAmount,
            amount: type === 'buy' ? evt.amount.toString() : 1,
            value_in_usd: converEthToUSD(ethAmount),
            wallet_address,
            raw: JSON.stringify(evt)
        };
        return event;
    };

    const mergeEvents = (event) => {
        const evts = [...mergedEvents.value];
        const existingEvt = evts.find(evt => evt.tx === event.tx);
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

    const initializeContractEvents = async (collectableData, onlySaveContractAddress = false) => {
        collectable.value = collectableData;
        contractAddress.value = collectableData.contract_address;
        endsAt.value = new Date(collectable.value.ends_at).getTime();

        console.log('initials ends at', endsAt.value);
        if (onlySaveContractAddress) {
            return;
        }
        mergedEvents.value = collectableData.events;

        // !! IMPORTANT !! remove listeners on beforeDestroy
        // ============= IF is AUCTION =============
        if (isAuction.value) {
            if (!contractAddress.value) {
               return;
            }
            contract = version.value === 1
                ? useV1AuctionContract(contractAddress.value)
                : useV2AuctionContract(contractAddress.value);
            if (version.value === 2) {
                let endTime = await contract.endTime()
                collectable.value.ends_at = new Date(parseInt(endTime) * 1000)
                endsAt.value = new Date(parseInt(endTime) * 1000)
                console.log("UPDATED ===>>",  endsAt.value)
            }
            await contract.on("Bid", async (fromAddress, amount, evt) => {
                console.log(fromAddress, amount, evt)
                const event = await createNormalizedEvent(evt, 'bid');
                if (version.value === 2) {
                    let endTime = await contract.endTime()
                    console.log(endTime)
                    collectable.value.ends_at = parseInt(endTime) * 1000
                    endsAt.value = new Date(parseInt(endTime) * 1000)
                }
                mergeEvents(event);
            });

            const bids = await contract.queryFilter("Bid");
            bids.forEach(async (bid) => {
                const event = await createNormalizedEvent(bid, 'bid');
                mergeEvents(event);
            });

        } else { // ============= IF is SALE =============
            if (!contractAddress.value) {
               return;
            }
            contract = version.value === 1
                ? useV1NftContract(contractAddress.value)
                : useV1NftContract(contractAddress.value);

            let start = await contract.start();
            let price = await contract.price();

            supply.value = +(await contract.supply()).toString();
            //
            console.log("START TIME ", start);
            console.log("PRICE ", price);
            console.log("SUPPLY LEFT ", supply.value);

            await contract.on("Buy", async (fromAddress, amount, evt) => {
                // Handle bid event: check SUPPLY LEFT, add evt to Events (same decoding process as auction)
                // console.log(fromAddress, amount.toString(), evt)
                const event = await createNormalizedEvent(evt, 'buy');
                mergeEvents(event);
                supply.value = +(await contract.supply()).toString();
            });

            const buys = await contract.queryFilter("Buy");
            console.group('Past Events - Sale');
            buys.forEach(async (buy) => {
                const event = await createNormalizedEvent(buy, 'buy');
                mergeEvents(event);
            });
            console.groupEnd('Past Events - Sale');

        }

        return true;
    };


    const bid = async (amount) => {
        console.log(amount, "BUT")
        if (amount == null) return;
        if (!contractAddress.value) return;
        const temporaryContract = version.value === 1
            ? useV1AuctionContract(contractAddress.value, true)
            : useV2AuctionContract(contractAddress.value, true)

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
            toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
        });

        amount = parseEther((amount).toString());
        let tx = await temporaryContract.bid({from: account.value.toString(), value: amount.toString(), gasPrice});
        return tx.wait()
            .then(() => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Your bid was accepted.',
                    life: 3000
                });
                return true;
            }).catch((e) => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                return false;
            })
    };

    const buy = async (amount) => {
        const price = (collectable.value && collectable.value.price);

        const value = BigNumber.from(amount.toString()).mul(parseEther(price.toFixed(8)))

        if (price == null || amount == null) return;

        if (!contractAddress.value) return;
        let temporaryContract = useV1NftContract(contractAddress.value, true);
        let qty = amount;

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        let tx = await temporaryContract.buy(qty.toString(), {
            gasPrice: gasPrice.toString(),
            value: value.toString(),
            from: account.value
        }).catch(e => {
            let message = parseError(e.message)
            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
        });

        return tx.wait()
            .then(() => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'You have successfully bought the drop.',
                    life: 3000
                });
                return true;
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
        supply,
        endsAt,
        initializeContractEvents,
        bid,
        buy,
    };
}

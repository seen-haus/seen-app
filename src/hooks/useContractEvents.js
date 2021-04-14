import useWeb3 from "@/connectors/hooks"
import {formatEther, parseEther} from "@ethersproject/units";
import {useV1AuctionContract, useV1NftContract} from "@/hooks/useContract";
import {BigNumber} from "@ethersproject/bignumber";
import {computed, ref, onBeforeUnmount} from 'vue';
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {Web3Provider} from "@ethersproject/providers"

export default function useContractEvents() {
    const {converEthToUSD} = useExchangeRate();
    const {account, provider} = useWeb3();
    const contractAddress = ref(null);
    const mergedEvents = ref([]);
    const lastBid = ref(null);
    const collectable = ref(null);
    const contractSubscription = ref(null);
    let contract = null;

    const destroySubscriptions = () => {
        if (contract) {
            contract.removeAllListeners();
        }
    };

    onBeforeUnmount(() => {
        destroySubscriptions();
    })


    const isAuction = computed(
        () => collectable.value.purchase_type === PURCHASE_TYPE.AUCTION
    );

    const version = computed(() => {
        return collectable.value ? collectable.value.version : '1.0';
    });

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
    }

    const bid = async (amount) => {
        if (amount == null) return;
        // 1. get new contract
        if (!contractAddress.value) return; // do toastr
        const temporaryContract = useV1AuctionContract(contractAddress.value, true); // contract.value
        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice();
        amount = parseEther((BigNumber.from(amount)).toString());
        console.log(formatEther(amount));
        let tx = await temporaryContract.bid({gasPrice})
        // await tx.wait();
    }

    // If click on buy
    const buy = async (amount) => {
        const price = collectable.value && collectable.value.price;
        if (price == null || amount == null) return;
        // 1. get new contract
        if (!contractAddress.value) return; // do toastr
        let temporaryContract = useV1NftContract(contractAddress.value, true)
        let qty = (new BigNumber(amount)); // 1 ETH
        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice();
        let value = parseEther(qty * price);
        let tx = temporaryContract.buy(qty.toString(), {gasPrice, value, from: account.value})
        await tx.wait()
        console.log('buyed')
    }

    const createNormalizedEvent = async (contractEvent, type) => {
        const trx = await contractEvent.getTransaction();
        const blockNumber = await contractEvent.getBlock();
        const tx = trx.hash;
        // Map the event to current structure
        // The same event will cale through event listener
        const evt = contractEvent.decode(contractEvent.data, contractEvent.topics);
        const wallet_address = type === 'bid' ? evt.who : evt.buyer;
        const ethAmount = parseFloat(formatEther(evt.amount), 10);

        const event = {
            collectable_id: collectable.value.id,
            created_at: new Date(blockNumber.timestamp * 1000),
            event_type: type,
            id: Math.random(),
            tx,
            updated_at: null,
            value: ethAmount,
            value_in_usd: converEthToUSD(ethAmount),
            wallet_address,
            raw: JSON.stringify(evt)
        }
        return event;
    }

    const initializeContractEvents = async (collectableData, onlySaveContractAddress = false) => {
        collectable.value = collectableData;
        contractAddress.value = collectableData.contract_address;

        if (onlySaveContractAddress) {
            return;
        }
        mergedEvents.value = collectableData.events;
        // !! IMPORTANT !! remove listeners on beforeDestroy

        // ============= IF is AUCTION =============
        if (isAuction.value) {
            // EXAMPLE https://etherscan.io/address/0xCEDC9a3c76746F288C87c0eBb0468A1b57484cb1#readContract
            if (version.value === 1) {
                // TODO: Uncomment next line, delete one after it.
                contract = useV1AuctionContract(contractAddress.value)
                // contract = useV1AuctionContract('0x8b8f82719135fd2904e34ed7e515564304c76f95')
                // last bid
                lastBid.value = await contract.lastBid();
                console.log("lastBid in ETH ", formatEther(lastBid.value))

                // End Auction date
                let auctionLength = await contract.auctionLength()
                let startBidTime = await contract.startBidTime()
                console.log("ENDS auctionLength + startBidTime", auctionLength.toString(), startBidTime.toString())

                // End Subscribe to event
                await contract.on("Bid", async (evt) => {
                    const event = createNormalizedEvent(evt, 'bid');
                    mergeEvents(event);
                    lastBid.value = event;
                    auctionLength = await contract.auctionLength();

                    // Handle bid event: add to events, check/update end time, update min bid!
                });
                // !! DONT FORGET !! await contract.off("Bid") https://docs.ethers.io/v5/api/contract/contract/#Contract-on
                // Get past bids
                // log_cab346fb
                // log_1e644af9
                const bids = await contract.queryFilter("Bid");
                console.group('Past Events - Auction')
                bids.forEach(async (bid) => {
                    const event = await createNormalizedEvent(bid, 'bid');
                    mergeEvents(event);
                });
                console.groupEnd('Past Events - Auction')

            }

            if (version.value === 2) {
                console.log("VERSION v2")
            }

            // ============= IF is SALE =============
        } else {

            if (version.value === 1) {
                // useV1TangibleContract
                contract = useV1NftContract(contractAddress.value)
                let start = await contract.start()
                let price = await contract.price()
                let supply = await contract.supply()
                //
                console.log("START TIME ", start)
                console.log("PRICE ", price)
                console.log("SUPPLY LEFT ", supply)
                await contract.on("Buy", async (evt) => {
                    // Handle bid event: check SUPPLY LEFT, add evt to Events (same decoding process as auction)
                    const event = await createNormalizedEvent(evt, 'buy');
                    mergeEvents(event);
                    supply = await contract.supply();
                })

                const buys = await contract.queryFilter("Buy")
                console.group('Past Events - Sale')
                buys.forEach(async (buy) => {
                    const event = await createNormalizedEvent(buy, 'buy');
                    mergeEvents(event)
                });
                console.groupEnd('Past Events - Sale')

            }
            if (version.value === 2) {
                console.log("VERSION v2")
            }

        }

        return true;
    };

    return {
        mergedEvents,
        lastBid,
        initializeContractEvents,
        bid,
        buy,
    };
}

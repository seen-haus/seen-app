import useWeb3 from "@/connectors/hooks";
import {formatEther, parseEther} from "@ethersproject/units";
import {BigNumber} from "@ethersproject/bignumber";
import {
    useV1AuctionContract,
    useV1NftContract,
    useV2AuctionContract,
    useV2OpenEditionContract,
    useV2VRFSaleContract,
    useRandomNumberConsumerContract,
} from "@/hooks/useContract";
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
    const itemsBought = ref(0);
    const endsAt = ref(0);
    const startsAt = ref(0);
    const minimumStartsAt = ref(0);
    const hasRequestedVRF = ref(false);
    const hasFulfilledVRF = ref(false);
    const hasCommittedVRF = ref(false);
    const incomingBidSound = require("@/assets/sounds/bid_notification.mp3");
    let contract = null;
    let randomNumberConsumerContract = null;

    const isAuction = computed(() => collectable.value.purchase_type === PURCHASE_TYPE.AUCTION);
    const version = computed(() => collectable.value ? collectable.value.version : '1.0');
    const isOpenEdition = computed(() => collectable.value.is_open_edition);
    const isVRFSale = computed(() => collectable.value.is_vrf_drop);

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
        try {
            collectable.value = collectableData;
            contractAddress.value = collectableData.contract_address;
            endsAt.value = new Date(collectable.value.ends_at).getTime();
            startsAt.value = new Date(collectable.value.starts_at).getTime();
            minimumStartsAt.value = 0;

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
                    let startTime = await contract.startTime()
                    if(Number(endTime) > 0) {
                        collectable.value.ends_at = new Date(parseInt(endTime) * 1000)
                        endsAt.value = new Date(parseInt(endTime) * 1000)
                    } else {
                        collectable.value.ends_at = null
                        endsAt.value = null
                    }
                    if(collectable.value.is_reserve_price_auction) {
                        if(Number(startTime) > 0) {
                            collectable.value.starts_at = new Date(parseInt(startTime) * 1000)
                            startsAt.value = new Date(parseInt(startTime) * 1000)
                        }else{
                            let minimumStartTime = await contract.minimumStartTime();
                            collectable.value.minimum_starts_at = new Date(parseInt(minimumStartTime) * 1000);
                            minimumStartsAt.value = new Date(parseInt(minimumStartTime) * 1000);
                        }
                    }
                    console.log("UPDATED ===>>",  {endsAt: endsAt.value, startsAt: startsAt.value, minimumStartsAt: minimumStartsAt.value})
                }
                await contract.on("Bid", async (fromAddress, amount, evt) => {
                    console.log(fromAddress, amount, evt)
                    const event = await createNormalizedEvent(evt, 'bid');
                    if (version.value === 2) {
                        let endTime = await contract.endTime()
                        let startTime = await contract.startTime()
                        console.log(endTime)
                        collectable.value.ends_at = parseInt(endTime) * 1000
                        endsAt.value = new Date(parseInt(endTime) * 1000)
                        if(startTime > 0) {
                            collectable.value.starts_at = new Date(parseInt(startTime) * 1000)
                            startsAt.value = new Date(parseInt(startTime) * 1000)
                        }
                        let notification = new Audio(incomingBidSound)
                        notification.addEventListener("canplaythrough", () => {
                            notification.play();
                        });
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
                if(isOpenEdition.value) {
                    contract = useV2OpenEditionContract(contractAddress.value)
                    let endTime = await contract.endTime()
                    let startTime = await contract.start()
                    if(startTime > 0) {
                        collectable.value.starts_at = new Date(parseInt(startTime) * 1000)
                        startsAt.value = new Date(parseInt(startTime) * 1000)
                    }
                    if(Number(endTime) > 0) {
                        collectable.value.ends_at = new Date(parseInt(endTime) * 1000)
                        endsAt.value = new Date(parseInt(endTime) * 1000)
                    }
                    itemsBought.value = +(await contract.buyCount()).toString();
                }else if(isVRFSale.value) {
                    contract = useV2VRFSaleContract(contractAddress.value)
                    let endTime = await contract.end()
                    let startTime = await contract.start()
                    let randomnessRequestId = await contract.randomNumberRequestId();
                    // TODO uncomment below start time override, only needs to be commented for 30 minutes from the time of this commit
                    // if(startTime > 0) {
                    //     collectable.value.starts_at = new Date(parseInt(startTime) * 1000)
                    //     startsAt.value = new Date(parseInt(startTime) * 1000)
                    // }
                    if(Number(endTime) > 0) {
                        collectable.value.ends_at = new Date(parseInt(endTime) * 1000)
                        endsAt.value = new Date(parseInt(endTime) * 1000)
                    }
                    itemsBought.value = +(await contract.ticketId()).toString();

                    // VRF events
                    //hasRequestedVRF,hasCommittedVRF
                    await contract.on("RequestedVRF", async () => {
                        hasRequestedVRF.value = true;
                        randomnessRequestId = await contract.randomNumberRequestId();
                    });

                    let randomNumberConsumerAddress = await contract.vrfProvider();
                    randomNumberConsumerContract = useRandomNumberConsumerContract(randomNumberConsumerAddress);
                    await randomNumberConsumerContract.on("FulfilledVRF", async (fulfilledRequestId) => {
                        randomnessRequestId = await contract.randomNumberRequestId();
                        if(fulfilledRequestId === randomnessRequestId) {
                            hasRequestedVRF.value = true;
                            hasFulfilledVRF.value = true;
                        }
                    });

                    await contract.on("CommittedVRF", async () => {
                        hasRequestedVRF.value = true;
                        hasFulfilledVRF.value = true;
                        hasCommittedVRF.value = true;
                    });


                    const vrfRequestedEvents = await contract.queryFilter("RequestedVRF");
                    // There can only be one, so:
                    for(let vrfRequestedEvent of vrfRequestedEvents) {

                        hasRequestedVRF.value = true;

                        randomnessRequestId = await contract.randomNumberRequestId();
                        console.log({randomnessRequestId})
                        let vrfFulfillmentFilter = randomNumberConsumerContract.filters.FulfilledVRF(randomnessRequestId, null);
                        const vrfFulfilledEvents = await randomNumberConsumerContract.queryFilter(vrfFulfillmentFilter);
                        // There can only be one, so:
                        for(let vrfFulfilledEvent of vrfFulfilledEvents) {
                            hasFulfilledVRF.value = true;

                            const vrfCommittedEvents = await contract.queryFilter("CommittedVRF");
                            // There can only be one, so:
                            for(let vrfCommittedEvent of vrfCommittedEvents) {
                                hasCommittedVRF.value = true;
                            }
                        }
                    }
                } else {
                    contract = version.value === 1
                        ? useV1NftContract(contractAddress.value)
                        : useV1NftContract(contractAddress.value);

                    supply.value = +(await contract.supply()).toString();
                    
                }

                let start = await contract.start();
                let price = await contract.price();

                //
                console.log("START TIME ", start);
                console.log("PRICE ", price);
                console.log("SUPPLY LEFT ", supply.value);
                console.log("ITEMS BOUGHT OPEN EDITION ", itemsBought.value);

                await contract.on("Buy", async (fromAddress, amount, evt) => {
                    // Handle bid event: check SUPPLY LEFT, add evt to Events (same decoding process as auction)
                    // console.log(fromAddress, amount.toString(), evt)
                    const event = await createNormalizedEvent(evt, 'buy');
                    if(isOpenEdition.value) {
                        itemsBought.value = +(await contract.buyCount()).toString();
                    } else if(isVRFSale.value) {
                        itemsBought.value = +(await contract.ticketId()).toString();
                    } else{
                        let remainingSupply = +(await contract.supply()).toString()
                        supply.value = remainingSupply;
                    }
                    mergeEvents(event);
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
        }catch(e){
            console.log({'initializeContractEvents error': e})
        }
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

    const requestRandomness = async () => {
        if (!contractAddress.value || !provider.value) return;
        let vrfContract = useV2VRFSaleContract(contractAddress.value)

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        let tx = await await vrfContract.initiateRandomDistribution({
            gasPrice: gasPrice.toString(),
            from: account.value
        }).catch(e => {
            let message = parseError(e.message)
            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
        });

        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    hasRequestedVRF.value = true;
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully requested randomness from Chainlink.',
                        life: 5000
                    });
                } else {
                    toast.add({severity: 'error', summary: 'Error', detail: `Error requesting Chainlink randomness`, life: 3000});
                }
                return true;
            }).catch((e) => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                return false;
            })
    }

    const commitRandomness = async () => {
        if (!contractAddress.value || !provider.value) return;
        let vrfContract = useV2VRFSaleContract(contractAddress.value)

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        let tx = await await vrfContract.commitRandomDistribution({
            gasPrice: gasPrice.toString(),
            from: account.value
        }).catch(e => {
            let message = parseError(e.message)
            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
        });

        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    hasRequestedVRF.value = true;
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully committed the randomness from Chainlink.',
                        life: 5000
                    });
                } else {
                    toast.add({severity: 'error', summary: 'Error', detail: `Error committing Chainlink randomness`, life: 3000});
                }
                return true;
            }).catch((e) => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                return false;
            })
    }

    const claimTokensSaleVRF = async () => {
        if (!contractAddress.value || !provider.value) return;
        let vrfContract = useV2VRFSaleContract(contractAddress.value)

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        let tx = await await vrfContract.claimAssigned({
            gasPrice: gasPrice.toString(),
            from: account.value
        }).catch(e => {
            let message = parseError(e.message)
            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
        });

        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    hasRequestedVRF.value = true;
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully claimed your assigned tokens.',
                        life: 5000
                    });
                } else {
                    toast.add({severity: 'error', summary: 'Error', detail: `Error claiming assigned tokens`, life: 3000});
                }
                return true;
            }).catch((e) => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                return false;
            })
    }

    onBeforeUnmount(() => {
        if (contract) {
            contract.removeAllListeners();
        }
        if(randomNumberConsumerContract) {
            randomNumberConsumerContract.removeAllListeners();
        }
    });

    return {
        mergedEvents,
        supply,
        itemsBought,
        endsAt,
        startsAt,
        minimumStartsAt,
        hasRequestedVRF,
        hasFulfilledVRF,
        hasCommittedVRF,
        initializeContractEvents,
        bid,
        buy,
        requestRandomness,
        commitRandomness,
        claimTokensSaleVRF,
    };
}

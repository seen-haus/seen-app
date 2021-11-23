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
    useV3NftContractNetworkReactive,
    useV3TicketerContractNetworkReactive,
    useV3MarketClerkContractNetworkReactive,
    useV3MarketConfigContractNetworkReactive,
    useV3AuctionRunnerContractNetworkReactive,
    useV3AuctionBuilderContractNetworkReactive,
    useV3AuctionEnderContractNetworkReactive,
    useV3SaleRunnerContractNetworkReactive,
    useV3SaleBuilderContractNetworkReactive,
    useV3SaleEnderContractNetworkReactive,
} from "@/hooks/useContract";
import {computed, ref, onBeforeUnmount} from 'vue';
import PURCHASE_TYPES from "@/constants/PurchaseTypes.js";
import MARKET_TYPES from "@/constants/MarketTypes.js";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {Web3Provider} from "@ethersproject/providers";
import parseError from "@/services/utils/parseError";
import {useToast} from "primevue/usetoast";

const useMarketContractEvents = () => {
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
    const isReadyForClosure = ref(false);
    const isClosed = ref(false);
    const isCancelled = ref(false);
    const winningAddress = ref(false);
    const incomingBidSound = require("@/assets/sounds/bid_notification.mp3");
    let contract = null;
    let randomNumberConsumerContract = null;
    let builderContract = null;
    let enderContract = null;
    let checkClosureStatusFn = ref(false);

    const isAuction = computed(() => collectable.value.purchase_type === PURCHASE_TYPES.AUCTION);
    const version = computed(() => collectable.value ? collectable.value.version : '1.0');
    const isOpenEdition = computed(() => collectable.value.is_open_edition);
    const isVRFSale = computed(() => collectable.value.is_vrf_drop);

    const createNormalizedEvent = async (contractEvent, type) => {
        console.log({contractEvent})
        const trx = await contractEvent.getTransaction();
        const blockNumber = await contractEvent.getBlock();
        const tx = trx.hash;
        // Map the event to current structure
        // The same event will cale through event listener
        const evt = contractEvent.decode(contractEvent.data, contractEvent.topics);

        let wallet_address;
        if (type === 'bid-v3') {
            // event BidAccepted(uint256 indexed consignmentId, address indexed buyer, uint256 indexed bid);
            wallet_address = evt.buyer;
        } else if (type === 'buy-v3') {
            // event Purchase(uint256 indexed consignmentId,  uint256 indexed amount, address indexed buyer);
            wallet_address = evt.buyer;
        } else if(type === 'bid') {
            wallet_address = evt.who;
        } else if (type === 'buy') {
            wallet_address = evt.buyer;
        }

        let ethAmount;
        let unitAmount;
        if (type === 'bid-v3') {
            // event BidAccepted(uint256 indexed consignmentId, address indexed buyer, uint256 indexed bid);
            ethAmount = parseFloat(formatEther(evt.bid), 10)
            unitAmount = 1;
        } else if (type === 'buy-v3') {
            // event Purchase(uint256 indexed consignmentId,  uint256 indexed amount, address indexed buyer);
            ethAmount = parseInt(evt.amount) * collectable.value.price;
            unitAmount = evt.amount.toString();
        } else if(type === 'bid') {
            ethAmount = parseFloat(formatEther(evt.amount), 10)
            unitAmount = 1;
        } else if (type === 'buy') {
            ethAmount = parseInt(evt.amount) * collectable.value.price;
            unitAmount = evt.amount.toString();
        }

        const event = {
            collectable_id: collectable.value.id,
            created_at: new Date(blockNumber.timestamp * 1000),
            event_type: type,
            id: Math.random(),
            tx,
            updated_at: null,
            value: ethAmount,
            amount: unitAmount,
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
            const consignmentId = collectableData.consignment_id;

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
                
                if(version.value === 1) {
                    contract = useV1AuctionContract(contractAddress.value);
                } else if (version.value === 2) {
                    contract = useV2AuctionContract(contractAddress.value);
                } else if (version.value === 3) {
                    const auctionRunnerContractRaw = await useV3AuctionRunnerContractNetworkReactive();
                    contract = auctionRunnerContractRaw.state.contract;
                }
                if (version.value === 3) {
                    const auctionBuilderContractRaw = await useV3AuctionBuilderContractNetworkReactive();
                    builderContract = auctionBuilderContractRaw.state.contract;

                    const auctionEnderContractRaw = await useV3AuctionEnderContractNetworkReactive();
                    enderContract = auctionEnderContractRaw.state.contract;

                    let auction = await builderContract.getAuction(consignmentId)
                    let parsedStartTime = parseInt(auction.start);
                    if(Number(auction.state) === 0) {
                        // Auction pending (i.e. hasn't started yet)
                        collectable.value.ends_at = null
                        endsAt.value = null
                        if((parsedStartTime * 1000) > new Date().getTime()) {
                            collectable.value.minimum_starts_at = new Date(parsedStartTime * 1000);
                            minimumStartsAt.value = new Date(parsedStartTime * 1000);
                        } else {
                            collectable.value.starts_at = new Date(parsedStartTime * 1000)
                            startsAt.value = new Date(parsedStartTime * 1000)
                        }
                    } else if(auction.duration) {
                        // Auction has started, derive ending
                        winningAddress.value = auction.buyer;
                        collectable.value.starts_at = new Date(parsedStartTime * 1000)
                        startsAt.value = new Date(parsedStartTime * 1000)
                        let endsAtMilliseconds = (parseInt(auction.start) + parseInt(auction.duration)) * 1000;
                        collectable.value.ends_at = new Date(endsAtMilliseconds)
                        endsAt.value = new Date(endsAtMilliseconds)
                        if((endsAtMilliseconds < new Date().getTime()) && (Number(auction.state) === 1)) {
                            isReadyForClosure.value = true;
                        } else if(Number(auction.state) === 2) {
                            isClosed.value = true;
                        }
                        if(Number(auction.outcome) === 2) {
                            isCancelled.value = true;
                        }
                    }

                    const checkClosureStatus = async (consignmentId) => {
                        console.log({consignmentId})
                        let auction = await builderContract.getAuction(consignmentId)
                        console.log({auction})
                        let parsedStartTime = parseInt(auction.start);
                        if(auction.duration) {
                            // Auction has started, derive ending
                            collectable.value.starts_at = new Date(parsedStartTime * 1000)
                            startsAt.value = new Date(parsedStartTime * 1000)
                            let endsAtMilliseconds = (parseInt(auction.start) + parseInt(auction.duration)) * 1000;
                            collectable.value.ends_at = new Date(endsAtMilliseconds)
                            endsAt.value = new Date(endsAtMilliseconds)
                            if((endsAtMilliseconds < new Date().getTime()) && (Number(auction.state) === 1)) {
                                isReadyForClosure.value = true;
                            } else if(Number(auction.state) === 2) {
                                isClosed.value = true;
                            }
                            if(Number(auction.outcome) === 2) {
                                isCancelled.value = true;
                            }
                        }
                    }

                    checkClosureStatusFn.value = checkClosureStatus;

                    let filter = contract.filters.BidAccepted(consignmentId, null, null);
                    // BidAccepted(_consignmentId, auction.buyer, auction.bid);
                    await contract.on(filter, async (consignmentId, fromAddress, amount, evt) => {
                        const event = await createNormalizedEvent(evt, 'bid-v3');
                        let auction = await builderContract.getAuction(consignmentId)
                        winningAddress.value = auction.buyer;
                        console.log({auction})
                        let parsedStartTime = parseInt(auction.start);
                        if(auction.duration) {
                            // Auction has started, derive ending
                            collectable.value.ends_at = new Date((parseInt(auction.start) + parseInt(auction.duration)) * 1000)
                            endsAt.value = new Date((parseInt(auction.start) + parseInt(auction.duration)) * 1000)
                            collectable.value.starts_at = new Date(parsedStartTime * 1000)
                            startsAt.value = new Date(parsedStartTime * 1000)
                            console.log({parsedStartTime, 'collectable.value.ends_at': collectable.value.ends_at, 'endsAt.value': endsAt.value, 'collectable.value.starts_at': collectable.value.starts_at, 'startsAt.value': startsAt.value})
                            let notification = new Audio(incomingBidSound)
                            notification.addEventListener("canplaythrough", () => {
                                notification.play();
                            });
                        }
                        mergeEvents(event);
                    });

                    let endFilter = enderContract.filters.AuctionEnded(consignmentId, null);
                    await enderContract.on(endFilter, async (consignmentId, outcome, evt) => {
                        console.log("Runs end event")
                        isClosed.value = true;
                        isReadyForClosure.value = false;
                        if(Number(outcome) === 2) {
                            isCancelled.value = true;
                        }
                    });

                    //event AuctionEnded(uint256 indexed consignmentId, SeenTypes.Outcome indexed outcome);

                    const bids = await contract.queryFilter(filter);
                    bids.forEach(async (bid) => {
                        const event = await createNormalizedEvent(bid, 'bid-v3');
                        mergeEvents(event);
                    });

                } else if(version.value === 1 || version.value === 2) {
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
                        const event = await createNormalizedEvent(evt, 'bid');
                        if (version.value === 2) {
                            let endTime = await contract.endTime()
                            let startTime = await contract.startTime()
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
                }
            } else { // ============= IF is SALE =============
                if (!contractAddress.value) {
                return;
                }
                if (version.value === 3) {
                    const saleRunnerContractRaw = await useV3SaleRunnerContractNetworkReactive();
                    contract = saleRunnerContractRaw.state.contract;
                } else if(version.value === 2) {
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
                        if(startTime > 0) {
                            collectable.value.starts_at = new Date(parseInt(startTime) * 1000)
                            startsAt.value = new Date(parseInt(startTime) * 1000)
                        }
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
                        contract = useV2OpenEditionContract(contractAddress.value)
                        itemsBought.value = +(await contract.buyCount()).toString();
                    }
                } else if (version.value === 1) {
                    contract = useV1NftContract(contractAddress.value);
                    supply.value = +(await contract.supply()).toString();
                }

                if(version.value === 3) {

                    const saleBuilderContractRaw = await useV3SaleBuilderContractNetworkReactive();
                    builderContract = saleBuilderContractRaw.state.contract;

                    const saleEnderContractRaw = await useV3SaleEnderContractNetworkReactive();
                    enderContract = saleEnderContractRaw.state.contract;

                    const marketClerkContractRaw = await useV3MarketClerkContractNetworkReactive();
                    let marketClerkContract = marketClerkContractRaw.state.contract;

                    const checkClosureStatus = async (consignmentId) => {
                        // Recheck closure status
                        console.log({consignmentId})
                        let sale = await builderContract.getSale(consignmentId);
                        console.log({sale})
                        if(sale) {
                            if(Number(sale.state) === 2) {
                                isClosed.value = true;
                            }
                            if(Number(sale.outcome) === 2) {
                                isCancelled.value = true;
                            } else if (Number(sale.outcome) === 0) {
                                // Get consignment to derive if sale is ready to be closed
                                let consignment = await marketClerkContract.getConsignment(consignmentId);
                                if(Number(consignment.supply) === Number(consignment.releasedSupply)) {
                                    isReadyForClosure.value = true;
                                } else {
                                    if(Number(consignment.market) === MARKET_TYPES.PRIMARY) {
                                        // Check if this is a physical
                                        const seenV3NFTContractRaw = await useV3NftContractNetworkReactive();
                                        const seenV3NFTContract = seenV3NFTContractRaw.state.contract;

                                        let isPhysical = await seenV3NFTContract.isPhysical(consignment.tokenId);

                                        if(isPhysical) {
                                            //check if the tickets issued = supply of sale
                                            const marketConfigContractRaw = await useV3MarketConfigContractNetworkReactive();
                                            let marketConfigContract = marketConfigContractRaw.state.contract;
                                            let ticketer = await marketConfigContract.getEscrowTicketer(consignmentId);

                                            // Get total claims issued via tickets
                                            const ticketerContractRaw = await useV3TicketerContractNetworkReactive(false, ticketer);
                                            const ticketerContract = ticketerContractRaw.state.contract;

                                            let ticketClaimsIssued = await ticketerContract.getTicketClaimableCount(consignment.id);

                                            if(Number(ticketClaimsIssued) === Number(consignment.releasedSupply)) {
                                                isReadyForClosure.value = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    await checkClosureStatus(consignmentId);
                    
                    let filter = contract.filters.Purchase(consignmentId, null, null);

                    await contract.on(filter, async (consignmentId, fromAddress, amount, value, evt) => {
                        const event = await createNormalizedEvent(evt, 'buy-v3');
                        itemsBought.value = +(amount).toString();
                        mergeEvents(event);
                        await checkClosureStatus(consignmentId);
                    });

                    let endFilter = enderContract.filters.SaleEnded(consignmentId, null);
                    await enderContract.on(endFilter, async (consignmentId, outcome, evt) => {
                        isClosed.value = true;
                        isReadyForClosure.value = false;
                        if(Number(outcome) === 2) {
                            isCancelled.value = true;
                        }
                    });

                    const buys = await contract.queryFilter(filter);
                    buys.forEach(async (buy) => {
                        const event = await createNormalizedEvent(buy, 'buy-v3');
                        mergeEvents(event);
                    });
                } else if (version.value === 1 || version.value === 2) {
                    let start = await contract.start();
                    let price = await contract.price();

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
            }

            return true;
        }catch(e){
            console.log({'initializeContractEvents error': e})
        }
    };


    const bid = async (amount, consignmentId) => {
        if (amount == null) return;
        if (!contractAddress.value) return;
        let temporaryContract;
        if(version.value === 3) {
            const auctionRunnerContractRaw = await useV3AuctionRunnerContractNetworkReactive(true);
            temporaryContract = auctionRunnerContractRaw.state.contract;
        } else if(version.value === 2) {
            temporaryContract = useV2AuctionContract(contractAddress.value, true)
        } else if (version.value === 1) {
            temporaryContract = useV1AuctionContract(contractAddress.value, true)
        }

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
            toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
        });

        amount = parseEther((amount).toString());
        let tx;
        if(version.value === 3) {
            tx = await temporaryContract.bid(consignmentId, {from: account.value.toString(), value: amount.toString(), gasPrice});
        } else if(version.value === 2 || version.value === 1) {
            tx = await temporaryContract.bid({from: account.value.toString(), value: amount.toString(), gasPrice});
        }
        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Your bid was accepted.',
                        life: 3000
                    });
                    return true;
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

    const buy = async (amount, consignmentId) => {
        const price = (collectable.value && collectable.value.price);

        const value = BigNumber.from(amount.toString()).mul(parseEther(price.toFixed(8)))

        if (price == null || amount == null) return;

        if (!contractAddress.value) return;

        let temporaryContract;
        if(version.value === 3) {
            const saleRunnerContractRaw = await useV3SaleRunnerContractNetworkReactive(true);
            temporaryContract = saleRunnerContractRaw.state.contract;
        } else if(version.value === 2) {
            temporaryContract = useV1NftContract(contractAddress.value, true);
        } else if (version.value === 1) {
            temporaryContract = useV1NftContract(contractAddress.value, true);
        }
        let qty = amount;

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice()
            .catch((e) => {
                toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
            });

        let tx;
        if(version.value === 3) {
            tx = await temporaryContract.buy(consignmentId, qty.toString(), {
                gasPrice: gasPrice.toString(),
                value: value.toString(),
                from: account.value
            }).catch(e => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
            });
        } else if(version.value === 2 || version.value === 1) {
            tx = await temporaryContract.buy(qty.toString(), {
                gasPrice: gasPrice.toString(),
                value: value.toString(),
                from: account.value
            }).catch(e => {
                let message = parseError(e.message)
                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
            });
        }

        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully bought the drop.',
                        life: 3000
                    });
                    return true;
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

    const closeAuctionV3 = async (consignmentId) => {
        if (consignmentId !== 0 && !consignmentId) return;

        const auctionEnderContractRaw = await useV3AuctionEnderContractNetworkReactive(true);
        let temporaryContract = auctionEnderContractRaw.state.contract;

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
            toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
        });

        let tx = await temporaryContract.closeAuction(consignmentId, {from: account.value.toString(), gasPrice});
        
        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have closed the auction.',
                        life: 3000
                    });
                    isReadyForClosure.value = false;
                    return true;
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

    const closeSaleV3 = async (consignmentId) => {
        if (consignmentId !== 0 && !consignmentId) return;

        const saleEnderContractRaw = await useV3SaleEnderContractNetworkReactive(true);
        let temporaryContract = saleEnderContractRaw.state.contract;

        const temporaryProvider = new Web3Provider(provider.value);
        const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
            toast.add({severity: 'error', summary: 'Error', detail: `You may be out of ETH`, life: 3000});
        });

        let tx = await temporaryContract.closeSale(consignmentId, {from: account.value.toString(), gasPrice});
        
        return tx.wait()
            .then((response) => {
                if(response.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have closed the sale.',
                        life: 3000
                    });
                    isReadyForClosure.value = false;
                    return true;
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
        if (builderContract) {
            builderContract.removeAllListeners();
        }
        if (enderContract) {
            console.log("ending end listener")
            enderContract.removeAllListeners();
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
        isReadyForClosure,
        isClosed,
        isCancelled,
        winningAddress,
        checkClosureStatusFn,
        initializeContractEvents,
        bid,
        buy,
        requestRandomness,
        commitRandomness,
        claimTokensSaleVRF,
        closeAuctionV3,
        closeSaleV3,
    };
}

export default useMarketContractEvents;

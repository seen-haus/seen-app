import { ref, computed, watch, onBeforeUnmount } from 'vue';

import useWeb3 from "@/connectors/hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther, parseEther } from "@ethersproject/units";

import useMarketContractEvents from "@/hooks/useMarketContractEvents";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import orderBy from "lodash/orderBy";

import {
    COLLECTABLE_TYPE,
    COLLECTABLE_STATE,
} from "@/constants/Collectables.js";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import MARKET_HANDLER_TYPES from "@/constants/MarketHandlerTypes.js";

import { marketHandlerToListingType } from '@/constants';

export default function useCollectableInformation(initialCollectable = {}) {
    const { converEthToUSD } = useExchangeRate();
    const {
        mergedEvents,
        initializeContractEvents,
        supply,
        itemsBought,
        isReadyForClosure,
        checkClosureStatusFn,
        isClosed,
        isCancelled,
        winningAddress,
        hasRequestedVRF,
        hasFulfilledVRF,
        hasCommittedVRF,
        endsAt: updatedEndsAt,
        startsAt: updatedStartsAt,
        minimumStartsAt: updatedMinimumStartsAt,
    } = useMarketContractEvents();

    const collectable = ref(initialCollectable);
    const events = ref(collectable.value.events || []);
    const bundleChildItems = computed(() => collectable.value.bundleChildItems);
    const pillOverride = computed(() => collectable.value.pill_override || false);
    const requiresRegistration = computed(() => collectable.value.requires_registration || false);
    const price = ref(0.0);
    const nextBidPrice = ref(0.0);
    const priceUSD = ref(0.0);
    const priceUSDSold = ref(0.0);
    const progress = ref(0.0);
    const items = ref(0);
    const itemsOf = ref(0);
    const collectableState = ref(COLLECTABLE_STATE.WAITING);

    const type = computed(() => collectable.value.type);
    const media = computed(() => collectable.value.media);
    const firstMedia = computed(() => { // Use preview image or first
        if (!media.value) return '';
        const found = media.value.find(v => v.is_preview);

        if (found) {
            return found.url;
        }
        let orderedMedia = orderBy(media.value, 'position', "asc")
        return orderedMedia[0].url || '';
    });
    const firstMediaType = computed(() => { // Use preview image or first
        if (!media.value) return '';
        const found = media.value.find(v => v.is_preview);

        if (found) {
            return found?.type?.indexOf('image') > -1 ? 'image' : 'video';
        }
        let orderedMedia = orderBy(media.value, 'position', "asc")
        return orderedMedia[0]?.type?.indexOf('image') > -1 ? 'image' : 'video';
    });
    const gallerySortedMedia = computed(() => collectable.value.mediaSorted);
    const artist = computed(() => collectable.value.artist);
    const artistStatement = computed(() => collectable.value.artist_statement);
    const title = computed(() => collectable.value.title);
    const description = computed(() => collectable.value.description);
    const version = computed(() => collectable.value.version);
    const is_sold_out = computed(
        () => {
            if (isAuction.value) return false;
            return collectableState.value === COLLECTABLE_STATE.OUT_OF_STOCK;
        }
    );
    const is_closed = computed(() => {
        return collectable.value ? collectable.value.is_closed : false;
    });
    const isCollectableActive = computed(() => {
        return (
            collectableState.value === COLLECTABLE_STATE.WAITING ||
            collectableState.value === COLLECTABLE_STATE.IN_PROGRESS ||
            collectableState.value === COLLECTABLE_STATE.AWAITING_RESERVE ||
            (!is_closed.value && !isReadyForClosure.value && !isClosed.value && !isCancelled.value && new Date(collectable.value.ends_at).getTime() > new Date().getTime())
        );
    });
    const edition = computed(() => collectable.value.edition || 0);
    const edition_of = computed(() => collectable.value.edition_of || 0);
    const isTangible = computed(
        () =>
            type.value === COLLECTABLE_TYPE.TANGIBLE ||
            type.value === COLLECTABLE_TYPE.TANGIBLE_NFT
    );
    const isNft = computed(
        () =>
            type.value === COLLECTABLE_TYPE.NFT ||
            type.value === COLLECTABLE_TYPE.TANGIBLE_NFT
    );
    const liveStatus = computed(() => {
        if (collectableState.value === COLLECTABLE_STATE.CLOSED) return "closed";
        if (collectableState.value === COLLECTABLE_STATE.DONE) {
            if(checkClosureStatusFn?.value && !isReadyForClosure.value && collectable.value && (collectable.value.consignment_id === 0 || collectable.value.consignment_id)) {
                checkClosureStatusFn.value(collectable.value.consignment_id.toString())
            }
            return "ended"
        }
        if (collectableState.value === COLLECTABLE_STATE.AWAITING_RESERVE) return "awaiting-reserve-bid";
        if (collectableState.value === COLLECTABLE_STATE.WAITING)
            return "coming soon";
        if (collectableState.value === COLLECTABLE_STATE.OUT_OF_STOCK) {
            if (!isAuction.value) {
                return "sold out";
            }
        }

        return "live";
    });
    const startsAt = computed(() => collectable.value.starts_at);
    const minimumStartsAt = computed(() => collectable.value.minimum_starts_at || collectable.value.starts_at);
    const endsAt = computed(() => collectable.value.ends_at);
    const claim = computed(() => collectable.value.claim ? collectable.value.claim : false);
    const isAuction = computed(
        () => collectable.value.purchase_type === PURCHASE_TYPE.AUCTION
    );
    const isUpcomming = computed(() => collectableState.value === COLLECTABLE_STATE.WAITING);
    const isOpenEdition = computed(() => collectable.value.is_open_edition);
    const tangibility = computed(() => collectable.value.type === 'tangible_nft' ? 'nft-physical' : 'nft-digital');
    const tags = computed(() => collectable.value.tags.map(tag => tag.name));
    const listingType = computed(() => marketHandlerToListingType[collectable.value.market_handler_type]);
    const priceType = computed(() => {
        let listingTypeCheck = marketHandlerToListingType[collectable.value.market_handler_type];
        if(listingTypeCheck === 'auction') {
            if(events.value.length === 0) {
                return 'Reserve Price';
            } else if ((collectableState.value === COLLECTABLE_STATE.DONE) || (collectableState.value === COLLECTABLE_STATE.CLOSED)) {
                return 'Winning Bid';
            } else {
                return 'Current Bid';
            }
        } else {
            return 'Sale Price';
        }
    });
    const creatorAccount = computed(() => {
        console.log({
            'collectable.value.user': collectable.value.user,
            'collectable.value?.artist': collectable.value?.artist
        })
        if(collectable.value.user?.wallet) {
            return collectable.value.user.wallet;
        } else if (collectable.value?.artist?.wallet) {
            return collectable.value.artist.wallet
        } else {
            return false;
        }
    })
    const creatorProfilePicture = computed(() => {
        if(collectable.value.user?.image) {
            return collectable.value.user.image;
        } else if (collectable.value.artist?.avatar) {
            return collectable.value.artist.avatar
        } else {
            return false;
        }
    })
    const creatorUsername = computed(() => {
        if(collectable.value.user?.username) {
            return collectable.value.user.username;
        } else if (collectable.value.artist?.name) {
            return collectable.value.artist.name
        } else {
            return false;
        }
    })
    const secondaryMarketListings = computed(() => {
        return collectable.value?.secondary_market_listings || false;
    })
    
    const isVRFSale = computed(() => collectable.value.is_vrf_drop);

    const updateProgress = function (event) {
        progress.value = event;
        updateCollectableState();
    };

    const updateInformation = function (data) {
        collectable.value.ends_at = data.ends_at;
        events.value = data.events.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const latestEvent = events.value[events.value.length - 1];

        if (data.media && data.media.length) {
            const sorted = [...data.media].sort((a, b) => a.position < b.position ? -1 : 1).filter(m => !m.is_preview);
            collectable.value.mediaSorted = sorted;
        } else {
            collectable.value.mediaSorted = [];
        }

        // AUCTION
        if (isAuction.value) {
            if (events.value.length === 0) {
                price.value = +(data.start_bid || 0);
                nextBidPrice.value = data.start_bid === price.value ? price.value : (price.value * 1.10); // TODO, make DB prop
                priceUSD.value = +(data.value_in_usd || converEthToUSD(price.value)).toFixed(2);
            } else {
                price.value = +(latestEvent.value || 0);
                nextBidPrice.value = +((latestEvent.value || 0) * 1.10); // TODO, make DB prop
                priceUSD.value = +(latestEvent.value_in_usd || converEthToUSD(price.value)).toFixed(2);
            }
            // Remove rounding errors in nextBidPrice // 1.000000000001
            nextBidPrice.value = +nextBidPrice.value.toFixed(7);
        }

        // SALE
        if (!isAuction.value) {
            if(!isOpenEdition.value) {
                itemsOf.value = data.available_qty || 0;
                items.value = supply.value
                    ? supply.value
                    : itemsOf.value - (events.value || [])
                        .reduce((carry, evt) => {
                            if (evt.amount) {
                                return parseInt(evt.amount) + carry;
                            }
                            if (evt.raw && typeof evt.raw == "string") {
                                let decodedEvt = JSON.parse(evt.raw);
                                return parseInt(decodedEvt.amount) + carry;
                            }
                            return carry;
                        }, 0);
            }
            price.value = +(data.price || 0).toFixed(3);
            priceUSD.value = +(data.value_in_usd || 0).toFixed(2);
            priceUSDSold.value = (events.value || [])
                .reduce((carry, evt) => {
                    if (evt.value_in_usd) {
                        return carry + evt.value_in_usd;
                    }
                    if (evt.value) {
                        return evt.value + carry;
                    }
                    if (evt.amount) {
                        return carry + (evt.amount * converEthToUSD(price.value));
                    }
                    if (evt.raw && typeof evt.raw == "string") {
                        let decodedEvt = JSON.parse(evt.raw);
                        return (carry + (decodedEvt.amount) * converEthToUSD(price.value));
                    }
                    return carry;
                }, 0).toFixed(2);

            if(!isOpenEdition.value) {
                progress.value = items.value === 0 || !items.value
                    ? 0
                    : items.value / itemsOf.value;
            }
        }
    };

    const updateCollectableState = function () {
        const now = Date.now();
        const start = startsAt.value ? new Date(startsAt.value) : null;
        const end = endsAt.value ? new Date(endsAt.value) : null;
        console.log({endUpdate: end})
        const isStartInPast = start && start.getTime() <= now;

        console.log({end, 'collectable.value.is_reserve_price_auction': collectable.value.is_reserve_price_auction, isStartInPast})

        if(end === null && collectable.value.is_reserve_price_auction && isStartInPast) {
            collectableState.value = COLLECTABLE_STATE.AWAITING_RESERVE;
            return;
        }

        console.log({is_closed})

        if (is_closed.value) {
            collectableState.value = COLLECTABLE_STATE.CLOSED;
            return;
        }

        if (now < start) {
            collectableState.value = COLLECTABLE_STATE.WAITING;
            return;
        }

        if (end && (now > end) && (end.getTime() !== 0)) {
            collectableState.value = COLLECTABLE_STATE.DONE;
            return;
        }

        if (!isAuction.value) {
            if (items.value === 0 && !isOpenEdition.value) {
                collectableState.value = COLLECTABLE_STATE.OUT_OF_STOCK;
                return;
            }
        }

        if (now >= start && now < end) {
            collectableState.value = COLLECTABLE_STATE.IN_PROGRESS;
            return;
        }

        collectableState.value = COLLECTABLE_STATE.WAITING;
    };

    let timeoutHandler = null;
    const enableContract = function () {
        console.log("trying enable")
        if (collectable.value == null) return;

        const now = Date.now();
        const start = new Date(startsAt.value).getTime() - (15 * 60 * 1000);
        let endDate = new Date(endsAt.value);
        endDate.setHours(endDate.getHours() + 6);
        const end = endDate.getTime();
        if(collectable.value.contract_address) {
            if (
                ((now >= start) && (now < end) && !is_sold_out.value) ||
                (collectable.value.is_vrf_drop && !collectable.value.is_closed) ||
                (new Date(endsAt.value).getTime() === 0 && collectable.value.is_reserve_price_auction) ||
                (isAuction.value && !collectable.value.winner_address) ||
                ((collectable.value.version === 3) && (collectable.value.market_handler_type === MARKET_HANDLER_TYPES.SALE) && !collectable.value.is_closed)
            ) {
                console.log('contract initialized');
                initializeContractEvents(collectable.value);
            } else if ((now < end || !endsAt.value) && !is_sold_out.value) {
                timeoutHandler = setTimeout(() => {
                    console.log('starting soon');
                        initializeContractEvents(collectable.value);
                    }, start - now);
            }
        }
    };

    const setCollectable = function (data) {
        collectable.value = data;
        updateInformation(data);
        updateCollectableState();
        enableContract(data);
    };

    if (collectable.value.type != null) {
        setCollectable(collectable.value);
    }

    const updateFromBlockchain = function (newEvents) {
        // console.log('updateFromBlockchain', newEvents);
        events.value = newEvents;
        let endsAtNew = endsAt.value;
        let startsAtNew = startsAt.value;
        let minimumStartsAtNew = minimumStartsAt.value;
        // Update price and item count
        if (isAuction.value) {
            if (updatedEndsAt.value) {
                endsAtNew = new Date(updatedEndsAt.value).toString();
            }
            if(updatedStartsAt.value) {
                startsAtNew = new Date(updatedStartsAt.value).toString();
            }
            if(updatedMinimumStartsAt.value) {
                minimumStartsAtNew = new Date(updatedMinimumStartsAt.value).toString();
            }
        }

        updateInformation({
            ...collectable.value,
            events: [...events.value],
            ends_at: endsAtNew,
            starts_at: startsAtNew,
            minimum_starts_at: minimumStartsAtNew,
        });
        updateCollectableState();
    };

    // Blockchain watchers
    watch(mergedEvents, updateFromBlockchain);

    onBeforeUnmount(() => {
        if (timeoutHandler != null) {
            clearTimeout(timeoutHandler);
            timeoutHandler = null;
        }
    });

    return {
        collectableState,
        collectable,
        price,
        priceUSD,
        priceUSDSold,
        nextBidPrice,
        items,
        itemsOf,
        itemsBought,
        progress,
        isCollectableActive,
        hasRequestedVRF,
        hasFulfilledVRF,
        hasCommittedVRF,
        // Static
        type,
        media,
        firstMedia,
        firstMediaType,
        gallerySortedMedia,
        artist,
        artistStatement,
        title,
        description,
        events,
        bundleChildItems,
        startsAt,
        endsAt,
        minimumStartsAt,
        liveStatus,
        is_sold_out,
        is_closed,
        edition,
        edition_of,
        isTangible,
        isNft,
        isAuction,
        isUpcomming,
        version,
        claim,
        pillOverride,
        requiresRegistration,
        isOpenEdition,
        tangibility,
        priceType,
        tags,
        creatorAccount,
        creatorProfilePicture,
        creatorUsername,
        listingType,
        isReadyForClosure,
        isClosed,
        isCancelled,
        winningAddress,
        secondaryMarketListings,
        isVRFSale,
        // Methods
        updateProgress,
        setCollectable,
        updateInformation,
        updateCollectableState,
    };
}

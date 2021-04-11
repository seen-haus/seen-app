import { ref, computed, watch } from 'vue';
import useContractEvents from "@/hooks/useContractEvents";
import {BigNumber} from "@ethersproject/bignumber";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {formatEther, parseEther} from "@ethersproject/units";

import {
    COLLECTABLE_TYPE,
    COLLECTABLE_STATE,
} from "@/constants/Collectables.js";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";

export default function useCollectableInformation(initialCollectable = {}) {
    const { converEthToUSD } = useExchangeRate();
    const {
        mergedEvents,
        lastBid,
        initializeContractEvents,
    } = useContractEvents();

    const collectable = ref(initialCollectable);
    const isContractEnabled = ref(false);

    const events = ref(collectable.value.events || []);
    const price = ref(0.0);
    const priceUSD = ref(0.0);
    const progress = ref(0.0);
    const items = ref(0);
    const itemsOf = ref(0);
    const collectableState = ref(COLLECTABLE_STATE.WAITING);

    const type = computed(() => collectable.value.type);
    const media = computed(() => collectable.value.media);
    const firstMedia = computed(() => { // Use preview image or first
        if (!media.value) return '';
        const found = media.value.find(v => v.isPreview);

        if (found) {
            return found.url;
        }
        
        return media.value[0].url || '';
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
    const isCollectableActive = computed(() => {
        return (
            collectableState.value === COLLECTABLE_STATE.WAITING ||
            collectableState.value === COLLECTABLE_STATE.IN_PROGRESS
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
        if (collectableState.value === COLLECTABLE_STATE.DONE) return "ended";
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
    const endsAt = computed(() => collectable.value.ends_at);

    const isAuction = computed(
        () => collectable.value.purchase_type === PURCHASE_TYPE.AUCTION
    );

    const isUpcomming = computed(() => collectableState.value === COLLECTABLE_STATE.WAITING);
    const updateProgress = function (event) {
        progress.value = event;
    };

    const updateInformation = function (data) {
        // events.value = data.events.sort((a, b) => b.updatedAt - a.updatedAt);
        if (data.media && data.media.length) {
            const sorted = [...data.media].sort((a, b) => a.position < b.position ? -1 : 1).filter(m => !m.isPreview);
            const lastItem = sorted[sorted.length - 1];
            const mediaSlice = sorted.slice(0, -1);
            mediaSlice.unshift(lastItem);
            collectable.value.mediaSorted = mediaSlice;
        } else {
            collectable.value.mediaSorted = [];
        }
        events.value = data.events.reverse();
        const lastestEvent = events.value[0];

        items.value = events.value.length; // Amount of items sold
        itemsOf.value = data.available_qty || 0;

        // AUCTION
        if (isAuction.value) {
            if (events.value.length === 0) {
                price.value = +(data.start_bid || 0).toFixed(2);
                priceUSD.value = +(data.value_in_usd || converEthToUSD(price.value)).toFixed(2);
            } else {
                price.value = +(lastestEvent.value || 0).toFixed(2);
                priceUSD.value = +(lastestEvent.value_in_usd || converEthToUSD(price.value)).toFixed(2);
            }
        } else {
            price.value = +(data.price || 0).toFixed(2);
            priceUSD.value = +(data.value_in_usd || 0).toFixed(2);
        }

        // SALE
        if (!isAuction.value) {
            progress.value = itemsOf.value / items.value;
        }
    };

    const updateCollectableState = function () {
        const now = Date.now();
        const start = new Date(startsAt.value);
        const end = new Date(endsAt.value);

        if (now < start) {
            collectableState.value = COLLECTABLE_STATE.WAITING;
            return;
        }

        if (now > end) {
            collectableState.value = COLLECTABLE_STATE.DONE;
            return;
        }

        if (!isAuction.value) {
            if (items.value >= itemsOf.value) {
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

    const enableContract = function () {
        if (collectable.value == null) return;
        if (isContractEnabled.value) return;

        const now = Date.now();
        const start = new Date(startsAt.value).getTime();
        const end = new Date(endsAt.value).getTime();
        
        // TODO: Remove this call
        initializeContractEvents(collectable.value);

        if (now >= start && now < end) {
            console.log('contract initialized');
            isContractEnabled.value = true;
            initializeContractEvents(collectable.value);
        }
    };

    const setCollectable = function (data) {
        collectable.value = data;
        updateInformation(data);
        updateCollectableState();
        enableContract(data);
    };

    // Update the information on load
    if (collectable.value.type != null) {
        setCollectable(collectable.value);
    }

    // Blockchain watchers
    watch(mergedEvents, (v) => {
        console.log('updating events from chain', v);
        events.value = v;
    });

    watch(lastBid, (v) => {
        console.log('updaing last bid', v);

        price.value = +formatEther(v);
        priceUSD.value = converEthToUSD(price.value);
    });

    return {
        collectableState,
        collectable,
        price,
        priceUSD,
        items,
        itemsOf,
        progress,
        isCollectableActive,
        // Static
        type,
        media,
        firstMedia,
        gallerySortedMedia,
        artist,
        artistStatement,
        title,
        description,
        events,
        startsAt,
        endsAt,
        liveStatus,
        is_sold_out,
        edition,
        edition_of,
        isTangible,
        isNft,
        isAuction,
        isUpcomming,
        version,
        // Methods
        updateProgress,
        setCollectable,
        updateInformation,
        updateCollectableState,
        lastBid,
    };
}

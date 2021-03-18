import { ref, computed } from 'vue';

import {
  COLLECTABLE_TYPE,
  COLLECTABLE_STATE,
} from "@/constants/Collectables.js";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";

export default function useCollectableInformation(initialCollectable = {}) {
  const collectable = ref(initialCollectable);

  const events = ref(collectable.value.events || []);
  const price = ref(0.0);
  const priceUSD = ref(0.0);
  const progress = ref(0.0);
  const items = ref(0);
  const itemsOf = ref(0);
  const collectableState = ref(COLLECTABLE_STATE.WAITING);

  const type = computed(() => collectable.value.type);
  const media = computed(() => collectable.value.media);
  const firstMedia = computed(() => (media.value && media.value[0].url) || '');
  const artist = computed(() => collectable.value.artist);
  const title = computed(() => collectable.value.title);
  const description = computed(() => collectable.value.description);

  const is_sold_out = computed(
    () => collectableState.value === COLLECTABLE_STATE.OUT_OF_STOCK
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
      return "comming soon";
    if (collectableState.value === COLLECTABLE_STATE.OUT_OF_STOCK)
      return "sold out";

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
    events.value = data.events.reverse();
    const lastestEvent = events.value[events.value.length - 1];

    items.value = 0;
    itemsOf.value = data.available_qty || 0;

    if (isAuction.value) {
      if (events.value.length === 0) {
        price.value = +(data.start_bid || 0).toFixed(2);
        priceUSD.value = +(data.value_in_usd || 0).toFixed(2);
      } else {
        price.value = +(lastestEvent.value || 0).toFixed(2);
        priceUSD.value = +(lastestEvent.value_in_usd || 0).toFixed(2);
      }
    } else {
      if (events.value.length === 0) {
        price.value = +(data.price || 0).toFixed(2);
        priceUSD.value = +(data.value_in_usd || 0).toFixed(2);
      } else {
        price.value = +(lastestEvent.value || 0).toFixed(2);
        priceUSD.value = +(lastestEvent.value_in_usd || 0).toFixed(2);
      }
    }

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

    if (items.value >= itemsOf.value) {
      collectableState.value = COLLECTABLE_STATE.OUT_OF_STOCK;
      return;
    }

    if (now >= start && now < end) {
      collectableState.value = COLLECTABLE_STATE.IN_PROGRESS;
      return;
    }

    collectableState.value = COLLECTABLE_STATE.WAITING;
  };

  const setCollectable = function (data) {
    collectable.value = data;
    updateInformation(data);
    updateCollectableState();
  };

  // Update the information on load
  if (collectable.value.type != null) {
    setCollectable(collectable.value);
  }

  return {
    collectableState,
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
    artist,
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
    // Methods
    updateProgress,
    setCollectable,
    updateInformation,
    updateCollectableState
  };
}
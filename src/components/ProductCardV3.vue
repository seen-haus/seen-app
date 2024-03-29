<template>
  <drop-card-preview
    class="clickable"
    :autoMargins="true"
    :listingType="listingType"
    :startTime="getStartsAt"
    :endTime="getEndsAt"
    :priceType="priceType"
    :price="price"
    :units="false"
    :tangibility="tangibility"
    :tags="tags"
    :titleText="title"
    :creatorAccount="creatorAccount"
    :creatorProfilePicture="creatorProfilePicture"
    :creatorUsername="creatorUsername"
    :creatorType="creatorType"
    :creatorSlug="creatorSlug"
    :mediaUrl="firstMedia"
    :updateProgress="updateProgress"
    :progress="progress"
    :items="items"
    :itemsOf="itemsOf"
    :collectableState="collectableState"
    :liveStatus="liveStatus"
    :isOpenEdition="isOpenEdition"
    :customPaymentTokenSymbol="customPaymentTokenSymbol"
  />
</template>

<script lang="ts">
import {ref, watchEffect, computed} from "vue";
import BigNumber from "bignumber.js";

import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import UserBadge from "./PillsAndTags/UserBadge.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import useDarkMode from '@/hooks/useDarkMode';
import useCollectableInformation from "@/hooks/useCollectableInformation.js";

export default {
  name: "ProductCard",
  components: {
    DropCardPreview,
    ProgressTimer,
    ProgressBar,
    UserBadge,
    Tag,
    LiveIndicator,
    PriceDisplay,
    MediaLoader,
  },
  props: {
    collectable: Object,
  },
  computed: {
    getStartsAt() {
      if(this.bundleChildItems && this.bundleChildItems && this.bundleChildItems.length > 0) {
        let startsAt = false;
        for(let bundleItem of this.bundleChildItems) {
          if(!startsAt) {
            startsAt = new Date(bundleItem.starts_at).getTime();
          }else if(bundleItem.starts_at < startsAt) {
            startsAt = new Date(bundleItem.starts_at).getTime();
          }
        }
        return startsAt
      }
      let unixTime = new Date(this.startsAt).getTime();
      return unixTime;
    },
    getEndsAt() {
      if(this.bundleChildItems && this.bundleChildItems && this.bundleChildItems.length > 0) {
        let endsAt = false;
        for(let bundleItem of this.bundleChildItems) {
          if(!endsAt) {
            endsAt = new Date(bundleItem.ends_at).getTime();
          }else if(bundleItem.ends_at > endsAt) {
            endsAt = new Date(bundleItem.ends_at).getTime();
          }
        }
        return endsAt;
      }
      let unixTime = new Date(this.endsAt).getTime();
      return unixTime;
    },
    shouldHidePrice() {
      let hasBundledItems = false;
      let hasBundledItemEvents = false;
      if(this.bundleChildItems && this.bundleChildItems && (this.bundleChildItems.length > 0)) {
        hasBundledItems = true;
        for(let bundleChildItem of this.bundleChildItems) {
          if(bundleChildItem.events && bundleChildItem.events.length > 0) {
            hasBundledItemEvents = true;
          }
        }
      }
      if(hasBundledItems && !hasBundledItemEvents) {
        return true;
      }
      return false;
    },
    isAwaitingReserve: function () {
      switch (this.liveStatus) {
        case "awaiting-reserve-bid":
          return true;
        default:
          return false;
      }
    },
  },
  setup(props) {
    const autoplay = true;
    // console.log('ProductCard', props.collectable);
    const mediaRef = ref(null);
    const timerRef = ref(null);

    const titleMonospace = ref(false);

    // TODO: Make this into a DB datasource unless V3 no longer uses this
    if(props.collectable && [115].indexOf(props.collectable.id) > -1) {
      titleMonospace.value = true;
    }

    const {
      collectableState,
      price,
      priceUSD,
      priceUSDSold,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      // Static
      type,
      // media,
      firstMedia,
      artist,
      title,
      startsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      isUpcomming,
      isOpenEdition,
      itemsBought,
      listingType,
      // Methods
      updateProgress,
      // setCollectable,
      // updateInformation,
      updateCollectableState,
      bundleChildItems,
      pillOverride,
      tangibility,
      priceType,
      tags,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      creatorType,
      creatorSlug,
      customPaymentTokenSymbol,
    } = useCollectableInformation(props.collectable);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const { darkMode } = useDarkMode();

    const collectableActiveTextColor = computed(() => darkMode.value ? 'dark-mode-text' : collectableActiveTextColor);

    const handleHover = function (toState) {
      if (autoplay) return; // On autoplay we dont handle hover
      if (isCollectableActive.value) return; // Handle hover only on non-active cards to save memory
      if (toState) {
        if (mediaRef.value != null) mediaRef.value.playVideo();
      } else {
        if (mediaRef.value != null) mediaRef.value.pauseVideo();
      }
    };

    let overridePriceUsd = 0;
    let overridePriceEth = 0;

    watchEffect(() => {
      let responseUsd = new BigNumber(0);
      let responseEth = new BigNumber(0);
      if(bundleChildItems && bundleChildItems.value && bundleChildItems.value.length > 0) {
        for(let bundleChildItem of bundleChildItems.value) {
          if(bundleChildItem.events && bundleChildItem.events.length > 0) {
            let latestEvent = bundleChildItem.events.sort((a, b) => b.value - a.value)[0];
            responseUsd = responseUsd.plus(new BigNumber(latestEvent.value_in_usd));
            responseEth = responseEth.plus(new BigNumber(latestEvent.value));
          }
        }
      }
      overridePriceUsd = responseUsd.toNumber();
      overridePriceEth = responseEth.toNumber();
    })

    return {
      autoplay,
      timerRef,
      mediaRef,
      collectableState,
      price,
      priceUSD,
      priceUSDSold,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isOpenEdition,
      itemsBought,
      // Static
      type,
      // media,
      firstMedia,
      artist,
      title,
      startsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      isUpcomming,
      tangibility,
      priceType,
      tags,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      creatorType,
      creatorSlug,
      titleMonospace,
      listingType,
      // Methods
      updateProgress,
      addTime,
      handleHover,
      updateCollectableState,
      bundleChildItems,
      overridePriceUsd,
      overridePriceEth,
      pillOverride,
      darkMode,
      collectableActiveTextColor,
      customPaymentTokenSymbol,
    };
  },
};
</script>

<style lang="scss" scoped>
.dark-mode-border {
  border: 1px solid #ffffff66;
}
</style>

<template>
  <div
      class="product-card flex flex-col overflow-hidden rounded-2xl rounded-t-3xl shadow-lg cursor-pointer"
      :class="darkMode ? 'dark-mode-border dark-mode-background' : 'light-mode-background'"
      @mouseenter="handleHover(true)"
      @mouseleave="handleHover(false)"
  >
    <div class="media relative">
      <!-- <img class="image absolute w-full h-full" :src="media" alt="" /> -->
      <media-loader
          ref="mediaRef"
          :src="firstMedia"
          aspectRatio="100%"
          muted
          loop
          :autoplay="autoplay"
          class="overflow-hidden flex-1"
      />

      <div class="tags flex absolute top-6 left-6 right-6">
        <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
        <tag v-if="isTangible" class="bg-black text-white">PHYSICAL</tag>

        <live-indicator :status="liveStatus" class="text-white ml-auto dark"/>
      </div>
    </div>
    <div class="description relative p-6 pb-3 flex flex-col flex-grow">
      <user-badge
          type="light"
          v-if="artist"
          :url="artist.avatar"
          :username="pillOverride ? pillOverride : artist.name"
          :artistSlug="artist.slug"
          class="absolute -top-4"
      />

      <div class="title-and-price flex items-start">
        <span
            class="text-xl md:text-2xl font-title font-bold flex-1"
            :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
            :style="{
              ...(titleMonospace && {'font-family': 'monospace'})
            }"
        >{{ title }}</span
        >
        <price-display
            v-if="!shouldHidePrice"
            size="sm"
            class="items-end ml-2 -mt-0.5 md:mt-0.5"
            :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
            type="Ether"
            :price="overridePriceEth || price"
            :priceUSD="
              isAuction 
                ? overridePriceUsd 
                  ? overridePriceUsd
                  : priceUSD
                : overridePriceUsd
                  ? overridePriceUsd
                  : priceUSDSold
            "
        />
      </div>
      <div class="flex-1"></div>

      <progress-bar
          :inversed="isAuction || isOpenEdition"
          :progress="progress"
          :endDate="endsAt"
          :colorClass="
            isCollectableActive && !isAwaitingReserve
              ? isUpcomming
                ? 'bg-gray-300'
                : 'bg-primary'
              : 'bg-gray-300'
          "
          progressBackgroundColor="bg-fence-light"
          class="h-2 mt-10"
      />

      <template v-if="isAuction">
        <progress-timer
            ref="timerRef"
            class="text-black text-sm mt-2"
            :isAwaitingReserve="isAwaitingReserve"
            :isAuction="isAuction"
            :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
            :startDate="getStartsAt"
            :endDate="getEndsAt"
            @onProgress="updateProgress"
            @onTimerStateChange="updateCollectableState"
        />
      </template>

      <template v-else>
        <template v-if="isUpcomming">
          <progress-timer
              ref="timerRef"
              class="text-black text-sm mt-2"
              :isAuction="isAuction"
              :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
              :startDate="getStartsAt"
              :endDate="getEndsAt"
              @onProgress="updateProgress"
              @onTimerStateChange="updateCollectableState"
          />
        </template>
        <template v-else-if="isOpenEdition">
          <progress-timer
              ref="timerRef"
              class="text-black text-sm mt-2"
              :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
              :startDate="getStartsAt"
              :endDate="getEndsAt"
              @onProgress="updateProgress"
              @onTimerStateChange="updateCollectableState"
          />
          <div
              class="text-sm font-bold mt-2"
              :class="'text-gray-400'"
          >
            {{
              isCollectableActive
                  ? `${itemsBought} Editions Purchased`
                  : is_closed ? "Closed" : "Sold Out"
            }}
          </div>
        </template>
        <template v-else>
          <div
              class="text-sm font-bold mt-2"
              :class="isCollectableActive ? collectableActiveTextColor : 'text-gray-400'"
          >
            {{
              isCollectableActive
                  ? `${items} out of ${itemsOf}`
                  : is_closed ? "Closed" : "Sold Out"
            }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watchEffect, computed} from "vue";
import BigNumber from "bignumber.js";

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
            startsAt = bundleItem.starts_at;
          }else if(bundleItem.starts_at < startsAt) {
            startsAt = bundleItem.starts_at;
          }
        }
        return startsAt;
      }
      return this.startsAt;
    },
    getEndsAt() {
      if(this.bundleChildItems && this.bundleChildItems && this.bundleChildItems.length > 0) {
        let endsAt = false;
        for(let bundleItem of this.bundleChildItems) {
          if(!endsAt) {
            endsAt = bundleItem.ends_at;
          }else if(bundleItem.ends_at > endsAt) {
            endsAt = bundleItem.ends_at;
          }
        }
        return endsAt;
      }
      return this.endsAt;
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
      // Methods
      updateProgress,
      // setCollectable,
      // updateInformation,
      updateCollectableState,
      bundleChildItems,
      pillOverride,
    } = useCollectableInformation(props.collectable);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const { darkMode } = useDarkMode();

    const collectableActiveTextColor = computed(() => darkMode.value ? 'dark-mode-text' : 'text-black');

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
      titleMonospace,
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
    };
  },
};
</script>

<style lang="scss" scoped>
.dark-mode-border {
  border: 1px solid #ffffff66;
}
</style>

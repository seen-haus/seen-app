<template>
  <div
      class="product-card flex flex-col overflow-hidden rounded-2xl shadow-lg cursor-pointer"
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
          class="overflow-hidden rounded-t-3xl flex-1"
      />

      <div class="tags flex absolute top-6 left-6 right-6">
        <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
        <tag v-if="isTangible" class="bg-black text-white">TANGIBLE</tag>

        <live-indicator :status="liveStatus" class="text-white ml-auto dark"/>
      </div>
    </div>
    <div class="description relative p-6 pb-3 flex flex-col flex-grow">
      <user-badge
          type="light"
          :url="artist.avatar"
          :username="artist.name"
          :artistSlug="artist.slug"
          class="absolute -top-4"
      />

      <div class="title-and-price flex items-start">
        <span
            class="text-xl md:text-2xl font-title font-bold flex-1"
            :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
        >{{ title }}</span
        >
        <price-display
            v-if="!shouldHidePrice"
            size="sm"
            class="items-end ml-2 -mt-0.5 md:mt-0.5"
            :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
            type="Ether"
            :price="price"
            :priceUSD="isAuction ? priceUSD : priceUSDSold"
        />
      </div>
      <div class="flex-1"></div>

      <progress-bar
          :inversed="isAuction"
          :progress="progress"
          :colorClass="
          isCollectableActive
            ? isUpcomming
              ? 'bg-gray-300'
              : 'bg-primary'
            : 'bg-gray-300'
        "
          class="bg-fence-light h-2 mt-10"
      />

      <template v-if="isAuction">
        <progress-timer
            ref="timerRef"
            class="text-black text-sm mt-2"
            :isAuction="isAuction"
            :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
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
              :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
              :startDate="getStartsAt"
              :endDate="getEndsAt"
              @onProgress="updateProgress"
              @onTimerStateChange="updateCollectableState"
          />
        </template>
        <template v-else>
          <div
              class="text-sm font-bold mt-2"
              :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
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
import {ref} from "vue";

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import UserBadge from "./PillsAndTags/UserBadge.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

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
      if(this.bundleChildItems && this.bundleChildItems && this.bundleChildItems.length > 0) {
        return true;
      }
      return false;
    }
  },
  setup(props) {
    const autoplay = true;
    // console.log('ProductCard', props.collectable);
    const mediaRef = ref(null);
    const timerRef = ref(null);

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
      // Methods
      updateProgress,
      // setCollectable,
      // updateInformation,
      updateCollectableState,
      bundleChildItems,
    } = useCollectableInformation(props.collectable);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const handleHover = function (toState) {
      if (autoplay) return; // On autoplay we dont handle hover
      if (isCollectableActive.value) return; // Handle hover only on non-active cards to save memory
      if (toState) {
        if (mediaRef.value != null) mediaRef.value.playVideo();
      } else {
        if (mediaRef.value != null) mediaRef.value.pauseVideo();
      }
    };

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
      // Methods
      updateProgress,
      addTime,
      handleHover,
      updateCollectableState,
      bundleChildItems,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>

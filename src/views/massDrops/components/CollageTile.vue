<template>
  <div
    class="collage-tile rounded-lg overflow-hidden relative"
    :class="{ 
      upcoming: styleNextPhase || styleIsReserved ? false : isUpcomming,
      ended: isEnded || styleIsReserved,
      live: !styleIsReserved ? isLive : false,
      nextphase: styleNextPhase && !styleIsReserved,
    }"
    :style="{'padding-bottom': aspectRatio,}"
  >

<!--    <media-loader-->
<!--          src="http://placekitten.com/280/140"-->
<!--          class="absolute top-0 left-0 w-full h-full"-->
<!--      />-->

    <img
        ref="imageRef"
        class="image absolute w-full h-full"
        :src=firstMedia
        alt=""
      />

<!--      <media-loader-->
<!--            ref="imageRef"-->
<!--            :src=firstMedia-->
<!--            class="image absolute w-full h-full"-->
<!--          />-->

    <div class="content flex flex-col absolute top-0 left-0 w-full h-full p-4">
      <div class="flex justify-between items-start flex-1">
        <price-display v-if="!styleIsReserved" :price=price :priceUSD=priceUSD size="xs" class="text-white self-start" type="ETH" />
        <live-indicator v-if="!styleIsReserved" :status="styleNextPhase ? 'next phase' : liveStatus" class="pt-1 text-white"></live-indicator>
        <live-indicator v-if="styleIsReserved" :status="'reserved'" :status-override="reservedTitleOverride" class="pt-1 text-white"></live-indicator>
      </div>

      <progress-bar
          v-if="!styleIsReserved"
          :inversed="isAuction"
          :progress="currentProgress"
          :endDate="endsAt"
          progressBackgroundColor="bg-gray-300"
          :colorClass="isCollectableActive ? isUpcomming ? 'bg-gray-300': 'bg-primary' : 'bg-gray-300'"
          class="bg-gray-600 h-1 w-full"
      />

      <progress-timer
            v-if="!styleIsReserved"
            ref="timerRef"
            class="text-xs text-white mt-2 w-auto"
            :isAuction="isAuction"
            :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
            :startDate="startsAt"
            :endDate="endsAt"
            @onProgress="updateProgress"
            @onTimerStateChange="updateCollectableState"
        />
    </div>
  </div>
</template>


<script>
import {ref} from "vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";


export default {
  name: "CollageTile",
  components: {
    MediaLoader,
    ProgressBar,
    ProgressTimer,
    LiveIndicator,
    PriceDisplay,
  },
  props: {
    collectable: Object,
    aspectRatio: {
      type: String,
      default: "56.25%",
    },
    isNextPhase: Boolean,
    isReserved: {
      type: Boolean,
      default: false,
    },
    reservedTitleOverride: [String, Boolean],
  },
  computed: {
    isLive() {
      let now = new Date().getTime();
      return Date.parse(this.startsAt) < now && now < Date.parse(this.endsAt);
    },
    isEnded() {
      return new Date().getTime() > Date.parse(this.endsAt);
    },
  },

  setup(props) {
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
      isUpcomming
    } = useCollectableInformation(props.collectable);
    console.log(title);

    const currentProgress = ref(progress);

    const updateProgress = function (event) {
      currentProgress.value = event;
    };

        return {
      collectableState,
      price,
      priceUSD,
      priceUSDSold,
      items,
      itemsOf,
      currentProgress,
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
      styleNextPhase: props.isNextPhase ? props.isNextPhase : false,
      styleIsReserved: props.isReserved ? props.isReserved : false,
      updateProgress,
    };
  }

};
</script>


<style lang="scss">
.collage-tile {
  cursor: pointer;
  margin: 2px;

  .content {
    border: 3px solid transparent;
    border-radius: 0.5rem;
  }

  &.upcoming,
  &.nextphase {
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  &.upcoming > img,
  &.nextphase > img {
    filter: grayscale(100%);
  }

  &.ended {

    .content {
      border-color: #CA347C;
    }

    .indicator-icon {
      background-color: #CA347C;
    }

    .progress-bar {
      opacity: 0;
    }
  }

  &.nextphase {
    .content {
      border-color: #0071D9;
    }

    .content {
      // visibility: visible;
      background: rgba(#000, 0.75);
    }
  }
  

  &.live {

    .content {
      border-color: #34CA98;
    }

    .content {
      visibility: visible;
      background: rgba(#000, 0.75);
    }
  }
}

.content {
  visibility: hidden;
}

@screen lg {
  .collage-tile.nextphase:hover .content,
  .collage-tile.upcoming:hover .content,
  .collage-tile.ended:hover .content {
    visibility: visible;
    background: rgba(#000, 0.75);
  }
}
</style>
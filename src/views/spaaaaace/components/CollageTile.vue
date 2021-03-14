<template>
  <div
    class="collage-tile rounded-lg overflow-hidden relative"
    :class="{ available: available }"
    :style="{
      'padding-bottom': aspectRatio,
    }"
  >
    <img :src="url" alt="" class="absolute top-0 left-0 w-full h-full" />

    <div class="content flex flex-col absolute top-0 left-0 w-full h-full p-4">
      <div class="flex justify-between items-start flex-1">
        <price-display size="xs" class="text-white self-start" type="ETH" />
        <live-indicator status="live" class="pt-1 text-white"
          >LIVE</live-indicator
        >
      </div>

      <progress-bar
        :progress="0.34"
        colorClass="bg-primary"
        class="bg-gray-600 h-1 w-full"
      />
      <progress-timer class="text-xs text-white mt-2 w-auto" />
    </div>
  </div>
</template>


<script>
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";

export default {
  name: "CollageTile",
  components: {
    ProgressBar,
    ProgressTimer,
    LiveIndicator,
    PriceDisplay,
  },
  props: {
    url: {
      type: String,
      default: "http://placekitten.com/280/140",
    },
    available: {
      type: Boolean,
      default: false,
    },
    aspectRatio: {
      type: String,
      default: "50%",
    },
  },
};
</script>


<style lang="scss">
.collage-tile {
  filter: grayscale(100%);
  opacity: 0.25;

  &.available {
    filter: none;
    opacity: 1.0;

    &:hover {
      cursor: pointer;
    }
  }
}

.content {
  visibility: hidden;
}

@screen lg {
  .collage-tile.available {
    &:hover {
      cursor: pointer;

      .content {
        visibility: visible;
        background: rgba(0, 0, 0, 0.75);
      }
    }
  }
}
</style>
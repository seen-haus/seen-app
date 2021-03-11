<template>
  <div class="product-card overflow-hidden rounded-2xl shadow-lg">
    <div class="media relative">
      <img class="image" src="http://placekitten.com/1000/1000" alt="" />

      <div class="tags flex absolute top-6 left-6">
        <tag type="nft" />
        <tag type="tangible" />
      </div>

      <live-indicator status="live" class="absolute top-6 right-6" />
    </div>
    <div class="description relative p-6">
      <user-badge type="light" class="absolute -top-4" />

      <div class="title-and-price flex items-start">
        <span class="text-2.5xl font-title font-bold flex-1">Pretty Cato</span>
        <div class="price flex flex-col pt-3 items-end">
          <div class="crypto text-sm">
            <span class="font-bold mr-1.5 text-2.5xl">2.06</span>ETH
          </div>
          <div class="fiat text-gray-400 text-sm">$2,442.55</div>
        </div>
      </div>

      <progress-bar :progress="0.34" class="bg-fence-light h-2 mt-10" />

      <progress-timer class="text-black text-sm mt-2" />
    </div>
  </div>
</template>

<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import UserBadge from "./PillsAndTags/UserBadge.vue";

export default {
  components: { ProgressTimer, ProgressBar, UserBadge, Tag, LiveIndicator },
  name: "ProductCard",
};
</script>

<style lang="scss" scoped>
</style>

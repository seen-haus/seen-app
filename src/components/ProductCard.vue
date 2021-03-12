<template>
  <div class="product-card overflow-hidden rounded-2xl shadow-lg">
    <div class="media relative">
      <img class="image" src="http://placekitten.com/1000/1000" alt="" />

      <div class="tags flex absolute top-6 left-6">
        <tag class="bg-tag-nft mr-1 text-white">NFT</tag>
        <tag class="bg-tag-tangible text-white">TANGIBLE</tag>
      </div>

      <live-indicator status="live" class="absolute top-6 right-6 text-white">LIVE</live-indicator>
    </div>
    <div class="description relative p-6">
      <user-badge type="light" class="absolute -top-4" />

      <div class="title-and-price flex items-start">
        <span class="text-2.5xl font-title font-bold flex-1">Pretty Cato</span>
        <price-display size="sm" class="text-black items-end" type="Ether"/>
      </div>

      <progress-bar :progress="0.34" class="bg-fence-light h-2 mt-10" />

      <progress-timer class="text-black text-sm mt-2" />
    </div>
  </div>
</template>

<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import UserBadge from "./PillsAndTags/UserBadge.vue";

export default {
  components: { ProgressTimer, ProgressBar, UserBadge, Tag, LiveIndicator, PriceDisplay },
  name: "ProductCard",
};
</script>

<style lang="scss" scoped>
</style>

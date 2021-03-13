<template>
  <div class="bid-card shadow-lifted rounded-xl flex flex-col overflow-hidden">
    <div class="top-part flex flex-col p-8">
      <div
        class="flex justify-start items-center text-gray-400 text-xs font-bold"
      >
        <span class="tracking-widest mr-4">ITEMS LEFT </span>
        <tag class="bg-fence-light self-end text-gray-400 font-semibold"
          >3/40</tag
        >
      </div>

      <price-display size="lg" class="text-black self-start mt-5" type="ETH" />

      <div class="outlined-input mt-5">
        <input type="text" placeholder="Enter your bid" />
        <div class="icon w-5 mr-1"></div>
        <div class="type font-bold">ETH</div>
      </div>

      <div class="text-center text-gray-400 text-sm py-2">
        Approx. $2,560.55
      </div>

      <button class="button primary">Buy Now</button>
    </div>

    <div class="bottom-part bg-background-gray border-t p-8">
      <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
        ITEMS LEFT
      </div>
      <div class="text-2.5xl font-bold py-2">3 out of 40</div>
      <progress-bar :progress="0.34" class="bg-gray-300 h-3" />
    </div>
  </div>
</template>


<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";

export default {
  name: "BidCard",
  components: { Tag, PriceDisplay, ProgressBar },
};
</script>


<style lang="scss" scoped>
.outlined-input {
  @apply flex items-center border rounded-md border-black px-5;
  height: 60px;
  border-width: 2px;

  input {
    @apply outline-none flex-grow;
    height: 56px;
    min-width: 0;
  }
}
</style>
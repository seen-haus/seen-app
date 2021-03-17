<template>
  <div
    class="leaderboard-tile flex flex-col lg:flex-row text-center lg:text-right py-8 lg:py-0 w-full items-center text-lg break-all"
    :class="{
      'font-bold': isInFirstThree,
      'text-gray-600': !isInFirstThree,
      'rounded-lg bg-gray-200 border border-gray-300':
        selected && !isInFirstThree,
      'bg-gray-200 border-gray-300': selected && isInFirstThree,
    }"
  >
    <div class="flex-1 text-left flex items-center relative">
      <icon
        :size="isInFirstThree ? 56 : 40"
        :wallet-address="user.wallet_address"
        class="rounded-full mr-6"
        :class="isInFirstThree ? 'my-6' : 'my-4'"
      />

      <span>{{ name }}</span>

      <template v-if="place === 0">
        <i
          class="fas fa-trophy text-place-gold absolute left-10 top-12 text-3xl"
        ></i>
        <div
          class="place-tag bg-place-gold text-white text-xs font-semibold p-1 rounded text-shadow ml-3"
        >
          1ST PLACE
        </div>
      </template>

      <template v-if="place === 1">
        <i
          class="fas fa-trophy text-place-silver absolute left-10 top-12 text-3xl"
        ></i>
        <div
          class="place-tag bg-place-silver text-white text-xs font-semibold p-1 rounded text-shadow ml-3"
        >
          2ND PLACE
        </div>
      </template>

      <template v-if="place === 2">
        <i
          class="fas fa-trophy text-place-bronze absolute left-10 top-12 text-3xl"
        ></i>
        <div
          class="place-tag bg-place-bronze text-white text-xs font-semibold p-1 rounded text-shadow ml-3"
        >
          3RD PLACE
        </div>
      </template>
    </div>
    <div class="flex-shrink-0 w-20">{{ user.won || 0 }}</div>

    <div class="flex-shrink-0 w-40 flex flex-col my-4 lg:my-0">
      <div>{{ user.bids_count || 0 }}</div>
      <div class="text-sm text-gray-400 font-normal"> ~{{ (user.total_amount || 0).toFixed(2) }} ETH</div>
    </div>

    <div class="flex-shrink-0 w-40">{{ user.amount_spent || 0 }} ETH</div>
  </div>
</template>


<script>
import Icon from "@/components/Common/Icon.vue";
import { shortenAddress } from "@/services/utils/index";


export default {
  name: "LeaderboardTile",
  props: {
    place: {
      type: Number, // 0, 1, 2
      default: 4, // Others
    },
    selected: {
      type: Boolean,
      default: false,
    },
    user: {},
  },
  components: { Icon },
  setup() {
    return {
      shortenAddress,
    };
  },
  computed: {
    name: function() {
      return this.user.username || (this.user.wallet_address && shortenAddress(this.user.wallet_address)) || "Unknown";
    },
    isInFirstThree: function () {
      return this.place < 3;
    },
    imageSizeClass: function () {
      if (this.isInFirstThree) return "w-14 h-14 my-6";
      return "w-12 h-12 my-3";
    },
    colorAndText: function () {
      if (this.place === 0) return ["#ffae00", "1ST PLACE"];
      if (this.place === 1) return ["#ffae00", "2ND PLACE"];
      if (this.place === 2) return ["#ffae00", "3RD PLACE"];
      return null;
    },
  },
};
</script>
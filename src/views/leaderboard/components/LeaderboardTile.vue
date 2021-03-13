<template>
  <div
    class="leaderboard-tile flex flex-col lg:flex-row text-center 
    lg:text-right py-8 lg:py-0 w-full items-center text-lg break-all
    "
    :class="{ 
      'font-bold': isInFirstThree, 
      'text-gray-600': !isInFirstThree,
      'rounded-lg bg-gray-200 border border-gray-300': selected && !isInFirstThree, 
      'bg-gray-200 border-gray-300': selected && isInFirstThree, 
    }"
  >
    <div class="flex-1 text-left flex items-center relative">
      <img src=http://placekitten.com/56/56 alt="" class="rounded-full mr-6"
      :class="imageSizeClass">
      <span>Gibbet</span>

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
    <div class="flex-shrink-0 w-20">12</div>

    <div class="flex-shrink-0 w-40 flex flex-col my-4 lg:my-0">
      <div>13523</div>
      <div class="text-sm text-gray-400 font-normal">424352.88 ETH</div>
    </div>

    <div class="flex-shrink-0 w-40">1342.99 ETH</div>
  </div>
</template>


<script>
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
  },
  computed: {
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
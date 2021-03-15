<template>
  <div class="bid-card shadow-lifted rounded-xl flex flex-col overflow-hidden">
    <div class="top-part flex flex-col p-8">
      <div
        v-if="hasEnded"
        class="flex justify-start items-center text-gray-400 text-xs font-bold"
      >
        ITEM HAS BEEN SOLD
      </div>
      <div
        v-else-if="!isAuction"
        class="flex justify-start items-center text-gray-400 text-xs font-bold"
      >
        <span class="tracking-widest mr-4">ITEMS LEFT </span>
        <tag class="bg-fence-light self-end text-gray-400 font-semibold"
          >{{ edition }}/{{ edition_of }}</tag
        >
      </div>

      <price-display
        size="lg"
        class="text-black self-start mt-5"
        type="ETH"
        :number-of-bids="numberOfBids"
      />

      <template v-if="!hasEnded">
        <div class="outlined-input mt-5">
          <input type="text" placeholder="Enter your bid" />
          <div class="icon w-5 mr-1"></div>
          <div class="type font-bold">ETH</div>
        </div>

        <div class="text-center text-gray-400 text-sm py-2">
          Approx. $2,560.55
        </div>
      </template>

      <button class="button opensea mt-6" v-if="hasEnded">Opensea</button>
      <button class="button primary" v-else>
        {{ isAuction ? "Place a bid" : "Buy now" }}
      </button>
    </div>

    <div class="bottom-part bg-background-gray border-t p-8">
      <template v-if="hasEnded">
         <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          AUCTION ENDED
        </div>
      </template>
      <template v-else-if="isAuction">
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          AUCTION ENDS IN
        </div>
        <progress-timer
          ref="timerRef"
          class="text-black text-3xl mt-2"
          :label="null"
          :startDate="startsAt"
          :endDate="endsAt"
          @onProgress="updateProgress"
        />
        <progress-bar :progress="progress" class="bg-gray-300 h-3 mt-3" />
      </template>

      <template v-else>
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          ITEMS LEFT
        </div>
        <div class="text-2.5xl font-bold py-2">
          {{ items }} out of {{ items_of }}
        </div>
        <progress-bar :progress="progress" class="bg-gray-300 h-3 mt-3" />
      </template>
    </div>
  </div>
</template>


<script>
import { computed, reactive, ref } from "vue";

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";

export default {
  name: "BidCard",
  components: { Tag, PriceDisplay, ProgressBar, ProgressTimer },
  props: {
    contractAddress: {
      type: String,
      default: null,
    },
  },
  setup() {
    const state = reactive({
      progress: 0.35,
    });
    const timerRef = ref(null);

    const startsAt = computed(() => "2021-03-13T21:00:00.000Z");
    const endsAt = computed(() => "2021-03-19T21:00:00.000Z");

    const isAuction = computed(() => true);
    const numberOfBids = computed(() => 5);

    const edition = computed(() => 1);
    const edition_of = computed(() => 1);
    const items = computed(() => 3);
    const items_of = computed(() => 40);

    const price = computed(() => 22.05);

    const progress = computed(() => state.progress);
    const hasEnded = computed(() => false);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const updateProgress = function (event) {
      state.progress = event;
    };

    return {
      startsAt,
      endsAt,
      isAuction,
      numberOfBids,
      edition,
      edition_of,
      items,
      items_of,
      price,
      progress,
      hasEnded,
      addTime,
      updateProgress,
    };
  },
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
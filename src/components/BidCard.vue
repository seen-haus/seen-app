<template>
  <div class="bid-card shadow-lifted rounded-xl flex flex-col overflow-hidden">
    <div class="top-part flex flex-col p-8">
      <div
        v-if="!isCollectableActive"
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
          >{{ items }}/{{ items_of }}</tag
        >
      </div>

      <price-display
        size="lg"
        class="text-black self-start mt-5"
        type="ETH"
        :price="price"
        :priceUSD="priceUSD"
        :number-of-bids="isAuction ? numberOfBids : undefined"
      />

      <template v-if="isCollectableActive">
        <div class="outlined-input mt-5">
          <input type="text" placeholder="Enter your bid" />
          <div class="icon w-5 mr-1">
            <img
              src="@/assets/icons/icon--ethereum.svg"
              class="cursor-pointer mr-2 opacity-50"
              alt="SEEN"
            />
          </div>
          <div class="type font-bold">ETH</div>
        </div>

        <div class="text-center text-gray-400 text-sm py-2">
          <p v-if="!ethereum"><i class="fas fa-spinner fa-spin"></i></p>
          <p v-else>Approx. {{convertEthToUSDAndFormat(price)}}</p>
        </div>
      </template>

      <button class="button opensea mt-6" v-if="!isCollectableActive">
        Opensea
      </button>
      <button class="button primary" v-else>
        {{ isAuction ? "Place a bid" : "Buy now" }}
      </button>
    </div>

    <div class="bottom-part bg-background-gray border-t p-8">
      <template v-if="!isCollectableActive">
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          AUCTION ENDED
        </div>
        <button class="button dark mt-4 w-full" @click="openWinnerModal" v-if="isWinnerButtonShown">
          <i class="fas fa-play-circle mr-2 text-xl icon-left text-white"></i>
          Claim your winnings
        </button>
      </template>

      <template v-else-if="isAuction">
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          {{ isUpcomming ? "AUCTION STARTS IN" : "AUCTION ENDS IN" }}
        </div>
        <progress-timer
          ref="timerRef"
          class="text-black text-3xl mt-2"
          :label="null"
          :startDate="startsAt"
          :endDate="endsAt"
          @onProgress="updateProgress"
        />
        <progress-bar
          :progress="0.5"
          class="bg-gray-300 h-3 mt-3"
          :colorClass="
            isCollectableActive
              ? isUpcomming
                ? 'bg-opensea'
                : 'bg-primary'
              : 'bg-gray-300'
          "
        />
      </template>

      <template v-else>
        <template v-if="isUpcomming">
          <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            AUCTION STARTS IN
          </div>
          <progress-timer
            ref="timerRef"
            class="text-black text-3xl mt-2"
            :label="null"
            :startDate="startsAt"
            :endDate="endsAt"
            @onProgress="updateProgress"
          />
          <progress-bar
            :progress="0.5"
            class="bg-gray-300 h-3 mt-3"
            :colorClass="
              isCollectableActive
                ? isUpcomming
                  ? 'bg-opensea'
                  : 'bg-primary'
                : 'bg-gray-300'
            "
          />
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
      </template>
    </div>
  </div>
</template>


<script>
import { ref, computed } from "vue";
import emitter from "@/services/utils/emitter"
import useWeb3 from "@/connectors/hooks"

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import useExchangeRate from '@/hooks/useExchangeRate.js'

export default {
  name: "BidCard",
  components: { Tag, PriceDisplay, ProgressBar, ProgressTimer },
  props: {
    startsAt: String,
    endsAt: String,

    isAuction: Boolean,
    numberOfBids: Number,

    edition: Number,
    edition_of: Number,
    items: Number,
    items_of: Number,
    price: Number,
    priceUSD: Number,

    progress: Number,
    isCollectableActive: Boolean,
    isUpcomming: Boolean,
    is_sold_out: Boolean,
    collectable: Object,
  },
  setup(props) {
    // const state = reactive({
    //   progress: 0.35,
    // });
    const {account} = useWeb3();
    const collectableData = ref(props.collectable);
    const isWinnerButtonShown = computed(() => account.value.toLowerCase() === collectableData.value.winner_address.toLowerCase());
    const timerRef = ref(null);
    const currentProgress = ref(props.progress);

    // const startsAt = computed(() => "2021-03-13T21:00:00.000Z");
    // const endsAt = computed(() => "2021-03-19T21:00:00.000Z");

    // const isAuction = computed(() => true);
    // const numberOfBids = computed(() => 5);

    // const edition = computed(() => 1);
    // const edition_of = computed(() => 1);
    // const items = computed(() => 3);
    // const items_of = computed(() => 40);

    // const price = computed(() => 22.05);

    // const progress = computed(() => state.progress);
    // const hasEnded = computed(() => false);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const updateProgress = function (event) {
      currentProgress.value = event;
    };



    const { ethereum, convertEthToUSDAndFormat } = useExchangeRate();

    const openWinnerModal = () => {
      emitter.emit('openWinnerModal', collectableData.value);
    }

    return {
      // startsAt,
      // endsAt,
      // isAuction,
      // numberOfBids,
      // edition,
      // edition_of,
      // items,
      // items_of,
      // price,
      currentProgress,
      addTime,
      updateProgress,
      ethereum,
      convertEthToUSDAndFormat,
      openWinnerModal,
      isWinnerButtonShown,
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
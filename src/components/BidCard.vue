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
        >{{ items_of - items }}/{{ items_of }}
        </tag
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
        <div class="outlined-input mt-5" :class="{ invalid: hasError || isFieldInvalid }">
          <input
              v-model="auctionField.value"
              v-if="isAuction"
              type="number"
              placeholder="Enter your bid"
          />
          <input
              v-model="saleField.value"
              v-if="!isAuction"
              step="1"
              min="1"
              type="number"
              placeholder="Enter amount"
          />
          <template v-if="isAuction">
            <div class="icon w-5 mr-1">
              <img
                  src="@/assets/icons/icon--ethereum.svg"
                  class="cursor-pointer mr-2 opacity-50"
                  alt="SEEN"
              />
            </div>
            <div class="type font-bold">ETH</div>
          </template>
        </div>
        <span class="error-notice" v-if="isAuction">{{ auctionField.errors[0] }}</span>
        <span class="error-notice" v-if="!isAuction">{{ saleField.errors[0] }}</span>

        <div class="text-center text-gray-400 text-sm py-2">
          <p v-if="!ethereum"><i class="fas fa-spinner fa-spin"></i></p>
          <p v-else>
            Approx. {{ convertEthToUSDAndFormat(currentBidValue || "0") }}
          </p>
        </div>
      </template>

      <button class="button opensea mt-6" v-if="!isCollectableActive" @click="viewOnOpenSea">
        Opensea
      </button>
      <template v-else>
        <button class="button primary" v-if="account && hasEnoughFunds()" @click="placeABidOrBuy">
          {{ isAuction ? "Place a bid" : "Buy now" }}
        </button>
        <button class="button dark disabled opacity-50" v-if="account && !hasEnoughFunds()">
          Insufficient funds
        </button>
        <button
            v-if="!account"
            class="cursor-pointer button primary flex-shrink-0"
            @click="openWalletModal"
        >
          <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
        </button>
      </template>
    </div>

    <div class="bottom-part bg-background-gray border-t p-8">
      <template v-if="!isCollectableActive">
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold" v-if="isAuction">
          AUCTION ENDED
        </div>
        <div v-else>
          <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold" >
            SOLD OUT ({{ items_of }} items)
          </div>

        </div>
        <button
            class="button dark mt-4 w-full"
            @click="openWinnerModal"
            v-if="isWinnerButtonShown"
        >
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
            :inversed="isAuction"
            :progress="currentProgress"
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
              :progress="currentProgress"
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
            {{ items_of - items }} out of {{ items_of }}
          </div>
          <progress-bar :progress="progress" class="bg-gray-300 h-3 mt-3"/>
        </template>
      </template>
    </div>
  </div>
</template>


<script>
import {ref, computed, watchEffect, reactive} from "vue";
import {useStore} from "vuex";
import emitter from "@/services/utils/emitter";
import useWeb3 from "@/connectors/hooks";

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import {formatEther} from "@ethersproject/units";
import useSigner from "@/hooks/useSigner";
import useContractEvents from "@/hooks/useContractEvents";
import {useToast} from "primevue/usetoast";
import {useField, useForm} from "vee-validate";

export default {
  name: "BidCard",
  components: {Tag, PriceDisplay, ProgressBar, ProgressTimer},
  props: {
    startsAt: String,
    endsAt: String,

    isAuction: Boolean,
    numberOfBids: Number,

    edition: Number,
    edition_of: Number,
    items: [Number, String],
    items_of: Number,
    price: Number,
    priceUSD: Number,

    progress: Number,
    isCollectableActive: Boolean,
    isUpcomming: Boolean,
    is_sold_out: Boolean,
    collectable: Object,
    lastBid: Object,
  },
  setup(props, ctx) {
    const price = ref(props.price);
    const toast = useToast();
    const store = useStore();
    const isAuction = ref(props.isAuction);
    const {account} = useWeb3();
    const hasError = ref(null);
    const collectableData = ref(props.collectable);
    const winner = computed(() => collectableData.value.winner_address);
    const balance = computed(() => store.getters['application/balance'].eth);

    const form = useForm({
      initialValues: {
        bid: "",
        amount: "",
      },
    });

    const auctionField = reactive(useField("bid", (val) => fieldValidatorAuction(val)));
    const saleField = reactive(useField("amount", (val) => fieldValidatorSale(val)));

    const isFieldInvalid = computed(() => {
      return isAuction.value ? auctionField.errors.length : saleField.errors.length
    });

    const fieldValidatorAuction = (value) => {
      if (value) {
        return hasEnoughFunds() ? true : 'You do not have enough funds';
      } else {
        return true;
      }
    }

    const fieldValidatorSale = (value) => {
      if (value) {
        return hasEnoughFunds() ? true : 'You do not have enough funds';
      } else {
        return true;
      }
    }

    const priceUSDByType = computed(() => isAuction.value === 1);

    const {
      bid,
      buy,
      initializeContractEvents,
    } = useContractEvents();

    watchEffect(() => {
      if (collectableData.value) {
        initializeContractEvents(collectableData.value, true)
      }
    })

    const isWinnerButtonShown = computed(() => {
      if (
          typeof account.value === "string" &&
          typeof winner.value === "string"
      ) {
        return account.value.toLowerCase() === winner.value.toLowerCase();
      } else {
        return false;
      }
    });
    const timerRef = ref(null);
    const currentProgress = ref(props.progress);
    const currentBid = ref("");
    const numberOfItems = ref(1);
    const currentBidValue = computed(() => {
      if (isAuction.value) {
        return parseFloat(auctionField.value);
      } else {
        return parseInt(saleField.value) * price.value;
      }
    });

    const placeABidOrBuy = () => {
      let amount = 0;
      try {
        if (isAuction.value) {
          amount = parseFloat(auctionField.value, 10);
          if (isNaN(amount)) throw new Error("invalid number");
          if (amount < price.value) throw new Error("not enough funds");
          onBid(auctionField.value);
        } else {
          amount = parseInt(saleField.value, 10);
          if (isNaN(amount)) throw new Error("invalid number");
          if (amount > props.items_of - props.items) {
            throw new Error("not enough items");
          }
          onBuy(saleField.value);

        }
        hasError.value = null;
      } catch (e) {
        hasError.value = true;
        console.error("Error when trying to bid", e);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error placing ${isAuction.value ? 'a bid' : 'a buy order'}.`,
          life: 3000
        });
      }
    };

    const onBuy = async (event) => {
      try {
        const currentPrice = price.value;
        const amount = +parseInt(event, 10);
        const totalPrice = amount * currentPrice;
        if (totalPrice > balance.value) {
          throw new Error('Not enough funds in wallet!');
        }

        await buy(amount);
      } catch (e) {
        console.error("Error placing bid/buy", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error placing a buy order.', life: 3000});
      }
    };

    const onBid = async (event) => {
      if (!balance.value) return;
      try {
        const amount = +parseFloat(event, 10);
        if (amount > balance.value) {
          throw new Error('Not enough funds in wallet!');
        }
        await bid(amount);
      } catch (e) {
        console.error("Error placing bid/buy", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error placing a bid.', life: 3000});
      }
    };

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const updateProgress = function (event) {
      currentProgress.value = event;
    };

    const {ethereum, convertEthToUSDAndFormat} = useExchangeRate();

    const hasEnoughFunds = () => {
      if (!balance.value) return true;
      const funds = parseFloat(balance.value);
      if (isAuction.value) {
        let valid = true;
        if (props.lastBid) {
          valid = funds > parseFloat(props.lastBid.toString());
        }
        if (valid) {
          valid = funds > parseFloat(auctionField.value ? auctionField.value : 0);
        }
        return valid;
      } else {
        return funds > (props.price * parseInt(numberOfItems));
      }
    }

    const openWinnerModal = () => {
      emitter.emit("openWinnerModal", collectableData.value);
    };

    const openWalletModal = () => {
      store.dispatch("application/openModal", "WalletModal");
    };

     const viewOnOpenSea = () => {
      let nftAddress = collectableData.value.nft_contract_address
      let nftTokenId = collectableData.value.nft_token_id
      window.location = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
    }

    return {
      account,
      currentProgress,
      addTime,
      updateProgress,
      ethereum,
      convertEthToUSDAndFormat,
      openWinnerModal,
      isWinnerButtonShown,
      placeABidOrBuy,
      currentBid,
      numberOfItems,
      currentBidValue,
      hasError,
      openWalletModal,
      hasEnoughFunds,
      auctionField,
      saleField,
      isFieldInvalid,
      viewOnOpenSea
    };
  },
};
</script>


<style lang="scss" scoped>
.outlined-input {
  @apply flex items-center border rounded-md border-black px-5;

  height: 60px;
  border-width: 2px;

  &.invalid {
    @apply border-red-500;
  }

  input {
    @apply outline-none flex-grow border-transparent;

    height: 56px;
    min-width: 0;
  }

  .button.disabled {
    cursor: not-allowed !important;
  }
}

.error-notice {
  @apply mt-1;
}
</style>

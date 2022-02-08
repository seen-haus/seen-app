<template>
  <div class="bid-card shadow-lifted rounded-xl flex flex-col overflow-hidden" :class="darkMode ? 'dark-mode-surface' : 'light-mode-background'">
    <div class="top-part flex flex-col p-8">
      <div
          v-if="!isCollectableActive"
          class="flex justify-start items-center text-xs font-bold"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-400'"
      >
        {{ is_closed ? (isAuction ? 'AUCTION CLOSED' : 'SALE CLOSED') : 'AUCTION HAS ENDED'}}
      </div>
      <div
          v-else-if="!isAuction"
          class="flex justify-start items-center text-xs font-bold"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-400'"
      >
        <span v-if="isOpenEdition" class="tracking-widest mr-4">OPEN EDITION</span>
        <span v-if="!isOpenEdition" class="tracking-widest mr-4">EDITIONS LEFT </span>
        <tag 
          v-if="!isOpenEdition"
          class="bg-fence-light self-end font-semibold"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-400'"
        >{{ items }}/{{ items_of }}
        </tag
        >
      </div>

      <price-display
          size="lg"
          class="self-start mt-5"
          :class="darkMode ? 'dark-mode-text' : 'light-mode-text'"
          type="ETH"
          :price="price"
          :priceUSD="priceUSD"
          :number-of-bids="isAuction ? numberOfBids : undefined"
      />

      <div class="text-gray-400 text-sm py-2" v-if="account">
        <p>
          Bidding status (<strong>{{shortenAddress(account)}}</strong>): <span :style="`color:${isWhitelistedBidder ? 'green' : 'orange'}`">{{isWhitelistedBidder ? 'verified' : 'unverified'}}</span>
        </p>
      </div>

      <template v-if="isCollectableActive && !isUpcomming && (!requiresBiddingWhitelist || (requiresBiddingWhitelist && isWhitelistedBidder))">
        <div class="outlined-input mt-5" :class="{ 
          invalid: hasError || isFieldInvalid,
          'light-mode-background': darkMode,
        }">
          <input
              v-model="auctionField.value"
              v-if="isAuction"
              type="number"
              @keypress="isNumber"
              :placeholder="'Min bid price is ' + minimumBidValue + ' ETH'"
          />
          <input
              v-model="saleField.value"
              v-if="!isAuction"
              step="1"
              min="1"
              @keypress="isInteger"
              type="number"
              placeholder="Enter quantity"
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
      <button class="button primary mt-6" v-if="!isCollectableActive && isVRFSale && !hasRequestedVRF && !hasFulfilledVRF && !hasCommittedVRF && !isSubmittingRandomnessRequest && (itemsBought > 0)" @click="startRandomnessRequest">
        Generate Chainlink Randomness
      </button>
      <button class="button disabled mt-6" v-if="!isCollectableActive && isVRFSale && (hasRequestedVRF || isSubmittingRandomnessRequest) && !hasFulfilledVRF && !hasCommittedVRF">
        Awaiting Chainlink Response...
      </button>
      <span class="text-center text-gray-400 text-sm pt-2" v-if="!isCollectableActive && isVRFSale && (hasRequestedVRF || isSubmittingRandomnessRequest) && !hasFulfilledVRF && !hasCommittedVRF">This may take 5-10 minutes</span>
      <button class="button primary mt-6" v-if="!isCollectableActive && isVRFSale && hasRequestedVRF && hasFulfilledVRF && !hasCommittedVRF && !isSubmittingRandomnessCommitment" @click="startRandomnessCommitment">
        Commit Chainlink Randomness
      </button>
      <button class="button disabled mt-6" v-if="!isCollectableActive && isVRFSale && hasRequestedVRF && hasFulfilledVRF && !hasCommittedVRF && isSubmittingRandomnessCommitment">
        Committing Chainlink Randomness...
      </button>
      <button class="button primary mt-6" v-if="!isCollectableActive && isVRFSale && hasRequestedVRF && hasFulfilledVRF && hasCommittedVRF && !isSubmittingClaimVRF && !isCurrentAccountEntitledToPhysical && isCurrentAccountEntitledToDigitalClaimVRF" @click="startClaimVRF">
        Claim Tokens
      </button>
      <button class="button disabled mt-6" v-if="!isCollectableActive && isVRFSale && hasRequestedVRF && hasFulfilledVRF && hasCommittedVRF && isSubmittingClaimVRF">
        Claiming Tokens...
      </button>
      <template v-else-if="isCollectableActive && !isUpcomming">
        <div class="text-gray-400 flex text-sm py-2" v-if="isWhitelistedBidder">
          <input
            class="outlined-input-checkbox mt-1" :class="{ invalid: hasError || isFieldInvalid }"
            v-model="acceptTermsField.value"
            type="checkbox"
            :placeholder="'Propy Terms & Conditions'"
          />
          <p style="width: calc(100% - 30px)">
            I confirm that I have read and accept the <a href="https://propy-docs-storage-public.s3.amazonaws.com/NFT/8.2.22-220207_00267_NEVER_FORGET_TO_HODL_LLC_Operating_Agreement_ACCEPTANCE+(execution).pdf" style="color: #2196F3;" target="_blank" rel="noopener noreferrer">Propy Operating Agreement</a> and <a href="https://propy-docs-storage-public.s3.amazonaws.com/NFT/220207.00267_Administration+Agreement+(execution)+MA.pdf" style="color: #2196F3;" target="_blank" rel="noopener noreferrer">Propy Administration Agreement</a>. I agree to be registered as a member of the LLC in case I am the winner of this Auction and I hereby give my authorization for my electronic signature to be placed in those agreements.
          </p>
        </div>
        <span v-if="isWhitelistedBidder" class="error-notice">{{ acceptTermsField.errors[0] }}</span>
        <button 
          class="button primary mt-1"
          :class="{
            'cursor-wait disabled opacity-50': isSubmitting,
            'disabled opacity-50': !isWhitelistedBidder || !acceptTermsField.value
          }"
          :disabled="isSubmitting || !acceptTermsField.value"
          v-if="account && hasEnoughFunds() && isWhitelistedBidder"
          @click="placeABidOrBuy"
        >
          <span v-if="!isSubmitting">{{ isAuction ? (`Place ${isAwaitingReserve ? 'reserve' : 'a'} bid`) : "Buy now" }}</span>
          <span v-else>Submitting...</span>
        </button>
        <button :class="darkMode ? 'light' : 'dark'" class="button disabled opacity-50" v-if="account && !hasEnoughFunds() && (!requiresBiddingWhitelist || (requiresBiddingWhitelist && isWhitelistedBidder))">
          Insufficient funds
        </button>
        <template v-if="account && requiresBiddingWhitelist && !isWhitelistedBidder">
          
          <div class="text-gray-400 text-sm py-2">
            <p>
              All bidders are required to submit KYC information before being able to bid on this auction.<br/><br/>Once you have submitted your KYC information, Propy will validate your information and enable your bidding status (this may take up to 2 hours).
            </p>
          </div>
          <!-- <button
              class="cursor-pointer button primary flex-shrink-0 mt-2"
              @click="registerToBid"
          >
            <i class="fas fa-id-badge mr-2 transform"></i> Register to bid
          </button> -->
          <button
              class="cursor-pointer button primary flex-shrink-0 mt-2 mb-1"
              @click="startKycProcess"
          >
            <i class="fas fa-id-badge mr-2 transform"></i> Start KYC Process
          </button>
          <button
              class="cursor-pointer button primary flex-shrink-0 mt-2"
              @click="checkWhitelistStatus"
              :class="{
                'cursor-wait disabled opacity-50': isCheckingWhitelistStatus,
              }"
          >
            <i class="fas fa-redo mr-2 transform"></i> Recheck Bidding Status
          </button>
          <div class="text-gray-400 text-sm mt-4">
            <p>
              If it has been over 2 hours since submitting your KYC info and you have not yet been granted bidding access, please contact Propy via <a style="color: #2d78ff" href="mailto:nft@propy.com">nft@propy.com</a>
            </p>
          </div>
        </template>
        <button
            v-if="!account"
            class="cursor-pointer button primary flex-shrink-0"
            @click="openWalletModal"
        >
          <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
        </button>
      </template>
      <template v-if="hasOverrideClaimLink && isCurrentAccountEntitledToPhysical">
        <div class="text-gray-400 text-sm py-2">
          <p>
            Congratulations! You will receive an email with the next steps within an hour.
          </p>
        </div>
      </template>
      <!-- <button class="button primary mt-3" v-if="hasOverrideClaimLink && isCurrentAccountEntitledToPhysical" @click="viewOverrideClaimLink">
        Complete Ownership Process
      </button> -->
    </div>

    <div class="bottom-part border-t p-8" :class="darkMode ? 'dark-mode-surface-darkened black-border' : 'light-mode-surface'">
      <template v-if="!isCollectableActive">
        <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold" v-if="isAuction">
          AUCTION ENDED
        </div>
        <div v-else>
          <div v-if="!isOpenEdition && !isVRFSale" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            {{ is_closed ? 'CLOSED' : 'SOLD OUT (' + items_of + ' EDITIONS)'}}
          </div>
          <div v-if="isVRFSale" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            {{ is_closed ? 'CLOSED' : 'SOLD ' + itemsBought + ' EDITIONS'}}
          </div>
          <div v-if="isOpenEdition" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            {{ 'SOLD OUT (' + itemsBought + ' EDITIONS)' }}
          </div>
        </div>
        <!-- <button
            class="button dark mt-4 w-full"
            @click="openWinnerModal"
            v-if="isWinnerButtonShown"
        >
          <i class="fas fa-play-circle mr-2 text-xl icon-left text-white"></i>
          Claim your winnings
        </button> -->
      </template>

      <template v-else-if="isAuction">
        <div v-if="!isAwaitingReserve" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
          {{ isUpcomming ? "AUCTION STARTS IN" : "AUCTION ENDS IN" }}
        </div>
        <div v-if="isAwaitingReserve && currentProgress" class="tracking-widest mb-6 text-gray-400 text-xs font-bold">
          7 HR COUNTDOWN BEGINS ONCE RESERVE IS MET
        </div>
        <div v-if="isAwaitingReserve && !currentProgress" class="tracking-widest mb-6 text-gray-400 text-xs font-bold">
          BIDDING OPENS IN
        </div>
        <progress-timer
            v-if="!isAwaitingReserve"
            ref="timerRef"
            class="text-3xl mt-2"
            :class="darkMode ? 'dark-mode-text' : 'text-black'"
            :isAuction="isAuction"
            :label="null"
            :startDate="startsAt"
            :endDate="endsAt"
            @onProgress="updateProgress"
            @onTimerStateChange="updateState"
        />
        <progress-timer
            v-if="isAwaitingReserve"
            ref="timerRef"
            class="text-3xl mt-2"
            :class="darkMode ? 'dark-mode-text' : 'text-black'"
            :isAuction="isAuction"
            :label="null"
            :startDate="minimumStartsAt"
            :isAwaitingReserve="true"
            @onProgress="updateProgress"
            @onTimerStateChange="updateState"
        />
        <progress-bar
            :inversed="isAuction"
            :progress="currentProgress"
            :endDate="endsAt"
            class="h-3 mt-3"
            progressBackgroundColor="bg-gray-300"
            :colorClass="
            isCollectableActive && !isAwaitingReserve
              ? isUpcomming
                ? 'bg-opensea'
                : 'bg-primary'
              : 'bg-gray-300'
          "
        />
        <p class="mt-6 text-gray-400 text-sm" v-if="!isAwaitingReserve">Bids placed in the last 15 minutes will reset the auction ending countdown to 15 minutes.</p>
      </template>

      <template v-else>
        <template v-if="isUpcomming">
          <div class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            {{ isAuction ? "AUCTION STARTS IN" : "DROP OPENS IN" }}
          </div>
          <progress-timer
              ref="timerRef"
              class="text-3xl mt-2"
              :class="darkMode ? 'dark-mode-text' : 'text-black'"
              :isAuction="isAuction"
              :label="null"
              :startDate="startsAt"
              :endDate="endsAt"
              @onProgress="updateProgress"
              @onTimerStateChange="updateState"
          />
          <progress-bar
              :progress="currentProgress"
              class="h-3 mt-3"
              progressBackgroundColor="bg-gray-300"
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
          <div v-if="!isOpenEdition" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            EDITION(S) LEFT
          </div>
          <div v-if="!isOpenEdition" class="text-2.5xl font-bold py-2" :class="darkMode && 'dark-mode-text'">
            {{ items }} out of {{ items_of }}
          </div>
          <div v-if="isOpenEdition" class="tracking-widest mr-4 text-gray-400 text-xs font-bold">
            EDITION(S) PURCHASED
          </div>
          <div v-if="isOpenEdition" :class="darkMode ? 'dark-mode-text' : 'text-black'" class="text-2.5xl font-bold pt-2">
            {{ itemsBought }}
          </div>
          <div v-if="isOpenEdition || isVRFSale" class="tracking-widest mr-4 text-gray-400 text-xs font-bold pt-4">
            {{isVRFSale ? 'SALE ENDS IN' : 'OPEN EDITION ENDS IN'}}
          </div>
          <progress-bar v-if="!isOpenEdition && !isVRFSale" :progress="progress" progressBackgroundColor="bg-gray-300" class="h-3 mt-3"/>
          <progress-timer
              v-if="isOpenEdition || isVRFSale"
              ref="timerRef"
              class="text-3xl mt-2"
              :class="darkMode ? 'dark-mode-text' : 'text-black'"
              :isAuction="isAuction"
              :label="null"
              :startDate="startsAt"
              :endDate="endsAt"
              @onProgress="updateProgress"
              @onTimerStateChange="updateState"
          />
          <progress-bar
              v-if="isOpenEdition || isVRFSale"
              :inversed="true"
              :progress="currentProgress"
              class="h-3 mt-3"
              progressBackgroundColor="bg-gray-300"
              :colorClass="
              isCollectableActive
                ? isUpcomming
                  ? 'bg-opensea'
                  : 'bg-primary'
                : 'bg-gray-300'
            "
          />
        </template>
      </template>
    </div>
  </div>
</template>


<script>
import {ref, computed, watchEffect, reactive, watch} from "vue";
import {useStore} from "vuex";

import {useField, useForm} from "vee-validate";
import {useToast} from "primevue/usetoast";

import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import numberHelper from "@/services/utils/numbers"
import emitter from "@/services/utils/emitter";
import { BidRegistrationService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks";
import useExchangeRate from "@/hooks/useExchangeRate.js";
import useSigner from "@/hooks/useSigner";
import useContractEvents from "@/hooks/useContractEvents";
import {shortenAddress} from "@/services/utils/index"
import {useSeenNFTContract, useV2VRFSaleContract, useV2PropyAuctionContract, useEthAddressWhitelistContract} from "@/hooks/useContract";

export default {
  name: "BidCard",
  components: {Tag, PriceDisplay, ProgressBar, ProgressTimer},
  props: {
    status: { type: String, default: "live" },
    startsAt: String,
    minimumStartsAt: String,
    endsAt: String,

    isAuction: Boolean,
    numberOfBids: Number,

    isOpenEdition: Boolean,
    itemsBought: Number,
    
    isVRFSale: Boolean,
    hasRequestedVRF: Boolean,
    hasFulfilledVRF: Boolean,
    hasCommittedVRF: Boolean,

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
    is_closed: Boolean,
    collectable: Object,
    nextBidPrice: Number,
    claim: [Number, Boolean],
    requiresBiddingWhitelist: Boolean,
    bidDisclaimers: [Array],
    overrideClaimLink: String,
  },
  computed: {
    isAwaitingReserve: function () {
      switch (this.status) {
        case "awaiting-reserve-bid":
          return true;
        default:
          return false;
      }
    },
  },
  setup(props, ctx) {
    const toast = useToast();
    const store = useStore();
    const {account} = useWeb3();

    const price = ref(props.price);
    const isAuction = ref(props.isAuction);
    const hasError = ref(null);
    const isWhitelistedBidder = ref(false);
    const isCheckingWhitelistStatus = ref(false);
    const isSubmitting = ref(false);
    const isSubmittingRandomnessRequest = ref(false);
    const isSubmittingRandomnessCommitment = ref(false);
    const isSubmittingClaimVRF = ref(false);
    const isCurrentAccountEntitledToPhysical = ref(false);
    const isCurrentAccountEntitledToDigitalClaimVRF = ref(false);
    const isCurrentAccountEntitledToDigital = ref(false);
    const collectableData = ref(props.collectable);
    const showNotificationButtonRef = ref(false);

    const showNotificationButton = computed(() => showNotificationButtonRef.value);
    const winner = computed(() => collectableData.value.winner_address);
    const tangibility = computed(() => collectableData.value.type);
    const balance = computed(() => store.getters['application/balance'].eth);
    const darkMode = computed(() => store.getters['application/darkMode']);
    const user = computed(() => store.getters['user/user']);

    const form = useForm({
      initialValues: {
        bid: "",
        amount: "",
      },
    });

    const acceptTermsField = reactive(useField("terms and conditions", (val) => fieldValidatorAcceptTerms(val)));
    const auctionField = reactive(useField("bid", (val) => fieldValidatorAuction(val)));
    const saleField = reactive(useField("amount", (val) => fieldValidatorSale(val)));

    const isFieldInvalid = computed(() => {
      return isAuction.value ? auctionField.errors.length : saleField.errors.length
    });

    const checkWhitelistStatus = async () => {
      isCheckingWhitelistStatus.value = true;
      try {
        if(collectableData.value.contract_address) {
          let auctionContract = useV2PropyAuctionContract(collectableData.value.contract_address);
          let isWhitelisted = await auctionContract.isBidderWhitelisted(account?.value);
          isWhitelistedBidder.value = isWhitelisted;
        } else {
          // TODO: Move to DB source if/when another one of these drops is done
          let ethWhitelistContract = useEthAddressWhitelistContract("0xBE2779646C64e0f7111F4Dd32f3a6940B4717629");
          let isWhitelisted = await ethWhitelistContract.isWhitelisted(account?.value);
          isWhitelistedBidder.value = isWhitelisted;
        }
      } catch (e) {
        isWhitelistedBidder.value = false;
        console.error(e);
      }
      isCheckingWhitelistStatus.value = false;
    }

    watchEffect(async () => {
      if (props.requiresBiddingWhitelist && account?.value && collectableData?.value?.contract_address) {
        await checkWhitelistStatus();
      } else {
        isWhitelistedBidder.value = false;
      }
    })

    watchEffect(async () => {
      if (account?.value && isAuction?.value && !props.isOpenEdition && !props?.isCollectableActive && collectableData?.value?.contract_address) {
        let auctionContract = useV2PropyAuctionContract(collectableData.value.contract_address);
        let auctionWinner = await auctionContract.winning();
        if(auctionWinner.toLowerCase() === account?.value.toLowerCase()) {
          isCurrentAccountEntitledToPhysical.value = true
        } else {
          isCurrentAccountEntitledToPhysical.value = false;
        }
      }
    })

    watchEffect(async () => {
      if(account?.value && !isAuction?.value && collectableData?.value?.contract_address && collectableData.value.nft_token_id && props.hasCommittedVRF) {
        // Cover sale scenarios, show claim button when balance is positive
        let vrfSaleContract = useV2VRFSaleContract(collectableData.value.contract_address);
        let ticketCount = await vrfSaleContract.addressToTicketCount(account?.value);
        if(parseInt(ticketCount) > 0) {
          isCurrentAccountEntitledToDigitalClaimVRF.value = true;
        } else {
          isCurrentAccountEntitledToDigitalClaimVRF.value = false;
        }
      }
    })

    const minimumBidValue = ref(props.price);

    watchEffect(() => {
      if(props.numberOfBids > 0) {
        minimumBidValue.value = props.price + 0.5;
      } else {
        minimumBidValue.value = props.price;
      }
    })

    const fieldValidatorAuction = (value) => {
      if (value) {
        if (parseFloat(value.toString()) < parseFloat(minimumBidValue.value.toString())) {
          if(props.numberOfBids > 0) {
            return 'Must be at least 0.5 ETH higher than the currently winning bid.'
          } else {
            return `Must be at least ${minimumBidValue.value} ETH.`
          }
        }
        return hasEnoughFunds() ? true : 'You do not have enough funds';
      } else {
        return true;
      }
    }

    const fieldValidatorSale = (value) => {
      if (value) {
        return hasEnoughFunds(value) ? true : 'You do not have enough funds';
      } else {
        return true;
      }
    }

    const fieldValidatorAcceptTerms = (value) => {
      if (value) {
        return true;
      } else {
        return 'Please accept the Propy Operating Agreement as well as the Propy Service Provider Agreement to continue';
      }
    }

    const priceUSDByType = computed(() => isAuction.value === 1);

    const {
      bid,
      buy,
      requestRandomness,
      commitRandomness,
      claimTokensSaleVRF,
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

    const openNotificationsModal = () => {
      store.dispatch('application/openModal', 'NotificationsModal')
    };

    const placeABidOrBuy = () => {
      let amount = 0;
      try {
        if (isAuction.value) {
          amount = parseFloat(auctionField.value, 10);
          if (isNaN(amount)) throw new Error("invalid number");
          if (amount < props.nextBidPrice) throw new Error("not enough funds");
          onBid(auctionField.value);
        } else {
          amount = parseInt(saleField.value, 10);
          if (isNaN(amount)) throw new Error("invalid number");

          // if (amount > props.items_of - props.items) {
          //   throw new Error("not enough items");
          // }
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

    const startRandomnessRequest = async () => {
      try {
        isSubmittingRandomnessRequest.value = true;
        await requestRandomness()
            .then(async () => {
              isSubmittingRandomnessRequest.value = false;
            }).catch(e => {
              console.log({e})
              toast.add({severity: 'error', summary: 'Error', detail: 'Error requesting randomness from Chainlink.', life: 5000});
              isSubmittingRandomnessRequest.value = false;
            });
      } catch (e) {
        isSubmittingRandomnessRequest.value = false;
        console.error("Error requesting randomness from Chainlink", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error requesting randomness from Chainlink.', life: 5000});
      }
    };

    const startRandomnessCommitment = async () => {
      try {
        isSubmittingRandomnessCommitment.value = true;
        await commitRandomness()
            .then(async () => {
              isSubmittingRandomnessCommitment.value = false;
            }).catch(e => {
              console.log({e})
              toast.add({severity: 'error', summary: 'Error', detail: 'Error committing randomness from Chainlink.', life: 5000});
              isSubmittingRandomnessCommitment.value = false;
            });
      } catch (e) {
        isSubmittingRandomnessCommitment.value = false;
        console.error("Error requesting randomness from Chainlink", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error committing randomness from Chainlink.', life: 5000});
      }
    };

    const startClaimVRF = async () => {
      try {
        isSubmittingClaimVRF.value = true;
        await claimTokensSaleVRF()
            .then(async () => {
              isSubmittingClaimVRF.value = false;
              if(account?.value && collectableData?.value?.contract_address && collectableData.value.nft_token_id) {
                // Cover sale scenarios, show claim button when balance is positive
                let nftContract = useSeenNFTContract(collectableData.value.nft_contract_address);
                let balanceOfCurrentAccount = 0;
                if((collectableData.value.nft_token_id.indexOf("[") === 0) || collectableData.value.is_vrf_drop) {
                  let tokenIds = JSON.parse(collectableData.value.nft_token_id);
                  for(let tokenId of tokenIds) {
                    let tokenBalanceCurentId = await nftContract.balanceOf(account.value, tokenId);
                    balanceOfCurrentAccount += parseInt(tokenBalanceCurentId);
                  }
                }
                if(parseInt(balanceOfCurrentAccount) > 0) {
                  isCurrentAccountEntitledToPhysical.value = true;
                } else {
                  isCurrentAccountEntitledToPhysical.value = false;
                }
              }
            }).catch(e => {
              console.log({e})
              toast.add({severity: 'error', summary: 'Error', detail: 'Error claiming tokens.', life: 5000});
              isSubmittingClaimVRF.value = false;
            });
      } catch (e) {
        isSubmittingClaimVRF.value = false;
        console.error("Error claiming VRF distributed tokens", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error claiming tokens.', life: 5000});
      }
    }

    const onBuy = async (event) => {
      try {
        const currentPrice = price.value;
        const amount = +parseInt(event, 10);
        const totalPrice = amount * currentPrice;

        isSubmitting.value = true
        await buy(amount)
            .then(async (response) => {
              isSubmitting.value = false
              if (response) {
                saleField.resetField(null)
              }
              if(account?.value && collectableData?.value?.contract_address && collectableData.value.nft_token_id) {
                // Cover sale scenarios, show claim button when balance is positive
                let nftContract = useSeenNFTContract(collectableData.value.nft_contract_address);
                let balanceOfCurrentAccount = 0;
                if((collectableData.value.nft_token_id.indexOf("[") === 0) || collectableData.value.is_vrf_drop) {
                  let tokenIds = JSON.parse(collectableData.value.nft_token_id);
                  for(let tokenId of tokenIds) {
                    let tokenBalanceCurentId = await nftContract.balanceOf(account.value, tokenId);
                    balanceOfCurrentAccount += parseInt(tokenBalanceCurentId);
                  }
                } else {
                  balanceOfCurrentAccount = await nftContract.balanceOf(account.value, collectableData.value.nft_token_id);
                }
                if(parseInt(balanceOfCurrentAccount) > 0) {
                  isCurrentAccountEntitledToPhysical.value = true;
                } else {
                  isCurrentAccountEntitledToPhysical.value = false;
                }
              }
            }).catch(e => {
              console.log({e})
              toast.add({severity: 'error', summary: 'Error', detail: 'Error placing a buy order.', life: 3000});
              isSubmitting.value = false
            });
      } catch (e) {
        console.error("Error placing bid/buy", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error placing a buy order.', life: 3000});
      }
    };

    const onBid = async (event) => {
      try {
        const amount = +parseFloat(event, 10);
        isSubmitting.value = true
        await bid(amount)
            .then((response) => {
              try {
                if(response) {
                  auctionField.resetField(null)
                }
                isSubmitting.value = false
              } catch(e) {
                console.log({'Error, likely just caused by unmounted component:': e})
              }
            }).catch(e => {
              console.log({e})
              toast.add({severity: 'error', summary: 'Error', detail: `Error placing a bid: ${e?.error?.message}.`, life: 8000});
              isSubmitting.value = false
            });
      } catch (e) {
        isSubmitting.value = false
        console.error("Error placing bid/buy", e);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error placing a bid.', life: 8000});
      }
    };

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const updateProgress = function (event) {
      currentProgress.value = event;
    };

    const updateState = function () {
      ctx.emit('updateState');
    }

    const {ethereum, convertEthToUSDAndFormat} = useExchangeRate();

    const hasEnoughFunds = () => {
      if (!balance.value) return true;
      const funds = parseFloat(balance.value);
      if (isAuction.value) {
        let valid = true;
        if (props.nextBidPrice) {
          valid = funds > parseFloat(props.nextBidPrice.toString());
        }
        if (valid) {
          valid = funds > parseFloat(auctionField.value ? auctionField.value : 0);
        }
        return valid;
      } else {
        return funds > (props.price * parseInt(form.values.amount || 0));
      }
    }

    const openWinnerModal = () => {
      emitter.emit("openWinnerModal", collectableData.value);
    };

    const openWalletModal = () => {
      store.dispatch('application/openModal', 'WalletModalConnectOnly')
    };

    const viewOnOpenSea = () => {
      let nftAddress = collectableData.value.nft_contract_address
      let nftTokenId = collectableData.value.nft_token_id
      window.open(`https://opensea.io/assets/${nftAddress}/${nftTokenId}`, '_blank').focus()
    }

    const startKycProcess = () => {
      window.open(`https://propy.com/kyc`, '_blank').focus()
    }

    const viewOverrideClaimLink = () => {
      window.open(props.overrideClaimLink, '_blank').focus()
    }

    const isNumber = (value) => {
      return numberHelper.isNumber(value)
    }

    const isInteger = (value) => {
      return numberHelper.isInteger(value)
    }

    return {
      account,
      currentProgress,
      addTime,
      updateProgress,
      updateState,
      ethereum,
      convertEthToUSDAndFormat,
      openWinnerModal,
      isWinnerButtonShown,
      placeABidOrBuy,
      currentBid,
      numberOfItems,
      currentBidValue,
      hasError,
      isSubmitting,
      isSubmittingRandomnessRequest,
      isSubmittingRandomnessCommitment,
      isSubmittingClaimVRF,
      openWalletModal,
      hasEnoughFunds,
      auctionField,
      saleField,
      tangibility,
      isFieldInvalid,
      viewOnOpenSea,
      viewOverrideClaimLink,
      hasOverrideClaimLink: props.overrideClaimLink ? true : false,
      isNumber,
      isInteger,
      claimId: props.claim?.id ? props.claim.id : null,
      isWhitelistedBidder,
      isCurrentAccountEntitledToPhysical,
      isCurrentAccountEntitledToDigital,
      isCurrentAccountEntitledToDigitalClaimVRF,
      darkMode,
      nftTokenId: collectableData.value.nft_token_id,
      showNotificationButton,
      openNotificationsModal,
      startRandomnessRequest,
      startRandomnessCommitment,
      startClaimVRF,
      startKycProcess,
      shortenAddress,
      checkWhitelistStatus,
      isCheckingWhitelistStatus,
      acceptTermsField,
      minimumBidValue,
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

input {
  box-shadow: none !important;
  border: none !important;
  &:focus {
    outline: none !important;
  }

  &::-moz-focus-inner {
    border: 0 !important;
    outline: none
  }
}
</style>

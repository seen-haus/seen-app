<template>
  <div class="bid-card shadow-lifted rounded-xl flex flex-col overflow-hidden" :class="darkMode ? 'dark-mode-surface' : 'light-mode-background'">
    <div class="top-part flex flex-col p-8">
      <div
          v-if="!isCollectableActive"
          class="flex justify-start items-center text-xs font-bold"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-400'"
      >
        {{ isAuction ? 'AUCTION ENDED' : 'SALE OVER'}}
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

      <template v-if="isCollectableActive && !isUpcomming && (!requiresRegistration || (requiresRegistration && isRegisteredBidder))">
        <div class="outlined-input mt-5" :class="{ 
          invalid: hasError || isFieldInvalid,
          'light-mode-background': darkMode,
        }">
          <input
              v-model="auctionField.value"
              v-if="isAuction"
              type="number"
              @keypress="isNumber"
              :placeholder="'Min bid price is ' + nextBidPrice + ' ETH'"
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
      <button class="button opensea mt-6" v-if="!isCollectableActive && nftTokenId && !isVRFSale" @click="viewOnOpenSea">
        Opensea
      </button>
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
        <div v-if="bidDisclaimers && bidDisclaimers.length > 0 && (!requiresRegistration || (requiresRegistration && isRegisteredBidder))" class="text-gray-400 text-sm py-2">
            <p style="width: calc(100%)">
              Please note:<br/>
              <ul>
                <li v-for="item in bidDisclaimers" :key="item">• {{item}}</li>
              </ul>
            </p>
        </div>
        <template v-if="isCollectableActive">
          <div class="text-gray-400 flex text-sm py-2">
            <input
              class="outlined-input-checkbox mt-1" :class="{ invalid: hasError || isFieldInvalid }"
              v-model="acceptPhysicalTermsField.value"
              type="checkbox"
              :placeholder="'Physical Terms'"
            />
            <p style="width: calc(100% - 30px)">
              I accept that physical items associated with purchased NFTs are only claimable for 31 days from the date of purchase. <span class="text-xs error-notice">* required</span>
            </p>
          </div>
          <span class="error-notice">{{ acceptPhysicalTermsField.errors[0] }}</span>
          <div v-if="isVRFSale">
            <div class="text-gray-400 flex text-sm py-2">
              <input
                class="outlined-input-checkbox mt-1" :class="{ invalid: hasError || isFieldInvalid }"
                v-model="acceptVRFTermsField.value"
                type="checkbox"
                :placeholder="'Physical Terms'"
              />
              <p style="width: calc(100% - 30px)">
                I understand that I will need to come back to this page once the sale has ended in order to claim my NFT (randomness is generated once the sale ends). <span class="text-xs error-notice">* required</span>
              </p>
            </div>
            <span class="error-notice">{{ acceptVRFTermsField.errors[0] }}</span>
          </div>
        </template>
        <button class="button primary mt-1"
                :class="{
                  'cursor-wait disabled opacity-50': isSubmitting,
                  'disabled opacity-50': (tangibility === 'tangible_nft' && !acceptPhysicalTermsField.value) || (isVRFSale && !acceptVRFTermsField.value)
                }"
                :disabled="isSubmitting" v-if="account && hasEnoughFunds() && (!requiresRegistration || (requiresRegistration && isRegisteredBidder))" @click="placeABidOrBuy">
          <span v-if="!isSubmitting">{{ isAuction ? (`Place ${isAwaitingReserve ? 'reserve' : 'a'} bid`) : "Buy now" }}</span>
          <span v-else>Submitting...</span>
        </button>
        <button
          class="button primary mt-4"
          :class="{'cursor-wait disabled opacity-50': isSubmitting}"
          :disabled="isSubmitting"
          v-if="showNotificationButton"
          @click="openNotificationsModal"
        >
          <span>Notification Manager</span>
        </button>
        <button :class="darkMode ? 'light' : 'dark'" class="button disabled opacity-50" v-if="account && !hasEnoughFunds() && (!requiresRegistration || (requiresRegistration && isRegisteredBidder))">
          Insufficient funds
        </button>
        <template v-if="account && requiresRegistration && !isRegisteredBidder">
          <div class="text-gray-400 text-sm py-2">
            <p>
              Your real information is required for identity verification only. You can become an owner <b>only</b> if you’re older than 18 years old, and provide your name as per your ID.
            </p>
          </div>
          <div class="outlined-input mt-2" :class="{ invalid: hasError || isFieldInvalid }">
            <input
                v-model="firstNameField.value"
                autocomplete="given-name"
                :placeholder="'First Name as per ID'"
            />
          </div>
          <span class="error-notice">{{ firstNameField.errors[0] }}</span>
          <div class="outlined-input mt-2" :class="{ invalid: hasError || isFieldInvalid }">
            <input
                v-model="lastNameField.value"
                autocomplete="family-name"
                :placeholder="'Last Name as per ID'"
            />
          </div>
          <span class="error-notice">{{ lastNameField.errors[0] }}</span>
          <div class="outlined-input mt-2" :class="{ invalid: hasError || isFieldInvalid }">
            <input
                v-model="emailField.value"
                autocomplete="email"
                type="email"
                :placeholder="'Email Address'"
            />
          </div>
          <span class="error-notice">{{ emailField.errors[0] }}</span>
          <div class="text-gray-400 flex text-sm py-2">
            <input
              class="outlined-input-checkbox mt-1" :class="{ invalid: hasError || isFieldInvalid }"
              v-model="acceptTermsField.value"
              type="checkbox"
              :placeholder="'Email Address'"
            />
            <p style="width: calc(100% - 30px)">
              I agree with Propy's <a href="https://propy.com/browse/terms-and-conditions/" style="color: #2196F3;" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and <a href="https://propy.com/browse/privacy-policy/" style="color: #2196F3" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. I hereby declare that the information provided is true and correct, and I am not subject to any sanctions imposed by a regulatory body.
            </p>
          </div>
          <span class="error-notice">{{ acceptTermsField.errors[0] }}</span>
          <button
              class="cursor-pointer button primary flex-shrink-0 mt-2"
              @click="registerToBid"
          >
            <i class="fas fa-id-badge mr-2 transform"></i> Register to bid
          </button>
        </template>
        <button
            v-if="!account"
            class="cursor-pointer button primary flex-shrink-0"
            @click="openWalletModal"
        >
          <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
        </button>
      </template>
      <button class="button primary mt-6" v-if="hasOverrideClaimLink && isCurrentAccountEntitledToPhysical" @click="viewOverrideClaimLink">
        Claim Physical
      </button>
      <button class="button primary mt-6" v-if="claimId !== null && !hasOverrideClaimLink && isCurrentAccountEntitledToPhysical" @click="$router.push({name: 'claims', params: {contractAddress: claimId}})">
        Claim Physical
      </button>
      <button class="button primary mt-6" v-if="claimId !== null && isOpenEdition && isCurrentAccountEntitledToDigital" @click="$router.push({name: 'claims', params: {contractAddress: claimId}})">
        Claim NFT
      </button>
      <button class="button primary mt-6" v-if="isReadyForClosure && isAuction" @click="closeAuction">
        {{`${winningAddress}`.toLowerCase() === `${account}`.toLowerCase() ? 'Claim NFT' : 'Close Auction'}}
      </button>
      <button class="button primary mt-6" v-if="isReadyForClosure && !isAuction" @click="closeSale">
        Close Sale
      </button>
    </div>

    <div class="bottom-part border-t p-8" :class="darkMode ? 'dark-mode-surface-darkened black-border' : 'light-mode-surface'">
      <template v-if="!isCollectableActive">
        <!-- <progress-timer
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
        /> -->
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
          {{ isUpcomming ? "BIDDING OPENS IN" : "AUCTION ENDS IN" }}
        </div>
        <div v-if="isAwaitingReserve && currentProgress" class="tracking-widest mb-6 text-gray-400 text-xs font-bold">
          24 HR COUNTDOWN BEGINS ONCE RESERVE IS MET
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
            {{ isAuction ? "BIDDING OPENS IN" : "DROP OPENS IN" }}
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
import ProgressTimer from "@/components/Progress/v3/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import numberHelper from "@/services/utils/numbers"
import emitter from "@/services/utils/emitter";
import { BidRegistrationService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks";
import useDarkMode from '@/hooks/useDarkMode';
import useExchangeRate from "@/hooks/useExchangeRate.js";
import useSigner from "@/hooks/useSigner";
import useMarketContractEvents from "@/hooks/useMarketContractEvents";
import {
  useSeenNFTContract,
  useV2VRFSaleContract,
  useV2OpenEditionContract,
  useV3AuctionEnderContractNetworkReactive,
  useV3SaleEnderContractNetworkReactive,
} from "@/hooks/useContract";

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
    collectableVersion: Number,
    collectableConsignmentId: Number,
    nextBidPrice: Number,
    claim: [Number, Boolean],
    requiresRegistration: Boolean,
    bidDisclaimers: [Array],
    overrideClaimLink: String,
    isReadyForClosure: Boolean,
    winningAddress: [Boolean, String],
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
    const {account, chainId} = useWeb3();

    const price = ref(props.price);
    const isAuction = ref(props.isAuction);
    const hasError = ref(null);
    const isRegisteredBidder = ref(false);
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
    const user = computed(() => store.getters['user/user']);
    const { darkMode } = useDarkMode();

    const data = reactive({
      endTime: false,
    })

    watchEffect(() => {
      console.log({'props.winningAddress': props.winningAddress})
      data.endTime = props.endsAt;
      data.winningAddress = props.winningAddress;
    })

    const form = useForm({
      initialValues: {
        bid: "",
        amount: "",
      },
    });

    const auctionField = reactive(useField("bid", (val) => fieldValidatorAuction(val)));
    const saleField = reactive(useField("amount", (val) => fieldValidatorSale(val)));
    const firstNameField = reactive(useField("first name", "required|min:3"));
    const lastNameField = reactive(useField("last name", "required|min:3"));
    const emailField = reactive(useField("email", "email"));
    const acceptTermsField = reactive(useField("terms and conditions", (val) => fieldValidatorAcceptTerms(val)));
    const acceptPhysicalTermsField = reactive(useField("physical terms and conditions", (val) => fieldValidatorAcceptPhysicalTerms(val)));
    const acceptVRFTermsField = reactive(useField("vrf terms and conditions", (val) => fieldValidatorAcceptVRFTerms(val)));

    const isFieldInvalid = computed(() => {
      return isAuction.value ? auctionField.errors.length : saleField.errors.length
    });

    function checkRegistrationStatusIfRequired() {
      let walletAddress = account.value;
      let collectableId = collectableData.value.id;
      if(props.requiresRegistration) {
        BidRegistrationService.isRegistered(walletAddress, collectableId).then(res => {
          isRegisteredBidder.value = res.data.is_registered;
        }).catch(e => {
          isRegisteredBidder.value = false;
          console.error(e);
        });
      }else{
        isRegisteredBidder.value = false;
      }
    }

    checkRegistrationStatusIfRequired()

    watch(account, () => {
      checkRegistrationStatusIfRequired()
    });

    watchEffect(async () => {
      if (account?.value && isAuction?.value && !props.isOpenEdition && !props?.isCollectableActive && collectableData?.value?.contract_address && collectableData.value.nft_token_id) {
        let nftContract = useSeenNFTContract(collectableData.value.nft_contract_address);
        let balanceOfAuctionContract = await nftContract.balanceOf(collectableData.value.contract_address, collectableData.value.nft_token_id)
        if(parseInt(balanceOfAuctionContract) > 0) {
          // NFT is still in auction contract, set auction winner as holder by proxy of auction contract
          if(collectableData.value?.winner_address?.toLowerCase() === account.value.toLowerCase()) {
            isCurrentAccountEntitledToPhysical.value = true;
          }else{
            isCurrentAccountEntitledToPhysical.value = false;
          }
        } else {
          // NFT is no longer in auction contract, check if current account is holding NFT
          let balanceOfCurrentAccount = await nftContract.balanceOf(account.value, collectableData.value.nft_token_id);
          if(parseInt(balanceOfCurrentAccount) > 0) {
            isCurrentAccountEntitledToPhysical.value = true;
          } else {
            isCurrentAccountEntitledToPhysical.value = false;
          }
        }
      } else if(account?.value && !isAuction?.value && collectableData?.value?.contract_address && collectableData.value.nft_token_id) {
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
      // else if(account?.value && props.isOpenEdition && !props?.isCollectableActive) {
      //   // Cover open edition claim scenarios, show claim button when balance is positive
      //   let openEditionSaleContract = useV2OpenEditionContract(collectableData.value.contract_address);
      //   let entitledBalanceOfCurrentAccount = await openEditionSaleContract.buyerToBuyCount(account.value);
      //   console.log({entitledBalanceOfCurrentAccount})
      //   if(parseInt(entitledBalanceOfCurrentAccount) > 0) {
      //     isCurrentAccountEntitledToDigital.value = true;
      //   } else {
      //     isCurrentAccountEntitledToDigital.value = false;
      //   }
      // }
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

    const fieldValidatorAuction = (value) => {
      if (value) {
        if (value < parseFloat(props.nextBidPrice.toString())) {
          return 'Entered sum must be 10% higher than the currently winning bid.'
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
        return 'Please accept the Terms and Conditions as well as the Privacy Policy to continue';
      }
    }

    const fieldValidatorAcceptPhysicalTerms = (value) => {
      if (value) {
        return true;
      } else {
        return 'Please accept the terms regarding physical redemptions to continue';
      }
    }

    const fieldValidatorAcceptVRFTerms = (value) => {
      if (value) {
        return true;
      } else {
        return 'Please accept the terms regarding randomised sales to continue';
      }
    }

    const priceUSDByType = computed(() => isAuction.value === 1);

    const {
      bid,
      buy,
      closeAuctionV3,
      closeSaleV3,
      requestRandomness,
      commitRandomness,
      claimTokensSaleVRF,
      initializeContractEvents,
    } = useMarketContractEvents();

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
          onBid(auctionField.value, props.collectableConsignmentId);
        } else {
          amount = parseInt(saleField.value, 10);
          if (isNaN(amount)) throw new Error("invalid number");

          // if (amount > props.items_of - props.items) {
          //   throw new Error("not enough items");
          // }
          onBuy(saleField.value, props.collectableConsignmentId);

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

    const registerToBid = async () => {
      let firstName = "";
      let lastName = "";
      let email = "";
      let collectableId = "";
      let acceptTerms = false;
      try {
        firstName = firstNameField.value;
        lastName = lastNameField.value;
        email = emailField.value;
        acceptTerms = acceptTermsField.value;
        collectableId = collectableData.value.id;

        if (!firstName || firstName.length < 3) throw new Error("first name required");
        if (!lastName || lastName.length < 3) throw new Error("last name required");
        if (!email || email.length < 3) throw new Error("email required");
        if (!acceptTerms) throw new Error("Please accept the Terms and Conditions to continue")
        if (!collectableId) throw new Error("collectable ID required");

        const msg = `First name: ${firstName}\nLast name: ${lastName}\nEmail: ${email}\nCollectable ID: ${collectableId}\nI accept Propy's terms and conditions and privacy policy.`;
        const signer = useSigner();

        if (signer) {
          const sig = await signer
            .signMessage(msg)
            .catch((e) => {
              throw new Error("Message signing failed");
          });
          BidRegistrationService.register({ collectable_id: collectableId, first_name: firstName, last_name: lastName, email: email, sig, wallet_address: account.value})
            .then(() => {
              toast.add({severity:'success', summary:'Success', detail:'Successfully registered as bidder for this auction.', life: 3000});
              checkRegistrationStatusIfRequired();
            })
            .catch(() => toast.add({severity:'error', summary:'Error', detail:'Could not submit your details. Please try to enter them later.', life: 3000}));
        }else{
          throw new Error("signer not imported");
        }
        hasError.value = null;
      } catch (e) {
        hasError.value = true;
        console.error("Error when trying to register", e);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: `${e}`,
          life: 5000
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

    const onBuy = async (event, collectableConsignmentId) => {
      try {
        const currentPrice = price.value;
        const amount = +parseInt(event, 10);
        const totalPrice = amount * currentPrice;

        isSubmitting.value = true
        await buy(amount, collectableConsignmentId)
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

    const onBid = async (event, collectableConsignmentId) => {
      try {
        const amount = +parseFloat(event, 10);
        isSubmitting.value = true
        await bid(amount, collectableConsignmentId)
            .then((response) => {
              try {
                if(response) {
                  auctionField.resetField(null)
                  showNotificationButtonRef.value = true;
                  if((user?.value?.email === false || (!user?.value?.email && account?.value)) && !localStorage.getItem(`hasDismissedNotificationModal-${account?.value}`)) {
                    openNotificationsModal(true);
                  }
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

    const updateState = function (state) {
      console.log({state})
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
      let url = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
      if(Number(chainId.value) > 0) {
        url = `https://testnets.opensea.io/assets/${nftAddress}/${nftTokenId}`;
      }
      window.open(url, '_blank').focus()
    }

    const viewOverrideClaimLink = () => {
      window.open(props.overrideClaimLink, '_blank').focus()
    }

    const closeSale = async () => {
      if(account?.value && ((Number(props.collectableConsignmentId) === 0) || (Number(props.collectableConsignmentId) > 0))) {
        await closeSaleV3(props.collectableConsignmentId)
      }
    }

    const closeAuction = async () => {
      if(account?.value && ((Number(props.collectableConsignmentId) === 0) || (Number(props.collectableConsignmentId) > 0))) {
        await closeAuctionV3(props.collectableConsignmentId);
      }
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
      firstNameField,
      lastNameField,
      emailField,
      acceptTermsField,
      acceptPhysicalTermsField,
      acceptVRFTermsField,
      tangibility,
      isFieldInvalid,
      viewOnOpenSea,
      viewOverrideClaimLink,
      hasOverrideClaimLink: props.overrideClaimLink ? true : false,
      isNumber,
      isInteger,
      claimId: props.claim?.id ? props.claim.id : null,
      isRegisteredBidder,
      registerToBid,
      isCurrentAccountEntitledToPhysical,
      isCurrentAccountEntitledToDigital,
      isCurrentAccountEntitledToDigitalClaimVRF,
      darkMode,
      nftTokenId: collectableData.value.nft_token_id,
      showNotificationButton,
      openNotificationsModal,
      closeSale,
      closeAuction,
      startRandomnessRequest,
      startRandomnessCommitment,
      startClaimVRF,
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

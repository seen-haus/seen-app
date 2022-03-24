<template>
  <div class="dark-mode-section background-square">
    <div class="container mx-auto px-6 pt-12 md:px-8">
      <div class="flex-center">
        <img class="xmons-logo" src="@/assets/images/0xmons-logo.png" alt="" />
      </div>
      <div class="flex items-center pt-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pt-1"
          color="fence-dark"
          text-align="center"
        >
          <span class="text-gradient monospace">0xmons Physical Claim</span>
        </unfenced-title>
      </div>
      <div class="flex text-center items-center pb-3 flex-col lg:flex-row">
        <light-typography
          class="text-gradient w-full text-center"
          v-if="account"
          :titleMonospace="true"
        >
          0xmons x SEEN HAUS Part 2
        </light-typography>
      </div>
    </div>

    <hero-gallery v-if="gallerySortedMedia" :slidesPerView="1" :mediaResources="gallerySortedMedia"/>

    <div class="container mx-auto px-6 py-12 md:px-8">
      <div class="text-center md:w-2/3 md:mx-auto text-gray-600 text-lg">
        <light-typography fontSize="18px">
          After successfully summoning M̷’̷ö̷r̷k̷, Maelstrom of Consternation into the physical realm, the cursed devs have once again opened the mystical wormhole to continue the invasion of the GAN monsters. 0xmons cultists hereby have the opportunity to bridge their colorful, glitchy and unique pixel monster from the ethereal, digital world to our physical one.
        </light-typography>
        <light-typography fontSize="18px">
          <br/>Claim physical collectables against your 0xmons NFT(s). This process does not involve burning or transferring your 0xmons, claims are simply based off ownership. Only one claim can be made against each 0xmons NFT.
        </light-typography>
      </div>

      <div class="pt-6" :class="{'pb-6': account}">
          <light-typography
            class="text-gradient"
            v-if="account && !shippingInfoSubmissionStatus.hasSubmitted"
            fontWeight="bold"
          >
            {{currentTimerState === "IN_PROGRESS" ? `CLAIMS CLOSE IN` : ''}}
            {{currentTimerState === "WAITING" ? `CLAIMS OPEN IN` : ''}}
            {{currentTimerState === "DONE" ? `CLAIM PERIOD COMPLETE` : ''}}
          </light-typography>
          <progress-timer
            v-if="account && (currentTimerState !== 'DONE') && !shippingInfoSubmissionStatus.hasSubmitted"
            ref="timerRef"
            class="text-3xl mt-2"
            :customColor="'#8e98a0'"
            textAlign="center"
            :isAuction="false"
            :label="null"
            :startDate="startsAt"
            :endDate="endsAt"
            @onProgress="updateProgress"
            @onTimerStateChange="updateState"
          />
      </div>

      <button
          v-if="!account"
          class="cursor-pointer button primary auto-margins flex-shrink-0"
          @click="openWalletModal"
      >
        <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
      </button>

      <template v-if="stepState.currentStepIndex === 0">

        <div v-if="!collectablesReactive.loading && account && (listOfCollectables?.length === 0)">
          <light-typography color="red">
            Your connected account does not hold any 0xmons, therefore no physical claim can be made.
          </light-typography>
        </div>

        <div v-if="collectablesReactive.loading && account">
          <unfenced-title
            class="text-black hidden lg:flex pt-1"
            color="fence-dark"
            text-align="center"
            font-size="32px"
          >
            <span class="text-gradient monospace">Loading Your 0xmons...</span>
          </unfenced-title>
          <light-typography>
            Introspecting the ethereal...
          </light-typography>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
          >
            <template
              v-for="collectable in [1,2,3,4,5,6]"
              :key="`${collectable}-collectable-placeholder`"
            >
              <div class="collectable-container auto-margins"
                :class="{'collectable-selected-for-claim': (selectionState.selectedIds.indexOf(collectable.token_id) > -1)}"
              >
                <!-- <div class="text-white">
                  <pre>{{JSON.stringify(collectable, null, 4)}}</pre>
                </div> -->
                <div 
                  class="collectable-image"
                >
                </div>
              </div>
            </template>
          </div>
        </div>

        <div v-if="!collectablesReactive.loading && account && (listOfCollectables?.length > 0)">
          <unfenced-title
            class="text-black hidden lg:flex pt-1"
            color="fence-dark"
            text-align="center"
            font-size="32px"
          >
            <span class="text-gradient monospace">Your 0xmons Collection</span>
          </unfenced-title>
          <light-typography>
            Select the 0xmons that you would like to claim
          </light-typography>
          <div
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
          >
            <template
              v-for="collectable in listOfCollectables"
              :key="collectable && collectable.id"
            >
              <div class="collectable-container auto-margins"
                :class="{'collectable-selected-for-claim': (selectionState.selectedIds.indexOf(collectable.token_id) > -1)}"
              >
                <!-- <div class="text-white">
                  <pre>{{JSON.stringify(collectable, null, 4)}}</pre>
                </div> -->
                <div 
                  class="collectable-image"
                  :class="{
                    'collectable-already-claimed': (selectionState.alreadyClaimedIds.indexOf(collectable.token_id) > -1)
                  }"
                  @click="toggleCollectableForClaim(collectable.token_id)"
                >
                  <div 
                    v-if="selectionState.alreadyClaimedIds.indexOf(collectable.token_id) > -1"
                    class="collectable-already-claimed-overlay text-white"
                  >
                    {{`Already Claimed`}}
                  </div>
                  <media-loader
                      v-if="collectable?.metadata?.image"
                      :key="collectable?.metadata?.image"
                      :src="collectable?.metadata?.image.replace('ipfs.io/ipfs/', 'seenhaus.mypinata.cloud/ipfs/')"
                      ignoreAspectRatioPadding
                      muted
                      loop
                      autoplay
                      maxWidthAndHeight
                  />
                </div>
              </div>
            </template>
          </div>
          <div class="mt-9">
            <button
              v-if="selectionState.selectedIds?.length > 0"
              class="cursor-pointer button primary auto-margins flex-shrink-0"
              @click="setStepIndex(1)"
            >
              Proceed To Review Claim
            </button>
          </div>
        </div>

      </template>

      <template v-if="stepState.currentStepIndex === 1">
        <unfenced-title
            class="text-black hidden lg:flex pt-1"
            color="fence-dark"
            text-align="center"
            font-size="32px"
          >
            <span class="text-gradient monospace">Review Claim Selection</span>
          </unfenced-title>
          <light-typography>
            {{selectionState.selectedIds.length + ` 0xmon(s) selected`}}
          </light-typography>
         <div
            class="collectable-review-container mt-2"
          >
            <template
              v-for="collectable in listOfCollectables"
              :key="collectable && collectable.id"
            >
              <div class="collectable-container-review"
                v-if="selectionState.selectedIds.indexOf(collectable.token_id) > -1"
                :class="{'collectable-selected-for-claim': (selectionState.selectedIds.indexOf(collectable.token_id) > -1)}"
              >
                <!-- <div class="text-white">
                  <pre>{{JSON.stringify(collectable, null, 4)}}</pre>
                </div> -->
                <div 
                  class="collectable-image-review"
                  :class="{
                    'collectable-already-claimed': (selectionState.alreadyClaimedIds.indexOf(collectable.token_id) > -1)
                  }"
                >
                  <div 
                    v-if="selectionState.alreadyClaimedIds.indexOf(collectable.token_id) > -1"
                    class="collectable-already-claimed-overlay text-white text-center"
                  >
                  {{`Already`}}<br/>{{`Claimed`}}
                  </div>
                  <media-loader
                      v-if="collectable?.metadata?.image"
                      :key="collectable?.metadata?.image"
                      :src="collectable?.metadata?.image.replace('ipfs.io/ipfs/', 'seenhaus.mypinata.cloud/ipfs/')"
                      ignoreAspectRatioPadding
                      muted
                      loop
                      autoplay
                      maxWidthAndHeight
                  />
                </div>
              </div>
            </template>
          </div>
          <div>
            <div class="mt-4" v-if="currentTimerState === 'IN_PROGRESS' || currentTimerState === 'WAITING'">
              <button
                v-if="selectionState.selectedIds?.length > 0"
                class="cursor-pointer button dark outline dark-mode-outline selection-button auto-margins flex-shrink-0"
                @click="setStepIndex(0)"
              >
                Adjust Selection
              </button>
            </div>
          </div>
          <div class="mt-8">
            <unfenced-title
              class="text-black hidden lg:flex pt-1"
              color="fence-dark"
              text-align="center"
              font-size="32px"
            >
              <span class="text-gradient monospace">Shipping Information</span>
            </unfenced-title>
            <!-- <div class="mt-4 mb-4">
              <light-typography color="red">
                You have not saved any shipping information yet.<br/>This claim cannot be fulfilled without any saved shipping information.
              </light-typography>
            </div> -->
            <div v-if="shippingInfoSubmissionStatus.hasSubmitted && !shippingInfoFetched.isFetched" class="mt-4">
              <light-typography color="#25c784">
                Your shipping information has been successfully submitted.
              </light-typography>
              <div class="mt-8">
                <button
                  v-if="selectionState.selectedIds?.length > 0"
                  class="cursor-pointer button dark selection-button outline dark-mode-outline auto-margins flex-shrink-0"
                  :class="{
                    'disabled opacity-0-6': shippingInfoFetched.isLoading || shippingInfoFetched.isSigning,
                  }"
                  @click="fetchAndLoadShippingInfo()"
                >
                  {{
                    shippingInfoFetched.isSigning ? 
                      'Check MetaMask...'
                        : shippingInfoFetched.isSubmitting 
                          ? 'Loading...' 
                            : 'Adjust Shipping Information'
                  }}
                </button>
              </div>
              <div class="mt-8">
                <unfenced-title
                  class="text-black hidden lg:flex pt-1"
                  color="fence-dark"
                  text-align="center"
                  font-size="32px"
                >
                  <span class="text-gradient monospace">On-Chain Claim</span>
                </unfenced-title>
                <light-typography v-if="selectionState.selectedUnclaimedCount > 0" color="#25c784" class="mt-4">
                  You have selected {{selectionState.selectedUnclaimedCount}} <span class="monospace">{{selectionState.selectedUnclaimedCount > 1 ? `0xmons` : `0xmon`}}</span> which {{selectionState.selectedUnclaimedCount > 1 ? `have` : `has`}} not yet been claimed,<br/>claiming will cost a total of {{selectionState.selectedUnclaimedCount * humanReadablePrice}} ETH (excluding gas).
                </light-typography>
                <div class="mt-4" :class="{'mb-6': account}">
                  <light-typography
                    class="text-gradient"
                    v-if="account"
                    fontWeight="bold"
                  >
                    {{currentTimerState === "IN_PROGRESS" ? `CLOSING IN` : ''}}
                    {{currentTimerState === "WAITING" ? `OPENING IN` : ''}}
                    {{currentTimerState === "DONE" ? `CLAIM PERIOD COMPLETE` : ''}}
                  </light-typography>
                  <progress-timer
                    v-if="account && (currentTimerState !== 'DONE')"
                    ref="timerRef"
                    class="text-3xl mt-2"
                    :customColor="'#8e98a0'"
                    textAlign="center"
                    :isAuction="false"
                    :label="null"
                    :startDate="startsAt"
                    :endDate="endsAt"
                    @onProgress="updateProgress"
                    @onTimerStateChange="updateState"
                  />
              </div>
                <div class="mt-4">
                  <!-- <button
                    v-if="selectionState.selectedIds?.length > 0 && !selectionState.selectedAllClaimed"
                    class="cursor-pointer button primary auto-margins selection-button flex-shrink-0"
                    :class="{
                      'disabled opacity-0-6': selectionState.claiming,
                    }"
                    @click="claimUnclaimedInSelection()"
                  >
                    {{
                      selectionState.claimCheckWallet 
                        ? 'Check MetaMask...' 
                        : selectionState.claiming 
                          ? 'Claiming...'
                          : 'Claim Selection'
                    }}
                  </button> -->
                  <button
                    v-if="selectionState.selectedIds?.length > 0"
                    class="cursor-pointer button primary auto-margins selection-button flex-shrink-0"
                    :class="{
                      'disabled opacity-0-6': selectionState.claiming || selectionState.selectedAllClaimed || currentTimerState === 'WAITING' || currentTimerState === 'DONE',
                    }"
                    @click="claimUnclaimedInSelection()"
                  >
                    {{currentTimerState === 'WAITING' ? 'Claims Not Open Yet' : null}}
                    {{currentTimerState === 'IN_PROGRESS' && selectionState.claimCheckWallet ? 'Check MetaMask...' : null}}
                    {{currentTimerState === 'IN_PROGRESS' && !selectionState.claimCheckWallet && selectionState.claiming ? 'Claiming...' : null}}
                    {{currentTimerState === 'IN_PROGRESS' && !selectionState.claiming && !selectionState.claimCheckWallet && !selectionState.selectedAllClaimed ? 'Claim Selection' : null}}
                    {{currentTimerState === 'IN_PROGRESS' && !selectionState.claiming && !selectionState.claimCheckWallet && selectionState.selectedAllClaimed ? 'Successfully Claimed' : null}}
                    {{currentTimerState === 'DONE' ? 'Claim Period Complete' : null}}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!shippingInfoSubmissionStatus.hasSubmitted || shippingInfoFetched.isFetched">
              <light-typography class="mt-2" color="#ff8200">
                Shipping information must be provided before being able to run a on-chain claims
              </light-typography>
              <ClaimAgainstTokenContractForm
                :claimContractAddress="claimContractAddress"
                :preloadData="shippingInfoFetched.data"
                :afterInfoSubmitted="afterInfoSubmitted"
              />
            </div>
          </div>
      </template>
      
    </div>
  </div>

  <div class="dark-mode-section background-square">
    <div class="container mx-auto px-6 md:px-8">
      
    </div>
  </div>
</template>

<script>
import { onUnmounted, watchEffect, watch, computed, reactive, ref } from "vue";
import { useMeta } from "vue-meta";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import ClaimAgainstTokenContractForm from '@/components/ClaimAgainstTokenContractForm';
import ProgressTimer from "@/components/Progress/v3/ProgressTimer.vue";
import HeroGallery from "@/components/Media/HeroGallery.vue";

import { ClaimsService, CollectablesService } from "@/services/apiService";

import useSigner from "@/hooks/useSigner";
import useWeb3 from "@/connectors/hooks"
import useDarkMode from "@/hooks/useDarkMode";
import useTokenCache from "@/hooks/useTokenCache";
import useClaimAgainstTokenContractWithEvents from "@/hooks/useClaimAgainstTokenContractWithEvents";
import useCollectableInformation from "@/hooks/useCollectableInformation.js";

export default {
  name: "0xmonsClaim",
  components: {
    Container,
    MediaLoader,
    UnfencedTitle,
    LightTypography,
    ClaimAgainstTokenContractForm,
    ProgressTimer,
    HeroGallery,
  },
  setup(props, ctx) {

    const timerRef = ref(null);
    const currentProgress = ref(0);
    const currentTimerState = ref(null);

    const toast = useToast();

    const store = useStore();

    const { darkMode, setDarkMode } = useDarkMode();
    const { account } = useWeb3();

    const {
      collectable,
      collectableState,
      // firstMedia,
      gallerySortedMedia,
      // Methods
      setCollectable,
    } = useCollectableInformation();

    (async function loadCollectable() {
      // state.loading = true;
      const {data} = await CollectablesService.show(`0xmons`);
      // state.loading = false;

      setCollectable(data);
    })();

    const updateProgress = function (event) {
      currentProgress.value = event;
    };

    const updateState = function (state) {
      currentTimerState.value = state;
      ctx.emit('updateState');
    }

    // const claimContractAddress = "0xd0e33b6c945207DB859DD7Ab687AC0c13965162d"; // local
    // const tokenContractAddress = "0xAA65483af897e3C80b2eCa2A73230474D145fCCb"; // local

    const claimContractAddress = "0xE21ebA28a0968281a403c1D8A6e1d1B9Af245cFf"; // mainnet
    const tokenContractAddress = "0x0427743df720801825a5c82e0582b1e915e0f750"; // mainnet

    const collection = useTokenCache(account?.value, tokenContractAddress);

    setDarkMode(true);

    const { meta } = useMeta({
      title: "0xmons Claim",
    });

    const openWalletModal = () => {
        store.dispatch('application/openModal', 'WalletModalConnectOnly')
    }

    onUnmounted(() => {
      setDarkMode(false);
    })

    const listOfCollectables = computed(
      () => collection.tokenCache.value
    );

    const collectablesReactive = reactive({
      loading: true,
    })

    const stepState = reactive({ currentStepIndex: 0 })

    const selectionState = reactive({
      selectedIds: [],
      alreadyClaimedIds: [],
      selectedAllClaimed: false,
      selectedUnclaimedCount: 0,
      claimCheckWallet: false,
      claiming: false,
      claimingTx: false,
    });

    const {
      endsAt,
      startsAt,
      humanReadablePrice,
      claimAgainstTokenIds,
      initializeContractEvents,
      mergedEvents,
    } = useClaimAgainstTokenContractWithEvents();

    watchEffect(() => {
      if(account?.value && listOfCollectables?.value) {
        let idsToCheck = listOfCollectables?.value.map(item => item.token_id);
        initializeContractEvents(claimContractAddress, account?.value, idsToCheck);
      }
    })

    const setClaimCheckWalletStatus = (status) => {
      selectionState.claimCheckWallet = status;
    }

    const claimUnclaimedInSelection = async () => {
      const unclaimedInSelection = selectionState.selectedIds.filter(selectedId => selectionState.alreadyClaimedIds.indexOf(selectedId) === -1);
      selectionState.claiming = true;
      let success;

      try {
        success = await claimAgainstTokenIds(unclaimedInSelection, setClaimCheckWalletStatus);
      } catch(e) {
        selectionState.claiming = false;
        selectionState.claimCheckWallet = false;
      }
      
      selectionState.claiming = false;
      selectionState.claimCheckWallet = false;
      if(success) {
        selectionState.selectedUnclaimedCount = 0;
      }
    }

    const setStepIndex = (stepIndex) => {
      stepState.currentStepIndex = stepIndex;
    }

    watchEffect(() => {
      if((mergedEvents && mergedEvents?.value?.length > 0) || selectionState.selectedIds || selectionState.alreadyClaimedIds) {
        selectionState.alreadyClaimedIds = [];
        let claimedIdsFromCachedEvents = mergedEvents?.value.map(event => event.token_id);
        let claimedIdsByCurrentAccount = mergedEvents?.value.filter(event => event.wallet_address.toLowerCase() === account?.value?.toLowerCase());
        for(let claimedIdFromCachedEvents of claimedIdsFromCachedEvents) {
          if(selectionState.alreadyClaimedIds.indexOf(claimedIdFromCachedEvents) === - 1) {
            selectionState.alreadyClaimedIds.push(claimedIdFromCachedEvents);
          }
          if(selectionState.selectedIds.indexOf(claimedIdFromCachedEvents) === - 1) {
            selectionState.selectedIds.push(claimedIdFromCachedEvents);
          }
        }
        let selectedUnclaimedCount = 0;
        for(let selectedId of selectionState.selectedIds) {
          if(selectionState.alreadyClaimedIds.indexOf(selectedId) === -1) {
            selectedUnclaimedCount++;
          }
        }
        if(!selectedUnclaimedCount && (selectionState.selectedIds.length > 0)) {
          selectionState.selectedAllClaimed = true;
          selectionState.selectedUnclaimedCount = 0;
          if(claimedIdsByCurrentAccount?.length > 0) {
            setStepIndex(1);
          }
        } else {
          selectionState.selectedAllClaimed = false;
          selectionState.selectedUnclaimedCount = selectedUnclaimedCount;
        }
      }
    })

    watchEffect(async () => {
      if(account?.value && collectablesReactive) {
        collection.setHolderAddress(account?.value); // account?.value
        collection.setTokenAddress(tokenContractAddress); // local node testing
        await collection.load();
        setStepIndex(0);
        selectionState.selectedIds = [];
        selectionState.alreadyClaimedIds = [];
        selectionState.claiming = false;
        selectionState.claimingTx = false;
        selectionState.selectedAllClaimed = false;
        selectionState.selectedUnclaimedCount = 0;
        collectablesReactive.loading = true;
        collectablesReactive.loading = false;
      } else if (!account?.value) {
        setStepIndex(0);
      }
    })

    const shippingInfoSubmissionStatus = reactive({
      hasSubmitted: false,
      isLoading: true,
    });

    const afterInfoSubmitted = (success = false) => {
      shippingInfoSubmissionStatus.hasSubmitted = success;
      shippingInfoFetched.data = {};
      shippingInfoFetched.isFetched = false;
    }

    const toggleCollectableForClaim = (collectableId) => {
      let indexOfCollectableInCurrentSelection = selectionState.selectedIds.indexOf(collectableId);
      if(indexOfCollectableInCurrentSelection === -1 && (selectionState.alreadyClaimedIds.indexOf(collectableId) === -1)) {
        selectionState.selectedIds.push(collectableId);
      } else if(indexOfCollectableInCurrentSelection > -1) {
        selectionState.selectedIds.splice(indexOfCollectableInCurrentSelection, 1);
      }
    }

    const shippingInfoFetched = reactive({
      isLoading: false,
      isSigning: false,
      isFetched: false,
      data: {}
    });

    watchEffect(async () => {
      if(account?.value) {
        shippingInfoSubmissionStatus.isLoading = true;
        shippingInfoSubmissionStatus.hasSubmitted = false;
        let response = await ClaimsService.claimAgainstTokenContractCheckHasSubmittedShipping(claimContractAddress, account?.value);
        shippingInfoSubmissionStatus.isLoading = false;
        if(response.data) {
          shippingInfoSubmissionStatus.hasSubmitted = true;
        }
      }
    })

    const fetchAndLoadShippingInfo = async () => {
      if(account?.value) {
        shippingInfoFetched.isSigning = true;
        const msg = `{"reason":"Fetch shipping information for wallet address","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`
        const signer = useSigner();
        if (signer) {
          const signature = await signer.signMessage(msg).catch((e) => {
            console.log({e})
            toast.add({
              severity: "error",
              summary: "Error",
              detail: "Message signing failed.",
              life: 3000,
            });
            return e;
          });
          shippingInfoFetched.isSigning = false;
          shippingInfoFetched.isLoading = true;
          let response = await ClaimsService.claimAgainstTokenContractFetchSubmittedShipping(claimContractAddress, {
            signature,
            msg
          }).catch(error => {
            if(error?.data?.message) {
              toast.add({
                severity: "error",
                summary: "Error",
                detail: error?.data?.message,
                life: 3000,
              });
            } else {
              toast.add({
                severity: "error",
                summary: "Error",
                detail: "Message signing failed.",
                life: 3000,
              });
            }
          })
          shippingInfoFetched.isLoading = false;
          if(response.data) {
            shippingInfoFetched.data = response.data;
            shippingInfoFetched.isFetched = true;
          }
        }
      }
    }

    return {
      openWalletModal,
      listOfCollectables,
      account,
      collectablesReactive,
      setStepIndex,
      stepState,
      tokenContractAddress,
      claimContractAddress,
      shippingInfoSubmissionStatus,
      fetchAndLoadShippingInfo,
      shippingInfoFetched,
      afterInfoSubmitted,
      selectionState,
      toggleCollectableForClaim,
      claimUnclaimedInSelection,
      currentTimerState,
      startsAt,
      endsAt,
      updateProgress,
      updateState,
      gallerySortedMedia,
      humanReadablePrice,
    }
  },
};
</script>

<style scoped lang="scss">

.video-container {
  @screen sm {
    padding: 25px;
  }
  @screen md {
    padding: 25px;
  }
  @screen lg {
    padding-bottom: 25px;
  }
}

.video-position {
  position: relative;
}

.heading-align {
  @screen sm {
    text-align: left;
  }
  @screen md {
    text-align: left;
  }
}

.text-gradient {
  background: -webkit-linear-gradient(0deg, #11998e 1.74%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #26c785;
}

.abstract-circles-about {
  top: 425px;
  right: 97px;
}

.abstract-circles-two {
  top: 1025px;
  left: 350px;
}

.abstract-circles-three {
  top: 2050px;
  left: 1px;
}

.shadow-container {
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
}

.xmons-logo {
  height: 75px;
}

.collectable-review-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.collectable-image-review {
  width: 125px;
  height: 125px;
  position: relative;
}

.collectable-image {
  width: 250px;
  height: 250px;
  position: relative;
}

.collectable-container {
  cursor: pointer;
  transition: all 0.2s;
  border: 5px solid #1a1a1a;
}

.collectable-container:hover {
  cursor: pointer;
  border: 5px solid #323232;
}

.collectable-container-review {
  transition: all 0.2s;
  border: 5px solid #1a1a1a;
  margin: 10px;
}

.collectable-selected-for-claim {
  border: 5px solid #26c785!important;
}

.collectable-selected-for-claim:hover {
  border: 5px solid #21e393 !important;
}

.collectable-already-claimed {
  cursor: not-allowed;
}

.collectable-already-claimed-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.selection-button {
  max-width: 350px;
  width: 100%;
}
</style>
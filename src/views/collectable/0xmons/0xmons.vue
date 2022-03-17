<template>
  <div class="dark-mode-section background-square">
    <div class="container mx-auto px-6 py-12 md:px-8">
      <div class="flex-center">
        <img class="xmons-logo" src="@/assets/images/0xmons-logo.png" alt="" />
      </div>
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pt-1"
          color="fence-dark"
          text-align="center"
        >
          <span class="text-gradient monospace">0xmons Physical Claim</span>
        </unfenced-title>
      </div>

      <div class="text-center md:w-2/3 md:mx-auto text-gray-600 text-lg pb-12">
        <light-typography fontSize="18px">
          Claim physical collectables against your 0xmons NFT(s). This process does not involve burning or transferring your 0xmons, claims are simply based off ownership. Only one claim can be made against each 0xmons NFT.
        </light-typography>
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
                    Already Claimed
                  </div>
                  <media-loader
                      v-if="collectable?.metadata?.image"
                      :key="collectable?.metadata?.image"
                      :src="collectable?.metadata?.image"
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
            class="collectable-review-container mt-9"
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
                    class="collectable-already-claimed-overlay text-white"
                  >
                    Already Claimed
                  </div>
                  <media-loader
                      v-if="collectable?.metadata?.image"
                      :key="collectable?.metadata?.image"
                      :src="collectable?.metadata?.image"
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
            <div class="mt-9">
              <button
                v-if="selectedIds?.length > 0"
                class="cursor-pointer button primary auto-margins selection-button flex-shrink-0"
                @click="claimUnclaimedInSelection()"
              >
                Claim Selection
              </button>
            </div>
            <div class="mt-4">
              <button
                v-if="selectedIds?.length > 0"
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
                  v-if="selectedIds?.length > 0"
                  class="cursor-pointer button dark outline dark-mode-outline auto-margins flex-shrink-0"
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
            </div>
            <div v-if="!shippingInfoSubmissionStatus.hasSubmitted || shippingInfoFetched.isFetched">
              <ClaimAgainstTokenContractForm
                claimContractAddress="0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
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
import { onUnmounted, watchEffect, computed, reactive } from "vue";
import { useMeta } from "vue-meta";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import ClaimAgainstTokenContractForm from '@/components/ClaimAgainstTokenContractForm';

import { ClaimsService } from "@/services/apiService";

import useSigner from "@/hooks/useSigner";
import useWeb3 from "@/connectors/hooks"
import useDarkMode from "@/hooks/useDarkMode";
import useTokenCache from "@/hooks/useTokenCache";

export default {
  name: "0xmonsClaim",
  components: {
    Container,
    MediaLoader,
    UnfencedTitle,
    LightTypography,
    ClaimAgainstTokenContractForm,
  },
  setup() {

    const toast = useToast();

    const store = useStore();

    const { darkMode, setDarkMode } = useDarkMode();
    const { account } = useWeb3();
    const collection = useTokenCache(account?.value, "0x0427743DF720801825a5c82e0582B1E915E0F750");

    const claimContractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // local
    const tokenContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local

    // const claimContractAddress = ""; // mainnet
    // const tokenContractAddress = "0x0427743df720801825a5c82e0582b1e915e0f750"; // mainnet

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
    })

    const setStepIndex = (stepIndex) => {
      stepState.currentStepIndex = stepIndex;
    }

    watchEffect(async () => {
      if(account?.value && collectablesReactive) {
        setStepIndex(0);
        selectionState.selectedIds = [];
        selectionState.alreadyClaimedIds = [];
        collectablesReactive.loading = true;
        collection.setHolderAddress(account?.value); // account?.value
        collection.setTokenAddress(tokenContractAddress); // local node testing
        await collection.load();
        console.log({collection})
        collectablesReactive.loading = false;
      } else if (!account?.value) {
        setStepIndex(0);
      }
    })

    const shippingInfoSubmissionStatus = reactive({
      hasSubmitted: false,
      isLoading: true,
    });

    const afterInfoSubmitted = () => {
      shippingInfoSubmissionStatus.hasSubmitted = true;
      shippingInfoFetched.data = {};
      shippingInfoFetched.isFetched = false;
    }

    const toggleCollectableForClaim = (collectableId) => {
      console.log({collectableId})
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
            console.log({'response.data': response.data})
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
  height: 300px;
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
  max-width: 250px;
  width: 100%;
}
</style>
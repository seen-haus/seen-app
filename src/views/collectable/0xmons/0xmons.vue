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
              :class="{'collectable-selected-for-claim': (selectedIds.indexOf(collectable.token_id) > -1)}"
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
              :class="{'collectable-selected-for-claim': (selectedIds.indexOf(collectable.token_id) > -1)}"
            >
              <!-- <div class="text-white">
                <pre>{{JSON.stringify(collectable, null, 4)}}</pre>
              </div> -->
              <div 
                class="collectable-image"
                :class="{
                  'collectable-already-claimed': (alreadyClaimedIds.indexOf(collectable.token_id) > -1)
                }"
                @click="toggleCollectableForClaim(collectable.token_id)"
              >
                <div 
                  v-if="alreadyClaimedIds.indexOf(collectable.token_id) > -1"
                  class="collectable-already-claimed-overlay text-white"
                >
                  Already Claimed
                </div>
                <media-loader
                    :key="collectable.image_preview_url"
                    v-if="collectable.image_preview_url"
                    :src="collectable.image_preview_url"
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
            v-if="selectedIds?.length > 0"
            class="cursor-pointer button primary auto-margins flex-shrink-0"
            @click="openWalletModal"
          >
            Claim Against Selected Tokens
          </button>
        </div>
      </div>
      
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
import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

import { OpenSeaAPIService } from "@/services/apiService";

import useWeb3 from "@/connectors/hooks"
import useDarkMode from "@/hooks/useDarkMode";
import useOwnedItemsOfCollection from "@/hooks/useOwnedItemsOfCollection";

export default {
  name: "0xmonsClaim",
  components: {
    Container,
    MediaLoader,
    UnfencedTitle,
    LightTypography,
  },
  methods: {
    toggleCollectableForClaim(collectableId) {
      console.log({collectableId})
      let indexOfCollectableInCurrentSelection = this.selectedIds.indexOf(collectableId);
      if(indexOfCollectableInCurrentSelection === -1 && (this.alreadyClaimedIds.indexOf(collectableId) === -1)) {
        this.selectedIds.push(collectableId);
      } else if(indexOfCollectableInCurrentSelection > -1) {
        this.selectedIds.splice(indexOfCollectableInCurrentSelection, 1);
      }
    }
  },
  data() {
    return {
      selectedIds: [],
      alreadyClaimedIds: ["248", "239"],
    }
  },
  setup() {

    const store = useStore();

    const { darkMode, setDarkMode } = useDarkMode();
    const { account } = useWeb3();
    const collection = useOwnedItemsOfCollection(account, "0xmons-xyz");

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
      () => collection.listOfCollectables.value
    );

    const collectablesReactive = reactive({
      loading: true,
    })

    watchEffect(async () => {
      if(account?.value && collectablesReactive) {
        collectablesReactive.loading = true;
        let demoAccount = "0x0c3dbcf236282ed1eca06597d8858ccfba569c47";
        collection.setAddress(demoAccount); // account?.value
        await collection.load();
        collectablesReactive.loading = false;
      }
    })

    return {
      openWalletModal,
      listOfCollectables,
      account,
      collectablesReactive,
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
</style>
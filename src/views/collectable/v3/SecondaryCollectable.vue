<template>
  <div class="loading-mask" v-if="isLoading" v-bind:style="{ backgroundImage: 'url(' + getBackgroundImage(backgroundImage) + ')' }">
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
            class="flex-grow mr-0 mb-2 self-stretch"
            color="fence-gray"
            textAlign="center"
            :closed="true"
        >Loading...
        </fenced-title>
      </div>
    </container>
  </div>

  <div class="single-edition" v-bind:style="{ backgroundImage: 'url(' + getBackgroundImage(backgroundImage) + ')' }" v-else>
    <!-- <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
            v-if="title?.length < 40"
            class="flex-grow mr-0 mb-2 self-stretch"
            color="fence-gray"
            :titleMonospace="titleMonospace"
            textAlign="center"
            :closed="true"
        >{{ title }}
        </fenced-title>
        
        <unfenced-title
          v-if="title?.length >= 40"
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          :titleMonospace="titleMonospace"
          textAlign="center"
          :closed="true"
          maxWidth="90%"
        >
          {{ title }}
        </unfenced-title>

        <div class="status flex justify-center items-center mb-5">
          <user-badge
                v-if="artist && artist.avatar"
                type="light"
                :url="artist.avatar"
                :username="pillOverride ? pillOverride : artist.name"
                :artistSlug="artist.slug"
            />
        </div>
        <div class="status flex justify-center items-center">
          <div class="tags flex flex-wrap md:flex-nowrap mr-4">
            <tag
                v-if="isAuction"
                class="bg-fence-light self-end text-gray-500 font-semibold mr-1"
                :class="darkMode ? 'dark-mode-text' : 'text-gray-500'"
            >EDITION {{ edition }}/{{ edition_of }}
            </tag>
            <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
            <tag v-if="isTangible" class="bg-black text-white"
            >PHYSICAL
            </tag>
          </div>
          <live-indicator :status="liveStatus"/>
        </div>
      </div>
    </container> -->

    <hero-gallery 
      :marginTop="'4rem'"
      :marginBottom="'4rem'"
      :backgroundColor="'#ebeef266'"
      :mediaResources="gallerySortedMedia"
    />

    <div class="container mx-auto px-6 md:px-8 transform-horizontal-center absolute">
      <div class="absolute light-mode-surface button shortened shadow-lifted transform-vertical-center">
        <user-or-artist-badge
          :creatorAccount="creatorAccount"
          :creatorUsername="creatorUsername"
          :creatorProfilePicture="creatorProfilePicture"
        />
      </div>
      <social-sharing></social-sharing>
    </div>
    <div class="abstract-circles abstract-circles-1">
      <img src="@/assets/images/abstract-circles.svg" alt="">
    </div>
    <container>
      
      <div class="flex flex-col lg:grid grid-cols-12 gap-12 py-6 pb-32 mt-12 md:mt-0">
        <div class="left-side col-span-7 pb-6">
          <div class="text-lg description" :class="darkMode ? 'dark-mode-text' : 'text-gray-500'" v-html="description"></div>
          <template v-if="showAdditionalInformation">
            <!--            <div class="rounded-container flex items-center mt-12">-->
            <!--              <i-->
            <!--                  class="fas fa-truck text-3xl icon-right text-gray-500 mr-6"-->
            <!--              ></i>-->

            <!--              <div class="text-sm font-bold">-->
            <!--                The item will be shipped from Paris, France-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="rounded-container flex items-center mt-6" :class="darkMode && 'dark-mode-surface no-border'">
              <i
                  class="fas fa-id-card text-3xl icon-right mr-6"
                  :class="darkMode ? 'dark-mode-text' : 'text-gray-500'"
              ></i>

              <div class="text-sm font-bold" :class="darkMode && 'dark-mode-text'">
                All winners will be required to submit their contact information
                for shipping purposes after the auction ends.
              </div>
            </div>

            <div class="rounded-container flex items-center mt-6" :class="darkMode && 'dark-mode-surface no-border'" v-if="!isAuction">
              <i
                  class="fas fa-trash-alt text-3xl icon-right mr-6"
                  :class="darkMode ? 'dark-mode-text' : 'text-gray-500'"
              ></i>

              <div class="text-sm font-bold" :class="darkMode && 'dark-mode-text'">
                Once your item is shipped your information will be deleted from
                our registry.
              </div>
            </div>
          </template>

          <div v-if="artist" class="text-4xl font-title font-bold mt-14 mb-6" :class="darkMode && 'dark-mode-text'">
            Artist statement
          </div>
          <artist-card v-if="artist" class="shadow-md" :artist="artist" :artistStatement="artistStatement"/>
        </div>

        <div class="right-side col-span-5 mt-15">
          <bid-card
            :status="liveStatus"
            :collectable="collectable"
            :collectableVersion="collectable.version"
            :collectableConsignmentId="collectable.consignment_id"
            :startsAt="currentStartsAt"
            :minimumStartsAt="currentMinimumStartsAt"
            :endsAt="currentEndsAt"
            :isAuction="isAuction"
            :numberOfBids="events.length"
            :isOpenEdition="isOpenEdition"
            :itemsBought="itemsBought"
            :edition="edition"
            :edition_of="edition_of"
            :items="items"
            :items_of="itemsOf"
            :price="price"
            :priceUSD="priceUSD"
            :progress="progress"
            :is_sold_out="is_sold_out"
            :is_closed="is_closed"
            :isCollectableActive="isCollectableActive"
            :isUpcomming="isUpcomming"
            :nextBidPrice="nextBidPrice"
            :claim="claim"
            :isReadyForClosure="isReadyForClosure"
            :winningAddress="winningAddress"
            @update-state="updateCollectableState"
          />

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12" :class="darkMode && 'dark-mode-text'">
            {{ isAuction ? "Recent bids" : "Recent buys" }}
          </div>
          <list-of-buyers class="mb-12" :list="events" :isAuction="isAuction"/>

          <template v-if="isAuction">
            <button class="button dark w-full" :class="darkMode && 'dark-mode-outline'" @click="openModal('video', 'https://www.youtube.com/watch?v=1G5caDyf-kA')">
              <i
                  class="fas fa-play-circle mr-2 text-xl icon-left text-white"
              ></i>
              Learn How To Buy
            </button>

            <div class="text-sm text-gray-400 text-center mt-2">
              Explanation video will appear in a pop-up
            </div>
          </template>

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12" :class="darkMode && 'dark-mode-text'">
            Proof of Authenticity
          </div>

          <div class="rounded-container" :class="darkMode ? 'dark-mode-background' : 'light-mode-surface'">

            <nft-data v-if="collectable" :collectable="collectable"></nft-data>

            <button class="button w-full" :class="darkMode ? 'dark dark-mode-outline' : 'outline'" @click="viewOnEtherscan">
              View on Etherscan
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right"
                  :class="darkMode ? 'dark-mode-text' : 'text-gray-500'"
              ></i>
            </button>
            <!--            <button class="button outline w-full mt-6">-->
            <!--              View on IPFS-->
            <!--              <i-->
            <!--                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"-->
            <!--              ></i>-->
            <!--            </button>-->
            <button :class="darkMode ? 'dark dark-mode-outline' : 'outline'" class="button w-full mt-6" @click="viewOnOpenSea">
              View on OpenSea
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right"
                  :class="darkMode ? 'dark-mode-text' : 'text-gray-500'"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </container>
  </div>
</template>


<script>
import {computed, onBeforeUnmount, reactive, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useMeta} from "vue-meta";
import {useStore} from "vuex";

import FencedTitle from "@/components/FencedTitle.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import Container from "@/components/Container.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import BidCard from "@/components/BidCard.vue";
import ListOfBuyers from "@/components/Lists/ListOfBuyers.vue";
import HeroGallery from "@/components/Media/HeroGallery.vue";
import {CollectablesService} from "@/services/apiService";
import {useToast} from "primevue/usetoast";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";
import {getEtherscanLink, mergePrimaryCollectableIntoSecondary} from "@/services/utils";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';
import NftData from "@/views/collectable/components/NftData.vue";
import SocialSharing from "@/components/SocialSharing";

import useWeb3 from "@/connectors/hooks";

export default {
  name: "Collectable",
  components: {
    SocialSharing,
    FencedTitle,
    Container,
    UserBadge,
    UserOrArtistBadge,
    Tag,
    LiveIndicator,
    ArtistCard,
    BidCard,
    ListOfBuyers,
    HeroGallery,
    NftData,
    UnfencedTitle,
  },
  methods: {
    getBackgroundImage(backgroundImage) {
      if(backgroundImage) {
        return require('../../../assets/images/' + backgroundImage)
      }
    }
  },
  setup() {
    const toast = useToast();
    const route = useRoute();
    const state = reactive({
      loading: true,
      contractAddress: null,
      collectable: {},
      buyersVisible: 3,
    });
    const store = useStore();
    const { chainId } = useWeb3();

    const darkMode = computed(() => {
      return store.getters['application/darkMode']
    });

    const {
      collectable,
      collectableState,
      price,
      priceUSD,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isUpcomming,
      isOpenEdition,
      itemsBought,
      // Static
      type,
      media,
      // firstMedia,
      gallerySortedMedia,
      artist,
      artistStatement,
      title,
      description,
      events,
      startsAt,
      minimumStartsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      version,
      nextBidPrice,
      isReadyForClosure,
      isClosed,
      isCancelled,
      winningAddress,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      // Methods
      updateProgress,
      setCollectable,
      updateCollectableState,
      claim,
      pillOverride,
    } = useCollectableInformation();

    const backgroundImage = ref(false);
    const titleMonospace = ref(false);

    // TODO: Make this into a DB datasource unless V3 no longer uses this
    if(['0xmons-mork'].indexOf(route.params["slug"]) > -1) {
      store.dispatch("application/setDarkMode", true);
      switch(route.params["slug"]) {
        case '0xmons-mork':
          backgroundImage.value = '0xmons-tile.png';
          titleMonospace.value = true;
          break;
      }
    } else {
      // Disable dark mode until dark mode is supported across website
      store.dispatch("application/setDarkMode", false);
    }

    const currentEndsAt = computed(() => {
      return new Date(endsAt.value).getTime();
    });

    const currentStartsAt = computed(() => {
      return startsAt.value;
    });

    const currentMinimumStartsAt = computed(() => {
      return minimumStartsAt.value;
    });

    const keywords = computed(() => {
      let words = ["collectable", "drop", "seen", "seen.haus"];
      if (isTangible) words.push("tangible");
      if (isNft) words.push("nft");
      if (isAuction) words.push("auction");
      else words.push("sale");

      return words.join(" ");
    });
    const {meta} = useMeta({
      title: title.value || "Loading...",
      meta: [
        {
          name: "keywords",
          content: "",
        },
        {
          name: "description",
          content: "",
        }
      ],
    });

    const isLoading = computed(() => state.loading);

    const showAdditionalInformation = computed(
        () => type.value === "tangible" || type.value === "tangible_nft"
    );

    const updateMeta = () => {
      meta.title = title.value || "Collectable";
      meta.meta[0].content = keywords.value;
      meta.meta[1].content = description.value.replace(
          /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g,
          ""
      ).replace(/&nbsp;/g, ' ');
    };

    const viewOnEtherscan = () => {
      const address = state.collectable.contract_address;
      let url = getEtherscanLink(1, address, "address");
      window.open(url, '_blank').focus()
    }
    const viewOnOpenSea = () => {
      let nftAddress = collectable.value.nft_contract_address
      let nftTokenId = collectable.value.nft_token_id
      console.log({nftTokenId})
      let url = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
      console.log({chainId: chainId.value})
      if(Number(chainId.value) !== 1) {
        url = `https://testnets.opensea.io/assets/${nftAddress}/${nftTokenId}`;
      }
      window.open(url, '_blank').focus()
    }

    (async function loadCollectable() {
      state.loading = true;
      const slug = route.params["slug"];
      const {data} = await CollectablesService.showSecondary(slug);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      console.log({data})
      state.loading = false;
      state.collectable = data.collectable;
      state.contractAddress = data.contract_address;

      let mergedSecondaryWithPrimary = mergePrimaryCollectableIntoSecondary(data.collectable, data);

      console.log({mergedSecondaryWithPrimary})

      setCollectable(mergedSecondaryWithPrimary);
      updateMeta();
    })();

    const openModal = (type, url) => {
      const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
      });
      if (type === 'video' || type.includes("mp4") || type.includes("video")) {
        lightbox.setElements([{
          'href': url,
          'type': 'video',
          'source': 'youtube', //vimeo, youtube or local
        }])
      } else {
        lightbox.setElements([{
          'href': url,
          'type': 'image', //vimeo, youtube or local
        }]);
      }
      lightbox.open();
    };



    return {
      isLoading,
      collectable,
      collectableState,
      price,
      priceUSD,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isUpcomming,
      // Static
      type,
      media,
      gallerySortedMedia,
      // firstMedia,
      artist,
      artistStatement,
      title,
      description,
      events,
      currentStartsAt,
      currentEndsAt,
      endsAt,
      currentMinimumStartsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      nextBidPrice,
      isOpenEdition,
      itemsBought,
      backgroundImage,
      darkMode,
      titleMonospace,
      isReadyForClosure,
      isClosed,
      isCancelled,
      winningAddress,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      // Methods
      updateProgress,
      viewOnEtherscan,
      viewOnOpenSea,
      openModal,
      showAdditionalInformation,
      updateCollectableState,
      claim,
      pillOverride,
    };
  },
};
</script>


<style lang="scss">
.abstract-circles-1 {
  right: 8%;
  margin-top: 200px;
}
.description {
  p {
    margin-bottom: 1rem;
  }
}
</style>

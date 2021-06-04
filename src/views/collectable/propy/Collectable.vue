<template>
  <div class="loading-mask" v-if="isLoading">
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

  <div class="single-edition" v-else>
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
            class="flex-grow mr-0 mb-2 self-stretch"
            color="fence-gray"
            textAlign="center"
            :closed="true"
        >{{ title }}
        </fenced-title>

        <div class="status flex justify-center items-center mb-5">
          <user-badge
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
            >EDITION {{ edition }}/{{ edition_of }}
            </tag>
            <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
            <tag v-if="isTangible" class="bg-black text-white"
            >TANGIBLE
            </tag>
          </div>
          <live-indicator :status="liveStatus"/>
        </div>
      </div>
    </container>

    <hero-gallery :mediaResources="gallerySortedMedia"/>

    <container>
      <div class="flex flex-col lg:grid grid-cols-12 gap-12 py-6 pb-32 mt-12 md:mt-0">
        <div class="left-side col-span-7 pb-6">

          <span class="title-text font-title text-4xl font-bold">Tokenized Real Estate</span>

          <div class="text-lg text-gray-500 description" v-html="description"></div>

          <div class="gap-12 py-6">
            <product-video :src="video"></product-video>
          </div>
          <div class="gap-12 py-6">
            <highlights v-if="highlights" :highlights="highlights"></highlights>
          </div>

          <faq v-if="faq" :faq="faq"/>


          <contact-agent class="shadow-md" artist-name="Propy" :socials="contactAgent"/>

          <div class="text-4xl font-title font-bold mt-14 mb-6">
            Artist statement
          </div>
          <artist-card class="shadow-md" :artist="artist" :artistStatement="artistStatement"/>
        </div>

        <div class="right-side col-span-5">
          <bid-card
              :collectable="collectable"
              :startsAt="startsAt"
              :endsAt="currentEndsAt"
              :isAuction="isAuction"
              :numberOfBids="events.length"
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
              @update-state="updateCollectableState"
          />

          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            {{ isAuction ? "Recent bids" : "Recent buys" }}
          </div>
          <list-of-buyers v-if="collectable.nft_contract_address && collectable.nft_token_id" :list="events"/>

          <template v-if="isAuction">
            <button class="button dark w-full mt-12" @click="openModal('video', 'https://www.youtube.com/watch?v=1G5caDyf-kA')">
              <i
                  class="fas fa-play-circle mr-2 text-xl icon-left text-white"
              ></i>
              Learn How To Buy
            </button>

            <div class="text-sm text-gray-400 text-center mt-2">
              Explanation video will appear in a pop-up
            </div>
          </template>

          <template v-if="showAdditionalInformation">
            <!--            <div class="rounded-container flex items-center mt-12">-->
            <!--              <i-->
            <!--                  class="fas fa-truck text-3xl icon-right text-gray-500 mr-6"-->
            <!--              ></i>-->

            <!--              <div class="text-sm font-bold">-->
            <!--                The item will be shipped from Paris, France-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="rounded-container flex items-center mt-6">
              <i
                  class="fas fa-id-card text-3xl icon-right text-gray-500 mr-6"
              ></i>

              <div class="text-sm font-bold">
                All winners will be required to submit their KYC information
                for settlement purposes after the auction ends.
              </div>
            </div>

            <div class="rounded-container flex items-center mt-6" v-if="!isAuction">
              <i
                  class="fas fa-trash-alt text-3xl icon-right text-gray-500 mr-6"
              ></i>

              <div class="text-sm font-bold">
                Once your item is shipped your information will be deleted from
                our registry.
              </div>
            </div>


          </template>


          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Proof of Authenticity
          </div>

          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="rounded-container">
            <button class="button outline w-full" @click="viewOnEtherscan">
              View on Etherscan
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <!--            <button class="button outline w-full mt-6">-->
            <!--              View on IPFS-->
            <!--              <i-->
            <!--                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"-->
            <!--              ></i>-->
            <!--            </button>-->
            <button class="button outline w-full mt-6" @click="viewOnOpenSea">
              View on OpenSea
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
          </div>

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            <GMapMap :center="{lat: 51.093048, lng: 6.842120}" :zoom="16" map-type-id="roadmap" style="height: 400px"></GMapMap>
          </div>

          <div v-if="partnersPress" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            <partners-and-press :partners="partnersPress"></partners-and-press>
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

import FencedTitle from "@/components/FencedTitle.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import Container from "@/components/Container.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import BidCard from "@/components/BidCard.vue";
import ListOfBuyers from "@/components/Lists/ListOfBuyers.vue";
import HeroGallery from "@/components/Media/HeroGallery.vue";
import {CollectablesService} from "@/services/apiService";
import {useToast} from "primevue/usetoast";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import Highlights from "@/views/collectable/components/Highlights.vue";
import ProductVideo from "@/views/collectable/components/ProductVideo.vue";
import ContactAgent from "@/views/collectable/components/ContactAgent.vue";
import Faq from "@/views/collectable/components/FAQ.vue";
import PartnersAndPress from "@/views/collectable/components/PartnersAndPress.vue";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";
import useContractEvents from "@/hooks/useContractEvents";
import {getEtherscanLink} from "@/services/utils";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

export default {
  name: "Collectable",
  components: {
    FencedTitle,
    Container,
    UserBadge,
    Tag,
    LiveIndicator,
    ArtistCard,
    BidCard,
    ListOfBuyers,
    HeroGallery,
    MediaLoader,
    Highlights,
    ProductVideo,
    ContactAgent,
    Faq,
    PartnersAndPress
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
    const faq = [
            {question: "Q1", answer: "Answer"},
            {question: "Q2", answer: "Answer"},
            {question: "Q3", answer: "Answer"}
            ];
    const highlights = [
            {icon: "fas fa-bath", text: "Highlight 1"},
            {icon: "fas fa-bed", text: "Highlight 2"},
            {icon: "fas fa-tv", text: "Highlight 3"},
            {icon: "fas fa-blender", text: "Highlight 4"},
            {icon: "fas fa-coffee", text: "Highlight 5"},
            {icon: "fas fa-couch", text: "Highlight 6"},
            {icon: "fas fa-fan", text: "Highlight 7"},
            {icon: "fas fa-faucet", text: "Highlight 8"},
            {icon: "fas fa-lightbulb", text: "Highlight 9"},
            {text: "Highlight 10"},
            ];
    const video = "https://www.youtube.com/embed/1G5caDyf-kA";
    const contactAgent = [
            {type: 'website', url: 'https://example.com/'},
            {type: 'telegram', url: 'https://example.com/'},
            {type: 'twitter', url: 'https://example.com/'},
            {type: 'discord', url: 'https://example.com/'},
            ];
    const partnersPress = [
        {image: require("@/assets/images/team/Jigglybuff69.jpg"), url: 'https://example.com/'},
        {image: require("@/assets/images/team/Buddyart00.jpg"), url: 'https://example.com/'},
        {image: require("@/assets/images/team/Jiigsaw01.jpg"), url: 'https://example.com/'},
      ];


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
      // Methods
      updateProgress,
      setCollectable,
      updateCollectableState,
      claim,
      pillOverride,
    } = useCollectableInformation();

    const currentEndsAt = computed(() => {
      return endsAt.value;
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
        },
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
      );
    };

    const viewOnEtherscan = () => {
      const address = state.collectable.contract_address;
      let url = getEtherscanLink(1, address, "address");
      window.open(url, '_blank').focus()
    }
    const viewOnOpenSea = () => {
      let nftAddress = collectable.value.nft_contract_address
      let nftTokenId = collectable.value.nft_token_id
      let url = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
      window.open(url, '_blank').focus()
    }

    (async function loadCollectable() {
      state.loading = true;
      const slug = 'first-real-estate-nft';
      const {data} = await CollectablesService.show(slug);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      state.loading = false;
      state.collectable = data;
      state.contractAddress = data.contract_address;

      setCollectable(data);
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

    (async function setBackgroundImage(){
      artist.background_image = '@/assets/images/artist-background-placeholder.jpg';
    })();

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
      startsAt,
      currentEndsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      nextBidPrice,
      // Methods
      updateProgress,
      viewOnEtherscan,
      viewOnOpenSea,
      openModal,
      showAdditionalInformation,
      updateCollectableState,
      claim,
      pillOverride,
      faq,
      highlights,
      video,
      contactAgent,
      partnersPress
    };
  },
};
</script>


<style lang="scss">
.description {
  p {
    margin-bottom: 1rem;
  }
}
</style>

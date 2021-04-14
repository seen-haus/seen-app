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

        <div class="status flex justify-center items-center">
          <user-badge
              type="light"
              :url="artist.avatar"
              :username="artist.name"
              :artistSlug="artist.slug"
          />
          <div class="tags flex flex-wrap md:flex-nowrap mx-9">
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
          <div class="text-lg text-gray-500 description" v-html="description"></div>
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
                All winners will be required to submit their contact information
                for shipping purposes after the auction ends.
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
              :isCollectableActive="isCollectableActive"
              :isUpcomming="isUpcomming"
              :nextBidPrice="nextBidPrice"
          />

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            {{ isAuction ? "Recent bids" : "Recent buys" }}
          </div>
          <list-of-buyers class="mb-12" :list="events"/>

          <template v-if="isAuction">
            <button class="button dark w-full" @click="openModal('video', 'https://www.youtube.com/watch?v=1G5caDyf-kA')">
              <i
                  class="fas fa-play-circle mr-2 text-xl icon-left text-white"
              ></i>
              Learn How To Buy
            </button>

            <div class="text-sm text-gray-400 text-center mt-2">
              Explanation video will appear in a pop-up
            </div>
          </template>

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Proof of Authenticity
          </div>

          <div class="rounded-container">
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
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      version,
      lastBid,
      nextBidPrice,
      // Methods
      updateProgress,
      setCollectable,
      // updateInformation,
      // updateCollectableState,
    } = useCollectableInformation();

    const currentEndsAt = computed(() => {
      if (isAuction.value) {
        const extension = 5 * 60 * 1000;
        const orig = new Date(endsAt.value).getTime();
        if (!lastBid.value) {
          return endsAt.value;
        }
        const bid = new Date(lastBid.value.time).getTime();
        if ((orig - bid) < extension) {
          return new Date(bid + extension);
        }
      }

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
      window.location = getEtherscanLink(1, route.params["contractAddress"], "address");
    }
    const viewOnOpenSea = () => {
      let nftAddress = collectable.value.nft_contract_address
      let nftTokenId = collectable.value.nft_token_id
      window.location = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
    }

    (async function loadCollectable() {
      state.loading = true;
      const contractAddress =
          route.params["contractAddress"] ||
          "0xeFb2de8e3464b5F33840d12d7f0259831bb381A7";
      const {data} = await CollectablesService.show(contractAddress);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      state.loading = false;
      state.contractAddress = contractAddress;
      state.collectable = data;

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
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      lastBid,
      nextBidPrice,
      // Methods
      updateProgress,
      viewOnEtherscan,
      viewOnOpenSea,
      openModal,
      showAdditionalInformation,
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

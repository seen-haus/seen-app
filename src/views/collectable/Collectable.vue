<template>
  <div class="loading-mask" v-if="isLoading">
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Loading...</fenced-title
        >
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
          >{{ title }}</fenced-title
        >

        <div class="status flex justify-center items-center">
          <user-badge
            type="light"
            :url="artist.avatar"
            :username="artist.name"
          />
          <div class="tags flex mx-9">
            <tag
              v-if="isAuction"
              class="bg-fence-light self-end text-gray-500 font-semibold mr-1"
              >EDITION {{ edition }}/{{ edition_of }}</tag
            >
            <tag v-if="isNft" class="bg-tag-nft mr-1 text-white">NFT</tag>
            <tag v-if="isTangible" class="bg-tag-tangible text-white"
              >TANGIBLE</tag
            >
          </div>
          <live-indicator :status="liveStatus" />
        </div>
      </div>
    </container>

    <hero-gallery :mediaResources="media" />

    <container>
      <div class="flex flex-col lg:grid grid-cols-12 gap-12 py-6">
        <div class="left-side col-span-7 py-6">
          <fenced-title
            class="text-black flex lg:hidden mt-6"
            color="fence-dark"
            text-align="center"
            :closed="true"
            ><span class="flex-shrink-0">{{ title }}</span></fenced-title
          >

          <fenced-title
            class="text-black hidden lg:flex"
            color="fence-dark"
            text-align="left"
            :closed="true"
            ><span class="flex-shrink-0">{{ title }}</span></fenced-title
          >

          <div class="text-lg text-gray-500 mt-6" v-html="description"></div>

          <template v-if="showAdditionalInformation">
            <div class="rounded-container flex items-center mt-12">
              <i
                class="fas fa-truck text-3xl icon-right text-gray-500 mr-6"
              ></i>

              <div class="text-sm font-bold">
                The item will be shipped from Paris, France
              </div>
            </div>

            <div class="rounded-container flex items-center mt-6">
              <i
                class="fas fa-id-card text-3xl icon-right text-gray-500 mr-6"
              ></i>

              <div class="text-sm font-bold">
                All winners will be required to submit their contact information
                for shipping purposes after the auction ends.
              </div>
            </div>

            <div class="rounded-container flex items-center mt-6">
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
          <artist-card class="shadow-md" :artist="artist" />

          <template v-if="showAdditionalInformation">
            <div class="text-4xl font-title font-bold mt-14 mb-6">
              Additional Information
            </div>

            <div class="rounded-container mb-6">
              <div class="text-3xl font-title font-bold mb-4">
                Tangible + Digital
              </div>

              <div class="text-gray-500">
                Auction winners will receive both a physical version of the
                artwork as well as a digital representation in the form of an
                NFT.
              </div>
            </div>

            <div class="rounded-container mb-6">
              <div class="text-3xl font-title font-bold mb-4">Sale</div>

              <div class="text-gray-500">
                After the auction ends an NFT will be sent to the winners
                address immediately. It can be kept on seen.haus or transferred
                to an NFT marketplace.
              </div>
            </div>

            <div class="rounded-container mb-6">
              <div class="text-3xl font-title font-bold mb-4">
                Shipping & Handling
              </div>

              <div class="text-gray-500">
                All physical items are eligible for worldwide, expedited and
                insured shipping. Details will be coordinated with the winner
                after the auction ends.
              </div>
            </div>
          </template>
        </div>

        <div class="right-side col-span-5">
          <bid-card
            :startsAt="startsAt"
            :endsAt="endsAt"
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
          />

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Recent Buyers
          </div>
          <list-of-buyers class="mb-12" :list="events" />

          <template v-if="isAuction">
            <button class="button dark w-full">
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
            <button class="button outline w-full">
              View on Etherscan
              <i
                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <button class="button outline w-full mt-6">
              View on IPFS
              <i
                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <button class="button outline w-full mt-6">
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
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";

import FencedTitle from "@/components/FencedTitle.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import Container from "@/components/Container.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import BidCard from "@/components/BidCard.vue";
import ListOfBuyers from "@/components/Lists/ListOfBuyers.vue";
import HeroGallery from "@/components/Media/HeroGallery.vue";
import { CollectablesService } from "@/services/apiService";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";

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
    const route = useRoute();
    const state = reactive({
      loading: true,
      contractAddress: null,
      collectable: {},
      buyersVisible: 3,
    });

    const {
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
      artist,
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
      // Methods
      updateProgress,
      setCollectable,
      // updateInformation,
      // updateCollectableState,
    } = useCollectableInformation();

    const isLoading = computed(() => state.loading);

    const showAdditionalInformation = computed(
      () => type.value === "tangible" || type.value === "tangible_nft"
    );

    (async function loadCollectable() {
      state.loading = true;
      const contractAddress =
        route.params["contractAddress"] ||
        "0xeFb2de8e3464b5F33840d12d7f0259831bb381A7";
      const { data } = await CollectablesService.show(contractAddress);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      state.loading = false;
      state.contractAddress = contractAddress;
      state.collectable = data;

      setCollectable(data);
    })();

    return {
      isLoading,

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
      artist,
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
      // Methods
      updateProgress,
      showAdditionalInformation,
    };
  },
};
</script>
<template>
  <div>
    <container class="section-featured-auctions pb-24">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Auctions
        </fenced-title>
      </div>

      <div class="flex justify-start items-center">
        <toggle
          :value="filterNft"
          class="text-tag-nft mr-8"
          @onChange="handleNftToggle($event)"
        >
          <span class="font-bold ml-1 text-black">NFT</span>
        </toggle>

        <toggle
          :value="filterTangibleNft"
          class="text-tag-tangible"
          @onChange="handleTangibleToggle($event)"
        >
          <span class="font-bold ml-1 text-black">NFT + Tangible</span>
        </toggle>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-5"
      >
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.contract_address)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '120%' }"
          ></div>
        </template>
      </div>

      <button
        class="button dark mt-20 mx-auto w-full md:w-96"
        v-if="hasMore"
        @click="handleLoadMore"
      >
        Load More
      </button>
    </container>

    <div class="learn-how-to bg-background-gray border-t border-b">
      <container class="py-24 pb-56 mb-8">
        <fenced-title
          class="flex-grow mr-0 mb-8 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Learn how to bid in
          <span class="text-primary italic">50 seconds</span></fenced-title
        >

        <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
          Seen.haus is an innovative auction house of the future merging the
          physical and digital worlds of art
        </div>

        <how-to-video class="my-12"></how-to-video>

        <div class="flex justify-center">
          <button class="button dark mr-4">Read FAQs</button>
          <button class="button outline">Meet the team</button>
        </div>
      </container>
    </div>

    <div class="quotes">
      <container class="flex justify-center">
        <quote-carousel class="centered-quote" />
      </container>
    </div>

    <container class="meet-artists -mt-12 pb-32">
      <fenced-title
        class="flex-grow mr-0 mb-8 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Meet artists
      </fenced-title>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="artist in listOfArtists"
          :key="artist && artist.id"
        >
          <artist-card v-if="artist != null" :artist=artist />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>

      <router-link to="artists">
        <button class="button dark mt-20 mx-auto w-full md:w-96" >
          View All Artists
        </button>
      </router-link>
    </container>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";

import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import Toggle from "@/components/Inputs/Toggle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";

import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import useCollectablesWithPagination from "@/hooks/useCollectablesWithPagination.js";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Auctions",
  components: {
    Container,
    FencedTitle,
    ProductCard,
    Toggle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      filterNft: true,
      filterTangibleNft: true,
    });

    const filterNft = computed(() => state.filterNft);
    const filterTangibleNft = computed(() => state.filterTangibleNft);

    const paginatedCollectables = useCollectablesWithPagination(
      PURCHASE_TYPE.AUCTION
    );
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const hasMore = computed(() => paginatedCollectables.hasMore.value);

    paginatedCollectables.load();

    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };

    const handleNftToggle = function (event) {
      state.filterNft = event;
      paginatedCollectables.filter(state.filterNft, state.filterTangibleNft);
    };

    const handleTangibleToggle = function (event) {
      state.filterTangibleNft = event;
      paginatedCollectables.filter(state.filterNft, state.filterTangibleNft);
    };

    const navigateToCollectable = function (address) {
      router.push({
        name: "collectableAuction",
        params: { contractAddress: address },
      });
    };

    const paginatedArtists = useArtistsWithPagination();
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);

    paginatedArtists.load();

    return {
      filterNft,
      filterTangibleNft,
      listOfCollectables,
      listOfArtists,
      hasMore,
      // Methods
      handleNftToggle,
      handleTangibleToggle,
      handleLoadMore,
      navigateToCollectable,
    };
  },
};
</script>

<style scoped>
</style>

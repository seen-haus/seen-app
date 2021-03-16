<template>
  <div>
    <hero-auction
      v-if="heroCollectable != null"
      :collectable="heroCollectable"
    />
    <div
      v-else
      class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
      :style="{ 'padding-bottom': '40%' }"
    ></div>

    <container class="section-featured-auctions pb-24">
      <div class="flex items-center py-24 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 lg:hidden self-stretch"
          color="fence-light"
          textAlign="center"
          :closed="false"
          >Featured Auctions</fenced-title
        >
        <fenced-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="false"
          >Featured Auctions</fenced-title
        >
        <button class="button dark flex-shrink-0">
          View All Auctions <i class="fas fa-arrow-right ml-3 icon-right"></i>
        </button>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 md:grid-cols-2 mb-22 gap-10"
      >
        <template
          v-for="collectable in featuredCollectables"
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
        <!-- <product-card />
        <product-card /> -->
      </div>

      <div
        class="auction-list-big grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <template
          v-for="collectable in otherCollectables"
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
        <!-- <product-card />
        <product-card />
        <product-card /> -->
      </div>

      <button class="button dark mt-20 mx-auto w-full md:w-96">
        View All Auctions
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
        <quote class="centered-quote" />
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
        <button class="button dark mt-20 mx-auto w-full md:w-96">
          View All Artists
        </button>
      </router-link>
    </container>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";

import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import Quote from "@/components/Quote.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import HeroAuction from "./components/HeroAuction.vue";
import HowToVideo from "@/components/HowToVideo.vue";

import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import useCollectablesWithPagination from "@/hooks/useCollectablesWithPagination.js";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Home",
  components: {
    HeroAuction,
    Container,
    FencedTitle,
    ProductCard,
    HowToVideo,
    Quote,
    ArtistCard,
  },
  setup() {
    const router = useRouter();

    const paginatedCollectables = useCollectablesWithPagination(
      PURCHASE_TYPE.SALE
    );
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );

    const heroCollectable = computed(() => listOfCollectables.value[0]);
    const featuredCollectables = computed(() =>
      [listOfCollectables.value[1], listOfCollectables.value[2]].filter(
        (i) => i !== undefined
      )
    );
    const otherCollectables = computed(() =>
      [
        listOfCollectables.value[3],
        listOfCollectables.value[4],
        listOfCollectables.value[5],
      ].filter((i) => i !== undefined)
    );

    paginatedCollectables.load();

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
      heroCollectable,
      featuredCollectables,
      otherCollectables,
      listOfArtists,
      navigateToCollectable,
    };
  },
};
</script>

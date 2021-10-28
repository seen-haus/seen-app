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

    <container class="section-featured-auctions pt-20 lg:pt-24">
      <img @click="navigateToCollection('halloween-2021')" style="background-color: #010101;" src="@/assets/images/halloween-2021.jpg" class="cursor-pointer p-6 lg:p-12 rounded-3xl" alt="SEEN">
    </container>

    <container class="section-featured-auctions pb-24">
      <div class="flex items-center pb-12 pt-20 lg:py-24 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 md:mb-6 lg:mb-0 lg:mr-6 lg:hidden self-stretch"
          color="fence-light"
          textAlign="center"
          :closed="false"
          > Featured Drops</fenced-title
        >
        <fenced-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="false"
          > Featured Drops</fenced-title
        >
        <router-link to="drops" class="hidden lg:block">
          <button :class="darkMode ? 'light' : 'dark'" class="button flex-shrink-0">
            View All Drops <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>
        </router-link>
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
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route)"
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
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route)"
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

      <router-link to="drops">
        <button :class="darkMode ? 'light' : 'dark'" class="button mt-20 mx-auto w-full md:w-96">
          View All Drops
        </button>
      </router-link>
    </container>

    <div :class="darkMode ? 'dark-mode-background' : 'bg-background-gray'" class="learn-how-to border-t border-b">
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
          <button :class="darkMode ? 'light' : 'dark'" class="button" @click="$router.push({name: 'faq'})">Read FAQs</button>
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
        >Creators
      </fenced-title>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template v-for="artist in listOfArtists" :key="artist && artist.id">
          <artist-card v-if="artist != null" :artist="artist" />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>

      <router-link to="creators">
        <button :class="darkMode ? 'light' : 'dark'" class="button mt-20 mx-auto w-full md:w-96">
          View All Creators
        </button>
      </router-link>
    </container>
  </div>
</template>

<script>
import {computed, watchEffect} from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import { useStore } from "vuex";

import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import HeroAuction from "./components/HeroAuction.vue";
import HowToVideo from "@/components/HowToVideo.vue";

import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import useCollectablesWithPagination from "@/hooks/useCollectablesWithPagination.js";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";
import useWeb3 from "@/connectors/hooks";
import {Web3Provider} from "@ethersproject/providers";
import {formatEther} from "@ethersproject/units";
import {useTokenContract} from "@/hooks/useContract";

export default {
  name: "Home",
  components: {
    HeroAuction,
    Container,
    FencedTitle,
    ProductCard,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
  },
  setup() {
    const { meta } = useMeta({
      title: "Home",
    });
    const router = useRouter();
    const store = useStore();

    // Disable dark mode until dark mode is supported across website
    store.dispatch("application/setDarkMode", false);

    const darkMode = computed(() => store.getters['application/darkMode']);

    const paginatedCollectables = useCollectablesWithPagination( 0);
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );

    const listOfNonHeroCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value.filter(item =>  item && !item.featured_drop)
    );

    const heroCollectable = computed(() => listOfCollectables.value.filter(item =>  item && item.featured_drop)[0] || listOfCollectables.value[0]);
    const featuredCollectables = computed(() =>
      [listOfNonHeroCollectables.value[0], listOfNonHeroCollectables.value[1]].filter(
        (i) => i !== undefined
      )
    );
    const otherCollectables = computed(() =>
      [
        listOfNonHeroCollectables.value[2],
        listOfNonHeroCollectables.value[3],
        listOfNonHeroCollectables.value[4],
      ].filter((i) => i !== undefined)
    );

    paginatedCollectables.load();

    const navigateToCollectable = function (slug, isSlugFullRoute) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      }else{
        router.push({
          name: "collectableAuction",
          params: { slug: slug },
        });
      }
    };

    const navigateToCollection = function (slug) {
      router.push({
          name: 'collection',
          params: {
            collectionName: slug
          }
      });
    }

    const paginatedArtists = useArtistsWithPagination();
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);

    paginatedArtists.load();

    return {
      heroCollectable,
      featuredCollectables,
      otherCollectables,
      listOfArtists,
      navigateToCollectable,
      navigateToCollection,
      darkMode,
    };
  },
};
</script>

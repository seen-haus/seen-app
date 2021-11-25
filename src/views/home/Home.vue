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

    <container class="section-featured-auctions relative pt-20">
      <div class="abstract-circles" :style="{
          'left': '-274px',
          'top': '77px'
        }">
        <img src="@/assets/images/abstract-circles.svg" alt="">
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-10">
        <div class="flex-center flex-col">
          <icon-square icon="paint-and-brush.svg"></icon-square>
          <sub-title fontSize="24px" class="mt-2">The future of art collecting</sub-title>
          <light-typography maxWidth="250px" class="mt-2">Browse and build your collection of the world’s most cutting-edge digital art</light-typography>
        </div>
        <div class="flex-center flex-col">
          <icon-square icon="royalties.svg"></icon-square>
          <sub-title fontSize="24px" class="mt-2">Pioneering royalties</sub-title>
          <light-typography maxWidth="280px" class="mt-2">Artists receive royalties for secondary sales of their artworks on any EIP-2981 compliant marketplaces – forever</light-typography>
        </div>
        <div class="flex-center flex-col">
          <icon-square icon="infinity.svg"></icon-square>
          <sub-title fontSize="24px" class="mt-2">Built for longevity</sub-title>
          <light-typography maxWidth="250px" class="mt-2">All transactions happen on-chain, creating a tamper-proof record of each artwork’s history</light-typography>
        </div>
      </div>
    </container>

    <container class="section-featured-auctions pb-12">
      <div class="flex items-center pt-20 lg:pt-24 flex-col lg:flex-row">
        <img src="@/assets/icons/orange-flame.svg" class="mr-2"/>
        <common-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="false"
          >Live</common-title
        >
        <router-link to="drops" class="hidden lg:block">
          <button :class="darkMode ? 'light' : 'dark'" class="button flex-shrink-0">
            View All Drops <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>
        </router-link>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
      >
        <template
          v-for="collectable in listOfLiveCollectables"
          :key="collectable && collectable.id"
        >
          <product-card-v3
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
            :style="{ 'padding-bottom': '120%' }"
          ></div>
        </template>
      </div>
    </container>

    <container class="section-featured-auctions">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-9"
      >
        <pane-link image="state-of-seen.jpeg" title="State of SEEN" link="https://seen-haus.medium.com/" :isExternalLink="true"/>
        <pane-link image="discord.jpeg" title="Discord Community" link="https://discord.com/invite/dad8J4f" :isExternalLink="true"/>
      </div>
    </container>

    <container class="section-featured-auctions">
      <div class="flex items-center pt-16 lg:pt-16 flex-col lg:flex-row">
        <img src="@/assets/icons/paint-palette.svg" class="mr-2"/>
        <common-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="false"
          >Featured</common-title>
        <router-link to="drops" class="hidden lg:block">
          <button :class="darkMode ? 'light' : 'dark'" class="button flex-shrink-0">
            View All Drops <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>
        </router-link>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
      >
        <template
          v-for="collectable in listOfEndedCollectables"
          :key="collectable && collectable.id"
        >
          <product-card-v3
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
            :style="{ 'padding-bottom': '120%' }"
          ></div>
        </template>
      </div>
    </container>

    <!-- <div :class="darkMode ? 'dark-mode-background' : 'bg-background-gray'" class="learn-how-to border-t border-b">
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
    </div> -->

    <container class="meet-artists pb-32">
      <div class="flex items-center pt-20 lg:pt-24 flex-col lg:flex-row">
        <img src="@/assets/icons/trending.svg" class="mr-2"/>
        <common-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="false"
          >Creators</common-title>
        <router-link to="creators" class="hidden lg:block">
          <button :class="darkMode ? 'light' : 'dark'" class="button flex-shrink-0">
            View All Creators <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9">
        <template v-for="artist in listOfArtists" :key="artist && artist.id">
          <artist-card v-if="artist != null" :artist="artist" />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>
    </container>
  </div>
</template>

<script>
import {computed} from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import IconSquare from "@/components/IconSquare.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import CommonTitle from "@/components/CommonTitle.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import HeroAuction from "./components/HeroAuction.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import PaneLink from "@/components/PaneLink.vue";
import useDarkMode from "@/hooks/useDarkMode";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import useHeroCollectable from "@/hooks/useHeroCollectable.js";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Home",
  components: {
    HeroAuction,
    Container,
    FencedTitle,
    CommonTitle,
    ProductCardV3,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
    SubTitle,
    LightTypography,
    IconSquare,
    PaneLink,
  },
  setup() {
    const { meta } = useMeta({
      title: "Home",
    });
    const router = useRouter();
    const { darkMode } = useDarkMode();

    const heroCollectableApi = useHeroCollectable();
    const heroCollectable = computed(() => heroCollectableApi?.heroCollectable?.value);
    
    const paginatedLiveCollectables = useDropsWithPagination(null, 7, {excludeEnded: true, excludeComingSoon: true}); // Use 7 in case one of them is the hero listing
    const paginatedEndedCollectables = useDropsWithPagination(null, 7, {excludeLive: true}); // Use 7 in case one of them is the hero listing

    const listOfLiveCollectables = computed(
      // Uncomment if hero should be excluded from live list
      // () => paginatedCollectables.listOfCollectables.value.filter(item =>  item && !item.featured_drop).slice(0,6) // Limit to 6 items
      () => paginatedLiveCollectables.listOfCollectables.value.slice(0,6) // Limit to 6 items
    );

    const listOfEndedCollectables = computed(
      // Uncomment if hero should be excluded from ended list
      // () => paginatedCollectables.listOfCollectables.value.filter(item =>  item && !item.featured_drop).slice(0,6) // Limit to 6 items
      () => paginatedEndedCollectables.listOfCollectables.value.slice(0,6) // Limit to 6 items
    );

    paginatedLiveCollectables.load();
    paginatedEndedCollectables.load();
    heroCollectableApi.load();

    const navigateToCollectable = function (slug, isSlugFullRoute, version) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      }else{
        if(version === 2) {
          router.push({
            name: "collectableDropV2",
            params: { slug: slug },
          });
        } else if (version === 3) {
          router.push({
            name: "collectableDropV3",
            params: { slug: slug },
          });
        }
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
      listOfLiveCollectables,
      listOfEndedCollectables,
      listOfArtists,
      navigateToCollectable,
      navigateToCollection,
      darkMode,
    };
  },
};
</script>

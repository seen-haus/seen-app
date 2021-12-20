<template>
  <div>
    <container class="section-featured-auctions pb-24">
      <div class="flex items-center pb-4 flex-col lg:flex-row">
        <div class="abstract-circles abstract-circles-drops">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
        <unfenced-title
          class="text-black hidden lg:flex pt-12"
          color="fence-dark"
          text-align="left"
        >
          Drops
        </unfenced-title>
      </div>
      
      <div class="flex flex-wrap justify-start items-center">
        <button 
          @click="setQuickFilter('all')"
          :class="{
            'dark': quickFilter === 'all',
            'bg-white': quickFilter !== 'all',
          }"
          class="button light-shadow quick-filter-button mr-4 mb-4"
        >
            <img src="@/assets/icons/trending.svg" class="mr-3"/>All
        </button>
        <button 
          @click="setQuickFilter('live')"
          :class="{
            'dark': quickFilter === 'live',
            'bg-white': quickFilter !== 'live',
          }"
          class="button light-shadow bg-white quick-filter-button mr-4 mb-4"
        >
            <img src="@/assets/icons/orange-flame.svg" class="mr-3"/>Live
        </button>
        <button 
          @click="setQuickFilter('reserve-not-met')"
          :class="{
            'dark': quickFilter === 'reserve-not-met',
            'bg-white': quickFilter !== 'reserve-not-met',
          }"
          class="button light-shadow bg-white quick-filter-button mr-4 mb-4"
        >
            <img src="@/assets/icons/hotel-bell.svg" class="mr-3"/>Reserve not met
        </button>
        <button 
          @click="setQuickFilter('sold')"
          :class="{
            'dark': quickFilter === 'sold',
            'bg-white': quickFilter !== 'sold',
          }"
          class="button light-shadow bg-white quick-filter-button mb-4"
        >
            <img src="@/assets/icons/gavel.svg" class="mr-3"/>Sold
        </button>
      </div>

      <!-- <div class="flex justify-start items-center">

        <toggle
          :value="filterExcludeEnded"
          class="mr-8"
          @onChange="handleExcludeEndedToggle($event)"
        >
          <span :class="darkMode ? 'dark-mode-text' : 'text-black'" class="font-bold">Exclude Ended</span>
        </toggle>

        <toggle
          :value="filterAuctions"
          class="mr-8"
          @onChange="handleAuctionsToggle($event)"
        >
          <span :class="darkMode ? 'dark-mode-text' : 'text-black'" class="font-bold">Auctions</span>
        </toggle>

        <toggle
          :value="filterEditions"
          @onChange="handleEditionsToggle($event)"
        >
          <span :class="darkMode ? 'dark-mode-text' : 'text-black'" class="font-bold">Editions</span>
        </toggle>
      </div> -->

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-5"
      >
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <!-- <product-card
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          /> -->
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

      <button
        class="button mt-20 mx-auto w-full md:w-96"
        :class="darkMode ? 'light' : 'dark'"
        v-if="hasMore"
        @click="handleLoadMore"
      >
        Load More
      </button>
    </container>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import UnfencedTitle from "@/components/FencedTitle.vue";
import Toggle from "@/components/Inputs/Toggle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import useDarkMode from "@/hooks/useDarkMode";

export default {
  name: "Drops",
  components: {
    Container,
    FencedTitle,
    UnfencedTitle,
    ProductCard,
    ProductCardV3,
    Toggle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
  },
  setup() {
    const { darkMode } = useDarkMode();

    const { meta } = useMeta({
      title: "Drops",
    });
    const router = useRouter();
    const filterAuctions = ref(true);
    const filterEditions = ref(true);
    const filterExcludeEnded = ref(false);
    const quickFilter = ref('all');

    const paginatedCollectables = useDropsWithPagination();
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const hasMore = computed(() => paginatedCollectables.hasMore.value);

    paginatedCollectables.load();

    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };

    const handleAuctionsToggle = (event) => {
      if (!filterEditions.value && !event) return;
      filterAuctions.value = event;
      paginatedCollectables.filter(filterAuctions.value, filterEditions.value);
    }

    const handleEditionsToggle = (event) => {
      if (!filterAuctions.value && !event) return;
      filterEditions.value = event;
      paginatedCollectables.filter(filterAuctions.value, filterEditions.value);
    }

    const handleExcludeEndedToggle = (event) => {
      filterExcludeEnded.value = event;
      paginatedCollectables.filter(filterAuctions.value, filterEditions.value, {excludeEnded: event});
    }

    const setQuickFilter = (alias) => {
      quickFilter.value = alias;
      if(alias === 'all') {
        paginatedCollectables.filter(true, true);
      } else if(alias === 'live') {
        paginatedCollectables.filter(true, true, {excludeEnded: true});
      } else if(alias === 'reserve-not-met') {
        // paginatedCollectables.filter(true, true, {excludeEnded: true});
      } else if(alias === 'sold') {
        // paginatedCollectables.filter(true, true, {excludeEnded: true});
      }
    }

    const navigateToCollectable = function (slug, isSlugFullRoute, version) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      } else {
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

    return {
      filterAuctions,
      filterEditions,
      filterExcludeEnded,

      handleAuctionsToggle,
      handleEditionsToggle,
      handleExcludeEndedToggle,
      
      quickFilter,
      setQuickFilter,

      listOfCollectables,
      hasMore,
      handleLoadMore,
      navigateToCollectable,

      darkMode,
    };
  },
};
</script>

<style lang="scss" scoped>
  .abstract-circles-drops {
    top: 100px;
    @screen lg {
      right: 35px;
    }
  }
  .quick-filter-button {
    transition: all 500ms ease-in-out;
    img {
      height: 20px;
    }
  }
</style>

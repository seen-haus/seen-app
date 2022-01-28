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
      
      <div class="flex flex-col lg:flex-row gap-4 mb-8">
        <button 
          @click="quickFilter = 'all'"
          :class="{
            'dark': quickFilter === 'all',
            'bg-white': quickFilter !== 'all',
          }"
          class="button light-shadow quick-filter-button"
        >
            <img src="@/assets/icons/trending.svg" class="mr-3"/>All
        </button>
        <button 
          @click="quickFilter = 'live'"
          :class="{
            'dark': quickFilter === 'live',
            'bg-white': quickFilter !== 'live',
          }"
          class="button light-shadow bg-white quick-filter-button"
        >
            <img src="@/assets/icons/orange-flame.svg" class="mr-3"/>Live
        </button>
        <button 
          @click="quickFilter = 'reserve-not-met'"
          :class="{
            'dark': quickFilter === 'reserve-not-met',
            'bg-white': quickFilter !== 'reserve-not-met',
          }"
          class="button light-shadow bg-white quick-filter-button"
        >
            <img src="@/assets/icons/hotel-bell.svg" class="mr-3"/>Reserve not met
        </button>
        <button 
          @click="quickFilter = 'sold'"
          :class="{
            'dark': quickFilter === 'sold',
            'bg-white': quickFilter !== 'sold',
          }"
          class="button light-shadow bg-white quick-filter-button"
        >
            <img src="@/assets/icons/gavel.svg" class="mr-3"/>Sold Out
        </button>

        <small class="button">
          <InputSwitch v-model="secondaryListingsFilter" id="secondary-listings-filter" />
          <label for="secondary-listings-filter" class="ml-3 clickable">Secondary Listings</label>
        </small>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-5"
      >
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card-v3
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          />
          <product-card-v3-placeholder v-else />
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
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import InputSwitch from 'primevue/inputswitch';
import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import ProductCardV3Placeholder from "@/components/ProductCardV3Placeholder.vue";
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
    ProductCardV3Placeholder,
    Toggle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
    InputSwitch,
  },
  setup() {
    const { darkMode } = useDarkMode();

    const { meta } = useMeta({
      title: "Drops",
    });
    const router = useRouter();
    const quickFilter = ref('all');
    const secondaryListingsFilter = ref(false);

    const paginatedCollectables = useDropsWithPagination();
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const hasMore = computed(() => paginatedCollectables.hasMore.value);

    paginatedCollectables.load();

    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };

    watch([quickFilter, secondaryListingsFilter], () => {
      const marketType = secondaryListingsFilter.value ? 'secondary' : 'primary';

      if(quickFilter.value === 'all') {
        paginatedCollectables.filter(true, true, {marketType});
      } else if(quickFilter.value === 'live') {
        paginatedCollectables.filter(true, true, {excludeEnded: true, marketType});
      } else if(quickFilter.value === 'reserve-not-met') {
        paginatedCollectables.filter(true, true, {awaitingReserveBid: true, marketType});
      } else if(quickFilter.value === 'sold') {
        paginatedCollectables.filter(true, true, {soldOut: true, marketType});
      }
    })

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
      quickFilter,
      secondaryListingsFilter,

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

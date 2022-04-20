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
          {{state.collectionName}}
        </unfenced-title>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
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
import { computed, reactive, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMeta } from "vue-meta";

import { slugToTitleCase } from "@/services/utils";

import Container from "@/components/Container.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import ProductCardV3Placeholder from "@/components/ProductCardV3Placeholder.vue";
import UnfencedTitle from "@/components/FencedTitle.vue";
import Toggle from "@/components/Inputs/Toggle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";

import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import useDarkMode from '@/hooks/useDarkMode';

export default {
  name: "Drops",
  components: {
    Container,
    UnfencedTitle,
    ProductCardV3,
    ProductCardV3Placeholder,
    Toggle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
  },
  setup(props) {
    const { darkMode } = useDarkMode();

    const { meta } = useMeta({
      title: "Drops",
    });
    const router = useRouter();
    const route = useRoute();

    const state = reactive({
      collectionName: slugToTitleCase(route.params["collectionName"]),
    });

    watchEffect(() => {
      if(route.params["collectionName"] !== state.collectionName) {
        state.collectionName = slugToTitleCase(route.params["collectionName"]);
      }
    })

    const filterAuctions = ref(true);
    const filterEditions = ref(true);

    const paginatedCollectables = useDropsWithPagination(12, { collectionName: route.params["collectionName"] });
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
    const navigateToCollectable = function (slug, isSlugFullRoute) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      } else {
        router.push({
          name: "collectableAuction",
          params: { slug: slug },
        });
      }
    };

    return {
      state,
      filterAuctions,
      filterEditions,
      handleAuctionsToggle,
      handleEditionsToggle,

      listOfCollectables,
      hasMore,
      handleLoadMore,
      navigateToCollectable,

      darkMode,
    };
  },
};
</script>

<style scoped>
  .abstract-circles-drops {
    top: 100px;
    @screen lg {
      right: 35px;
    }
  }
</style>

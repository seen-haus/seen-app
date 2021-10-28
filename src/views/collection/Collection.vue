<template>
  <div>
    <container class="section-featured-auctions pb-24">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          unshrinkable
          :closed="true"
          >
          {{state.collectionName}}
        </fenced-title>
      </div>

      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
      >
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-3xl bg-gray-100"
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
import { computed, reactive, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMeta } from "vue-meta";
import { useStore } from "vuex";

import { slugToTitleCase } from "@/services/utils";

import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import Toggle from "@/components/Inputs/Toggle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";

import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";

export default {
  name: "Drops",
  components: {
    Container,
    FencedTitle,
    ProductCard,
    Toggle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
  },
  setup(props) {

    const store = useStore();

    // Disable dark mode until dark mode is supported across website
    store.dispatch("application/setDarkMode", true);

    const darkMode = computed(() => store.getters['application/darkMode']);

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

    const paginatedCollectables = useDropsWithPagination(null, 12, { collectionName: route.params["collectionName"] });
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
</style>

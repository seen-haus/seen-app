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
          ><img
            src="@/assets/icons/icon-fire.svg"
            class="cursor-pointer mr-2 inline-flex icon-fire -mt-1.5"
            alt="SEEN"
          />Drops
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
            class="placeholder-card overflow-hidden rounded-3xl bg-gray-100"
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
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

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
  setup() {
    const { meta } = useMeta({
      title: "Drops",
    });
    const router = useRouter();
    const state = reactive({
      filterNft: true,
      filterTangibleNft: true,
    });

    const filterNft = computed(() => state.filterNft);
    const filterTangibleNft = computed(() => state.filterTangibleNft);

    const paginatedCollectables = useDropsWithPagination();
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

    return {
      filterNft,
      filterTangibleNft,
      listOfCollectables,
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

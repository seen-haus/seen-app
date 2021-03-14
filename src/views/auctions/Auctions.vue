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
        <template v-for="collectable in listOfCollectables" :key="collectable">
          <product-card v-if="collectable != null" :collectable="collectable"/>
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
        <artist-card />
        <artist-card />
        <artist-card />
      </div>

      <button class="button dark mt-20 mx-auto w-full md:w-96">
        View All Artists
      </button>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import Toggle from "@/components/Inputs/Toggle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import Quote from "@/components/Quote.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import { computed, reactive } from "vue";
import { CollectablesService } from "@/services/apiService";
import COLLECTABLE_TYPE from "@/constants/Collectables.js";

export default {
  name: "Auctions",
  components: {
    Container,
    FencedTitle,
    ProductCard,
    Toggle,
    HowToVideo,
    Quote,
    ArtistCard,
  },
  setup() {
    const state = reactive({
      filterNft: true,
      filterTangibleNft: true,
      isAcution: true,

      listOfCollectables: [null, null, null, null, null, null],
      filter: {
        type: COLLECTABLE_TYPE.NONE,
      },
      pagination: {
        perPage: 6,
        page: 1,
        hasMore: false,
      },
    });

    const fetchData = async () => {
      state.pagination.perPage = 6;
      state.pagination.page = 1;

      const pagination = {
        perPage: state.pagination.perPage,
        page: state.pagination.page,
      };

      console.log('filter', state.filter.type);

      state.listOfCollectables = [null, null, null, null, null, null];

      const { data, metadata } = await CollectablesService.list(
        pagination,
        state.filter
      );

      state.listOfCollectables = data.slice(0); // TODO REMOVE
      state.pagination.hasMore =
        metadata.pagination.totalPages !== state.pagination.page;

      console.log(data);
      console.log(metadata);
      console.log("end");
    };

    const handleLoadMore = async () => {
      if (!state.pagination.hasMore) return;

      const pagination = {
        perPage: state.pagination.perPage,
        page: state.pagination.page + 1,
      };

      state.listOfCollectables = [
        ...state.listOfCollectables,
        null,
        null,
        null,
        null,
        null,
        null,
      ];

      const { data, metadata } = await CollectablesService.list(
        pagination,
        state.filter
      );

      state.pagination.page += 1;
      state.listOfCollectables = [
        ...state.listOfCollectables.filter((i) => i != null),
        ...data,
      ];
      state.pagination.hasMore =
        metadata.pagination.totalPages !== state.pagination.page;

      console.log(metadata.pagination.totalPages, state.pagination.page);
    };

    fetchData();

    const filterNft = computed(() => state.filterNft);
    const filterTangibleNft = computed(() => state.filterTangibleNft);
    const hasMore = computed(() => state.pagination.hasMore);
    const listOfCollectables = computed(() => state.listOfCollectables);

    const handleNftToggle = function (event) {
      state.filterNft = event;
      updateFilter();
      fetchData();
    };

    const handleTangibleToggle = function (event) {
      state.filterTangibleNft = event;
      updateFilter();
      fetchData();
    };

    const updateFilter = function () {
      if (state.filterNft && state.filterTangibleNft)
        state.filter.type = COLLECTABLE_TYPE.NONE;
      else if (state.filterNft) state.filter.type = COLLECTABLE_TYPE.NFT;
      else if (state.filterTangibleNft) state.filter.type = COLLECTABLE_TYPE.TANGIBLE_NFT;
      else state.filter.type = COLLECTABLE_TYPE.TANGIBLE
    };

    return {
      filterNft,
      filterTangibleNft,
      hasMore,
      listOfCollectables,
      // Methods
      handleNftToggle,
      handleTangibleToggle,
      handleLoadMore,
    };
  },

  init() {},
};
</script>

<style scoped>
</style>

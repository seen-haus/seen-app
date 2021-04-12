<template>
  <div>
    <container class="section-featured-artists pb-24">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Artists
        </fenced-title>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="artist in listOfArtists"
          :key="artist && artist.id"
        >
          <artist-card v-if="artist != null" :artist="artist" class="cursor-pointer"/>
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>
      <button class="button dark mt-20 mx-auto w-full md:w-96" @click="handleLoadMore" v-if="hasMore">
        View All Artists
      </button>
    </container>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import ArtistCard from "@/components/ArtistCard.vue";
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Artists",
  components: {
    Container,
    FencedTitle,
    ArtistCard,
  },
  setup() {
    const { meta } = useMeta({
      title: "Artists",
    });
    const router = useRouter();
    const paginatedArtists = useArtistsWithPagination();
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);
    const hasMore = computed(() => paginatedArtists.hasMore.value);

    paginatedArtists.load();

    const handleLoadMore = async () => {
      paginatedArtists.loadMore();
    };

    const navigateToArtist = (artistSlug) => {
        router.push({
            name: "artistProfile",
            params: { artistSlug: artistSlug },
        });
    };
    return {
      listOfArtists,
      hasMore,
      // Methods
      handleLoadMore,
      navigateToArtist,
    };
  },
};
</script>

<style scoped>
</style>

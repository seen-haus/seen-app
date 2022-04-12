<template>
  <div>
    <container class="section-featured-artists pb-24">
      <div class="flex items-center pb-6 flex-col lg:flex-row">
        <div class="abstract-circles abstract-circles-creators">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
        <unfenced-title
          class="text-black hidden lg:flex pb-4 pt-12"
          color="fence-dark"
          text-align="left"
        >
          Creators
        </unfenced-title>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="artist in listOfArtists"
          :key="artist && artist.id"
        >
          <artist-card :autoMargins="true" v-if="artist != null && !artist.hasOwnProperty('username')" :artist="artist" class="cursor-pointer"/>
          <user-card v-else-if="artist != null && artist.hasOwnProperty('username')" class="cursor-pointer" :user="artist"/>
          <div
            v-else
            class="creator-placeholder placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>
      <button :class="darkMode ? 'light' : 'dark'" class="button mt-20 mx-auto w-full md:w-96" @click="handleLoadMore" v-if="hasMore">
        View All Creators
      </button>
    </container>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import useDarkMode from "@/hooks/useDarkMode";
import ArtistCard from "@/components/ArtistCard.vue";
import UserCard from "@/components/UserCard.vue";
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Artists",
  components: {
    Container,
    FencedTitle,
    UnfencedTitle,
    ArtistCard,
    UserCard,
  },
  setup() {
    const { meta } = useMeta({
      title: "Creators",
    });
    const router = useRouter();
    const paginatedArtists = useArtistsWithPagination(24);
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);
    const hasMore = computed(() => paginatedArtists.hasMore.value);
    const { darkMode } = useDarkMode();

    paginatedArtists.load();

    const handleLoadMore = async () => {
      paginatedArtists.loadMore();
    };

    const navigateToArtist = (artistSlug) => {
        router.push({
            name: "legacyArtistProfile",
            params: { artistSlug: artistSlug },
        });
    };
    return {
      listOfArtists,
      hasMore,
      darkMode,
      // Methods
      handleLoadMore,
      navigateToArtist,
    };
  },
};
</script>

<style lang="scss" scoped>
  .abstract-circles-creators {
    top: 100px;
    @screen lg {
      right: 35px;
    }
  }
</style>
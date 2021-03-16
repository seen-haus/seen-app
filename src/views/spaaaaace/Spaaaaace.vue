<template>
  <div>
    <container class="section-featured-auctions mb-6 lg:mb-14">
      <div class="flex items-center py-6 flex-col">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          ><i class="fas fa-rocket text-5xl text-primary scale lg:mr-4"></i
          >Space NFT</fenced-title
        >

        <div class="status flex justify-center items-center flex-wrap">
          <user-badge type="light" class="my-2" />
          <div class="tags flex mx-9">
            <tag
              class="bg-fence-light self-end text-gray-400 font-semibold mr-1 my-2"
              >EDITION 1/1</tag
            >
            <tag class="bg-tag-nft mr-1 text-white my-2">NFT</tag>
            <tag class="bg-tag-tangible text-white my-2">TANGIBLE</tag>
          </div>
          <live-indicator status="live" class="my-2">LIVE</live-indicator>
        </div>
      </div>
    </container>

    <container>
      <div class="flex flex-col lg:flex-row mb-18">
        <div class="video flex items-center flex-1 lg:order-3">
          <media-loader
            src="https://www.youtube.com/embed/wLlovxa3VJ0?controls=0&modestbranding"
            aspectRatio="56.25%"
            controls
            class="overflow-hidden rounded-3xl flex-1"
          />
        </div>

        <div class="w-12 h-12 lg:order-2"></div>

        <div
          class="description flex flex-col justify-center text-center lg:text-left flex-1 lg:order-1"
        >
          <div class="text-4xl font-title font-bold mb-4">Artist Statement</div>
          <div class="text-xl text-gray-500">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum.
          </div>

          <div
            class="flex flex-col justify-start items-center lg:flex-row mt-9"
          >
            <button
              class="button dark mr-0 mb-4 lg:mr-4 lg:mb-0 w-full lg:w-auto"
            >
              <i class="fas fa-file-pdf mr-2 text-xl icon-left text-white"></i>
              More about the launch
            </button>

            <button class="button secondary w-full lg:w-auto">
              <i
                class="fas fa-paper-plane mr-2 text-xl icon-left text-white"
              ></i>
              Chat with us
            </button>
          </div>
        </div>
      </div>

      <div class="countdown flex flex-col items-center">
        <progress-bar
          :progress="0.34"
          colorClass="bg-rainbow"
          class="bg-topbar h-3 w-full"
        />
        <progress-timer class="text-lg my-4" label="Launching in:" />
      </div>

      <div class="collage-image overflow-auto mb-36">
        <div
          class="image-container mx-auto relative"
          style="min-width: 700px; max-width: 1140px"
        >
          <div class="grid gap-2">

            <collage-tile v-for="item in 40" :key="item" :available="item % 3 === 0"/>

          </div>
        </div>
      </div>
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
        <template
          v-for="artist in listOfArtists"
          :key="artist && artist.id"
        >
          <artist-card v-if="artist != null" :artist=artist />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-2xl bg-gray-100"
            :style="{ 'padding-bottom': '100%' }"
          ></div>
        </template>
      </div>

      <router-link to="artists">
        <button class="button dark mt-20 mx-auto w-full md:w-96">
          View All Artists
        </button>
      </router-link>
      
    </container>
  </div>
</template>


<script>
import { computed } from "vue";

import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import Quote from "@/components/Quote.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import CollageTile from "./components/CollageTile.vue";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";
import MediaLoader from "@/components/Media/MediaLoader.vue";

export default {
  name: "Spaaaaace",
  components: {
    Container,
    FencedTitle,
    HowToVideo,
    Quote,
    ArtistCard,
    MediaLoader,
    ProgressBar,
    ProgressTimer,
    UserBadge,
    Tag,
    LiveIndicator,
    CollageTile,
  },
  setup() {
    const paginatedArtists = useArtistsWithPagination();
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);

    paginatedArtists.load();

    return {
      listOfArtists,
      // Methods
    };
  }
};
</script>

<style lang="scss">
.collage-image .image-container .grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(10, minmax(0, 1fr));
}
</style>
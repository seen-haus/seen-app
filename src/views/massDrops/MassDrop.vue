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
          >{{ drop.dropTitle }}</fenced-title
        >
        <div class="status flex justify-center items-center flex-wrap">
          <user-badge type="light" class="my-2" v-if="artist" :artist-slug="artist.slug" :username="artist.name" :url="artist.avatar"/>
          <div class="tags flex mx-9">
            <template v-for="t in drop.tags" :key="t">
              <tag :class=t.class>{{t.text}}</tag>
              </template>
          </div>
          <live-indicator v-if="maxEndTime && minStartTime" :status="live" class="my-2"></live-indicator>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row mb-18">
        <div class="video flex items-center flex-1 lg:order-3">
          <media-loader
            :src="drop.videoUrl"
            aspectRatio="56.25%"
            controls
            class="overflow-hidden rounded-3xl flex-1"
          />
        </div>

        <div class="w-12 h-12 lg:order-2"></div>

        <div class="description flex flex-col justify-center text-center lg:text-left flex-1 lg:order-1">
          <div class="text-4xl font-title font-bold mb-4">{{ drop.artistStatement }}</div>
          <div class="text-xl text-gray-500">{{ drop.artistText }}</div>

          <div class="flex flex-col justify-start items-center lg:flex-row mt-9">
              <template v-for="button in drop.buttons" :key="button">
                <button :class="button.class">
                    <a :href="button.url" target="_blank">
                        <i :class="button.image"></i>
                        <span style="font-size: 14px;">{{ button.displayText }}</span>
                    </a>
                </button>
              </template>
          </div>

        </div>
      </div>

      <div class="countdown flex flex-col items-center">
        <progress-bar v-if="minStartTime && maxEndTime" :progress="(new Date(maxEndTime.ends_at).getTime() - new Date().getTime())/(new Date(maxEndTime.ends_at).getTime() - new Date(minStartTime.starts_at).getTime())" colorClass="bg-rainbow" class="bg-topbar h-3 w-full"/>
        <progress-timer v-if="minStartTime && maxEndTime" class="text-lg my-4" :start-date="minStartTime.starts_at" :end-date="maxEndTime.ends_at" />
      </div>

      <div class="collage-image overflow-auto mb-36">
        <div class="image-container mx-auto relative" style="min-width: 700px; max-width: 1140px">
          <div class="grid" :style="gridStyle">
        <template
          v-for="collectable in listOfCollectables" :key="collectable && collectable.id">
          <collage-tile v-if="collectable != null" :collectable="collectable" @click="navigateToCollectable(collectable.slug)"
          />
        </template>
      </div>
        </div>
      </div>

      <div v-if="drop.faq" class="faq-list">
          <div class="flex items-center py-6 flex-col lg:flex-row">
            <fenced-title
              class="flex-grow mr-0 mb-2 self-stretch"
              color="fence-gray"
              textAlign="center"
              :closed="true"
              >FAQs
            </fenced-title>
          </div>
          <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
              You got questions? We got the answers.
          </div>
          <template v-for="question in drop.faq" :key="question">
            <collapsible-tile class="mx-auto mb-6" :title="question.question">
                <span v-html="question.answer"></span>
            </collapsible-tile>
          </template>
      </div>
    </container>
  </div>
</template>


<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import QuoteCarousel from "@/components/Quote/QuoteCarousel.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import CollageTile from "./components/CollageTile.vue";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import orderBy from "lodash/orderBy";
import { ArtistService } from "@/services/apiService";
import CollapsibleTile from "@/views/faq/components/CollapsibleTile.vue"


export default {
  name: "MassDrop",
  props: {
    drop: Object
  },
  components: {
    Container,
    FencedTitle,
    HowToVideo,
    QuoteCarousel,
    ArtistCard,
    MediaLoader,
    ProgressBar,
    ProgressTimer,
    UserBadge,
    Tag,
    LiveIndicator,
    CollageTile,
    CollapsibleTile
  },
  computed: {
    gridStyle() {
    return {'grid-template-columns': 'repeat(' + this.drop.gridWidth + ', minmax(0, 1fr))'}
    },
    progress() {
      return (new Date(this.maxEndTime.ends_at).getTime() - new Date().getTime())/(new Date(this.maxEndTime.ends_at).getTime() - new Date(this.minStartTime.starts_at).getTime())
    },
    live() {
      return this.progress > 0 && this.progress < 1 ? 'live' : this.progress > 1 ? 'coming soon' : 'ended';
    },

  },
  async setup(props) {

    const router = useRouter();

    const {data} = await ArtistService.show(props.drop.artistSlug);
    const artist = ref(data);
    const paginatedArtists = useArtistsWithPagination(props.drop.artistId);
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);
    paginatedArtists.load();

    const paginatedCollectables = useDropsWithPagination(null, props.drop.numberOfItems, true, props.drop.bundleChildId);
    const listOfCollectables = computed(() => {
      let list = paginatedCollectables.listOfCollectables.value;
      return orderBy(list, 'id', "asc")
    });

    paginatedCollectables.load();

    const minStartTime = computed(() => {
      let list = paginatedCollectables.listOfCollectables.value;
      return orderBy(list, 'starts_at', "asc")[0]
    });

    const maxEndTime = computed(() => {
      let list = paginatedCollectables.listOfCollectables.value;
      return orderBy(list, 'ends_at', "desc")[0]
    });

    const navigateToCollectable = function (slug) {
      router.push({
        name: "collectableAuction",
        params: { slug: slug },
      });
    };


    return {
      listOfArtists,
      listOfCollectables,
      artist,
      minStartTime,
      maxEndTime,
      // Methods
      navigateToCollectable,
    };
  }
};
</script>

<style lang="scss">

.discord {
  background-color: rgb(50, 93, 218);
  color: white;
}
</style>

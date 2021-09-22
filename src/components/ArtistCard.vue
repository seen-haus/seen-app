<template>
  <div
    class="artist-card overflow-hidden rounded-lg custom-shadow cursor-pointer"
    :class="darkMode && 'dark-mode-surface'"
    @click="navigateToArtist"
  >
    <div class="top-bar" :class="darkMode ? 'dark-mode-background' : 'light-mode-background'">
    <img v-if="artist.header_image" :src="artist.header_image" class="mr-4 header" alt="">
    <img v-else :src="artist.avatar" class="mr-4 blur" alt="">
    </div>
    <div class="description flex flex-col p-6" :class="darkMode ? 'dark-mode-surface' : 'light-mode-background'">
      <img
        :src="artist.avatar"
        alt=""
        class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25 avatar"
      />

      <div class="flex items-center mt-6">
        <div class="text-title font-bold text-2.5xl ellipsis  mr-4" :class="darkMode && 'dark-mode-text'">
          {{ artist.name }}
        </div>
        <tag 
          class="bg-fence-light text-gray-400 font-semibold flex-shrink-0" 
          :class="{
            'ml-auto': $route.name !== 'collectableDrops',
            'dark-mode-text': darkMode,
            'text-gray-400': !darkMode,
          }"
        >
          {{ collectablesCount }} CREATION{{
            collectablesCount > 1 || collectablesCount === 0
              ? "S"
              : ""
          }}</tag
        >
      </div>

      <div
        class="mt-3 text-gray-600 md:text-lg"
        :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-600'"
        v-if="artistStatement != null"
        v-html="artistStatement"
      ></div>
      <div class="mt-3" :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-600'" v-else v-html="artist.bio">
      </div>

      <div class="h-0.5 my-4 w-full rounded-full bg-gray-200"></div>

      <div
        class="flex flex-wrap justify-start items-center text-xs"
        :class="darkMode ? 'dark-mode-text' : 'text-gray-400'"
      >
        <social-line
          :social="social"
          v-for="social in artist.socials"
          :key="social.url"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import useDarkMode from '@/hooks/useDarkMode';
import Tag from "@/components/PillsAndTags/Tag.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

export default {
  name: "ArtistCard",
  components: {
    Tag,
    MediaLoader,
    SocialLine,
  },
  props: {
    artist: Object,
    artistStatement: {
      type: String,
    },
  },
  setup(props) {
    const artist = ref(props.artist);
    const router = useRouter();
    const collectablesCount = computed(() => {
      return artist.value.collectablesCount || 0;
    });

    const { darkMode } = useDarkMode();

    const navigateToArtist = () => {
      router.push({
        name: "artistProfile",
        params: { artistSlug: artist.value.slug },
      });
    };

    return {
      navigateToArtist,
      collectablesCount,
      darkMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-shadow {
    box-shadow: 0px 3px 15px rgba(0,0,0,.1);
}

.avatar {
  z-index: 2;
}
.description {
  margin-top: -70px;
  z-index: 4;
}
.top-bar {
    height: 187px;
    width: 100%;
    position: relative;
    overflow:hidden;
}
.top-bar img.header {

  position: absolute;
  top:-100%; left:0; right: 0; bottom:-100%;
  margin: auto;
}
.top-bar img.blur {
  transform: translate(-10%,-10%);
  width: 100%;
  filter: blur(70px);
  opacity: .7;
}

</style>
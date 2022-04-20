<template>
  <div
    class="artist-card artist-card-container-border overflow-hidden rounded-lg custom-shadow cursor-pointer"
    :class="{
      'dark-mode-surface': darkMode,
      'auto-margins': autoMargins,
    }"
    :style="{
      ...(fullSize && {'width': 'auto', 'height': 'auto'})
    }"
    @click="navigateToArtist"
  >
    <div>
      <div class="top-bar" :class="darkMode ? 'dark-mode-background' : 'light-mode-background'">
        <img v-if="artist.header_image" :src="artist.header_image" class="mr-4 header" alt="">
        <img v-else :src="artist.avatar" class="mr-4 blur" alt="">
      </div>
      <div class="description flex flex-col p-6" :class="darkMode ? 'dark-mode-surface' : 'light-mode-background'">
        
        <div class="flex">
          <img
            :src="artist.avatar"
            alt=""
            class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25 avatar"
          />
          <div class="mt-13 ml-3">
            <div class="text-xs text-gray-400 mt-1">
              <div v-if="artist.socials">
                <social-line
                  class="my-1"
                  :social="social"
                  :isVertical="false"
                  :iconOnly="true"
                  v-for="social in artist.socials"
                  :key="social?.url"
                />
              </div>
              <div v-else>User has no socials yet</div>
            </div>
          </div>
        </div>

          <div class="mt-3">
            <div class="text-title font-bold text-xl ellipsis  mr-4" :class="darkMode && 'dark-mode-text'">
              {{ artist.name }}
            </div>
            <div class="mt-1">
              <tag 
                class="bg-fence-light text-gray-400 font-semibold flex-shrink-0 inline-block" 
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
          </div>

        <div
          class="mt-2 text-gray-600 md:text-lg"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-600'"
          v-if="artistStatement != null"
          v-html="artistStatement"
        ></div>
        <div v-else class="mt-2" :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-600'" v-html="artist.bio">
        </div>
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
    fullSize: {
      type: Boolean,
      default: false,
    },
    autoMargins: {
      type: Boolean,
      default: false,
    }
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
        name: "legacyArtistProfile",
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

.artist-card-container-border {
    // This class is just here for if we ever want to add a border that can support gradients
    max-width: 100%;
    height: 360px;
    width: 326px;
    background: #FFFFFF;
    box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
    border-radius: 10px;
    position: relative;
    transition: all 0.2s ease-out;
    &:hover {
        box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
        transform: translateY(-2px);
    }
    &:active {
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.3);
        transform: translateY(2px);
    }
}

.artist-card-container {
    max-width: 100%;
    height: 360px;
    width: 326px;
    background: #FFFFFF;
    border-radius: 10px;
    overflow: hidden;
}

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
    height: 162px;
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
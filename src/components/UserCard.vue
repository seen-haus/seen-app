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
    @click="navigateToUser"
  >
    <div>
      <div class="top-bar banner-background" :style="`background-image:url(${getBackgroundImage(user.banner_image)})`" :class="darkMode ? 'dark-mode-background' : 'light-mode-background'"/>
      <div class="description flex flex-col p-6" :class="darkMode ? 'dark-mode-surface' : 'light-mode-background'">
        
        <div class="flex">
          <img
            v-if="user.avatar_image"
            :src="user.avatar_image"
            alt=""
            class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25 avatar"
          />
          <div v-else-if="user?.wallet" class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25 avatar">
            <identicon :size="94" :address="user?.wallet" class="flex justify-center"/>
          </div>
          <div class="mt-13 ml-3">
            <div class="text-xs text-gray-400 mt-1">
              <div v-if="socials">
                <social-line
                  class="my-1"
                  :social="social"
                  :isVertical="false"
                  :iconOnly="true"
                  v-for="social in socials"
                  :key="social.url"
                />
              </div>
              <div v-else>User has no socials yet</div>
            </div>
          </div>
        </div>

          <div class="mt-3">
            <div class="text-title font-bold text-xl ellipsis  mr-4" :class="darkMode && 'dark-mode-text'">
              {{ user.username }}
            </div>
            <!-- <div class="mt-1">
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
            </div> -->
          </div>
        <div 
          class="mt-2" 
          :class="{
            'dark-mode-text-washed': darkMode,
            'text-gray-600': !darkMode,
            'line-clamp': !fullSize
          }"
        >
          {{user.description}}
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
import Identicon from "@/components/Identicon/Identicon";

export default {
  name: "ArtistCard",
  components: {
    Tag,
    MediaLoader,
    SocialLine,
    Identicon,
  },
  props: {
    user: Object,
    fullSize: {
      type: Boolean,
      default: false,
    },
    autoMargins: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    getBackgroundImage(backgroundImage) {
      if(!backgroundImage) {
        // Default background image
        return require('./../assets/images/default_banner_1.jpeg');
      } else {
        return backgroundImage;
      }
    }
  },
  setup(props) {
    const user = ref(props.user);
    const router = useRouter();
    const collectablesCount = computed(() => {
      return user.value.collectablesCount || 0;
    });

    const { darkMode } = useDarkMode();

    const navigateToUser = () => {
      router.push({
        name: "profileWithAddress",
        params: { userAddressOrUsername: user.value.username },
      });
    };

    const socials = computed(() =>
      user.value && user.value.socials
        ? [
            { type: "twitter", url: user.value.socials.twitter },
            { type: "instagram", url: user.value.socials.instagram },
            { type: "website", url: user.value.socials.website },
          ]
        : null
    );

    return {
      navigateToUser,
      collectablesCount,
      darkMode,
      socials,
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

.line-clamp {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.banner-background {
  background-size: cover;
  background-position: center;
}
</style>
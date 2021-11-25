<template>
  <div class="profile" :class="darkMode ? 'dark-mode-background pt-13' : 'light-mode-background'" v-bind:style="{ backgroundImage: 'url(' + getBackgroundImage(backgroundImage) + ')' }">
    <container class="relative pb-20">
      <div class="content-center">
        <div class="top-bar" :class="darkMode ? 'dark-mode-background' : 'light-mode-background'">
          <img v-if="artist.header_image" :src="artist.header_image" class="mr-4 header" alt="">
          <img v-else :src="artist.avatar" class="mr-4 blur" alt="">
        </div>

        <div class="description flex flex-col p-6">
          <img
            :src="artist.avatar"
            alt=""
            class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25 avatar mx-auto"
          />
          <div class="mt-4 flex justify-between flex-wrap items-center mx-auto">
            <div class="flex justify-start flex-wrap">
            <p class="font-bold text-3xl" :class="darkMode && 'dark-mode-text'">{{artist.name}}</p>
            <!-- <div class="wallet-address-badge flex justify-between items-center">
              <i class="fas fa-volleyball-ball text-lg"></i>
              <copy-helper :toCopy="user.wallet" :isIconSuffix="true" :text="cropWithExtension(user.wallet, 20)"/>
            </div> -->
          </div>
          </div>
          <div class="mt-4 flex justify-between flex-wrap items-center mx-auto" :class="darkMode && 'dark-mode-text'">
            <div v-html="artist?.bio ? artist.bio : 'No biography available.'"></div>
          </div>
          <div class="mt-4 flex justify-between flex-wrap items-center mx-auto">
            <div class="text-xs text-gray-400">
              <social-line class="my-1" :social="social" v-for="social in artist.socials" :key="social.url" />
            </div>
          </div>
        </div>
      </div>
      <fenced-title
        class="flex-grow mr-0 mb-2 pt-20 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Collection</fenced-title
      >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-10">
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
            :style="{ 'padding-bottom': '120%' }"
          ></div>
        </template>
      </div>
      <button
        class="button dark mt-12 mx-auto w-full md:w-96"
        v-if="hasMore"
        @click="handleLoadMore"
      >
        Load More
      </button>
    </container>
  </div>
</template>

<script>
import {ref, computed, onUnmounted} from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import { ArtistService } from "@/services/apiService";
import useDarkMode from "@/hooks/useDarkMode";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "ArtistProfile",
  components: { FencedTitle, Container, SocialLine, ProductCard },
  methods: {
    cropWithExtension: function(text, maxCharacters) {
      const txtLength = text.length; // Length of the incoming text
      const txtLengthHalf = maxCharacters ? Math.round(maxCharacters / 2) : Math.round(txtLength / 2); // set max txtHalfLength
      return text.substring(0, (txtLengthHalf -1)).trim() + '...' + text.substring((txtLength - txtLengthHalf) + 2, txtLength).trim(); //Return the string
    },
    getBackgroundImage(backgroundImage) {
      console.log({backgroundImage})
      if(backgroundImage) {
        return require('../../assets/images/' + backgroundImage)
      }
    }
  },
  async setup() {
    const { meta } = useMeta({
      title: "Loading...",
    });
    const router = useRouter();
    const { darkMode, setDarkMode } = useDarkMode();

    onUnmounted(() => {
      setDarkMode(false);
    })

    const backgroundImage = ref(false);

    const darkModeEnabled = ['0xmons', 'haydiroket', 'tengushee', 'desultor', 'cruelcoppinger', 'nostallergy', 'deathimself'].indexOf(router?.currentRoute?.value?.params?.artistSlug) > -1
    setDarkMode(darkModeEnabled);
    
    // TODO: Make this into a DB datasource unless V3 no longer uses this
    if (darkModeEnabled) {
      switch(router?.currentRoute?.value?.params?.artistSlug) {
        case '0xmons':
          backgroundImage.value = '0xmons-tile.png';
          break;
      }
    }

    const {data} = await ArtistService.show(router.currentRoute.value.params.artistSlug);
    const artist = ref(data);
    meta.title = artist.value.name;

    const paginatedCollectables = useDropsWithPagination(artist.value.id, 48);
    await paginatedCollectables.load();
    const hasMore = computed(() => paginatedCollectables.hasMore.value);
    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const navigateToCollectable = function (slug, isSlugFullRoute, version) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      }else{
        if(version === 2) {
          router.push({
            name: "collectableDropV2",
            params: { slug: slug },
          });
        } else if (version === 3) {
          router.push({
            name: "collectableDropV3",
            params: { slug: slug },
          });
        }
      }
    };

    return {
      artist,
      navigateToCollectable,
      listOfCollectables,
      handleLoadMore,
      hasMore,
      darkMode,
      backgroundImage,
    };
  }
}
</script>

<style scoped lang="scss">
.avatar {
  @apply w-30 h-30 p-1 rounded-full -mt-15 bg-white inline-flex justify-center items-center;
  border: solid 1px #e6e6e6;
}
.wallet-address-badge {
  @apply pr-3.5 py-1 pl-2 w-66 font-address;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.15);
}

.avatar {
  z-index: 2;
  margin-top: -75px;
}

.description {
  z-index: 4;
}

.top-bar {
    height: 255px;
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
  filter: blur(170px);
  opacity: .7;
}
</style>

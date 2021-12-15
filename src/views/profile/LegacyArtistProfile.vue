<template>
  <div class="profile">
    <container class="relative">
      <div v-if="isArtistFound || profileState.loading">
        <div
          class="profile-background rounded-xl mt-8"
          :style="{ backgroundImage: `url(${artist && getBackgroundImage(artist?.header_image)})` }"
          v-if="artist || profileState.loading"
        ></div>
        <div :class="'avatar-mobile'">
          <div
            v-if="hasArtistData"
            class="bg-background-gray rounded-full w-full h-full flex justify-center items-center overflow-hidden"
          >
            <div class="profile-avatar" :style="{ backgroundImage: `url(${artist?.avatar})` }">
              
            </div>
          </div>
        </div>
        <div class="content-zone">
          <div class="left-sidebar">
            <div class="sticky-bio mb-6 xl:mb-12">
              <div :class="'avatar-desktop hidden xl:inline-flex'">
                <div
                  v-if="hasArtistData"
                  class="bg-background-gray rounded-full w-full h-full flex justify-center items-center overflow-hidden"
                >
                  <div class="profile-avatar" :style="{ backgroundImage: `url(${artist?.avatar})` }">

                  </div>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap items-center" :class="artist ? 'justify-between' : 'justify-center'">
                <div class="flex justify-start flex-wrap flex-col" v-if="artist">
                  <p class="font-bold text-3xl mr-4">{{ artist ? artist.name : 'New Profile' }}</p>
                  <div class="text-xs text-gray-400 mt-2">
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
                    <div v-else>Artist has no socials yet</div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-10 md:grid-cols-2 my-2 flex render-line-breaks bio-description-zone" v-if="artist">
                <div>
                  {{
                    artist?.bio ? artist.bio : "Artist has no description."
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-content-area">
            <TabView class="tab-container -mx-6 md:mx-0" v-model:activeIndex="activeTabIndex">
              <TabPanel header="Created">
                <div v-if="artist && creationsReactive?.listOfCreations && creationsReactive.listOfCreations.length > 0 && !creationsReactive.loading">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 my-8">
                    <template
                      v-for="collectable in creationsReactive.listOfCreations"
                      :key="collectable && collectable.id"
                    >
                      <template v-if="collectable != null">
                        <product-card-v3
                          v-if="collectable != null"
                          :collectable="collectable"
                          @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
                        />
                      </template>
                      <div
                        v-else
                        class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
                        :style="{ 'padding-bottom': '120%' }"
                      ></div>
                    </template>
                  </div>
                  <div class="flex justify-center w-full" v-if="creationsReactive?.hasMoreCreations">
                    <button
                      class="button dark mb-12 mt-8 mx-auto w-full md:w-96"
                      @click="handleLoadMoreCreations"
                    >
                      Load More
                    </button>
                  </div>
                </div>
                <div v-else-if="creationsReactive.loading">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 my-8">
                    <div
                      class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
                      :style="{ 'padding-bottom': '120%' }"
                    ></div>
                    <div
                      class="placeholder-card overflow-hidden rounded-20px bg-gray-100"
                      :style="{ 'padding-bottom': '120%' }"
                    ></div>
                  </div>
                </div>
                <div v-else class="text-xl text-center py-8 no-collectable-zone">
                  Artist has no SEEN creations yet.
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
      <not-found v-else />
    </container>
  </div>
</template>

<script>
import { ref, computed, watchEffect, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import useWeb3 from "@/connectors/hooks";

import { ArtistService } from "@/services/apiService";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import EditProfile from "@/components/EditProfile.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import Identicon from "@/components/Identicon/Identicon";
import NotFound from "@/components/Common/NotFound"
import {useStore} from "vuex";

import ProductCard from "@/components/ProductCard.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import GiftProductCard from "@/views/profile/components/GiftProductCard.vue";
import { DEFAULT_CHAIN_ID } from "@/constants/ChainIds";

export default {
  name: "Profile",
  components: {
    FencedTitle,
    Container,
    CopyHelper,
    EditProfile,
    SocialLine,
    Identicon,
    NotFound,
    ProductCard,
    ProductCardV3,
    GiftProductCard,
  },
  methods: {
    cropWithExtension: function (text, maxCharacters) {
      const txtLength = text.length; // Length of the incoming text
      const txtLengthHalf = maxCharacters
        ? Math.round(maxCharacters / 2)
        : Math.round(txtLength / 2); // set max txtHalfLength
      return (
        text.substring(0, txtLengthHalf - 1).trim() +
        "..." +
        text.substring(txtLength - txtLengthHalf + 2, txtLength).trim()
      ); //Return the string
    },
    getBackgroundImage(backgroundImage) {
      if(!backgroundImage) {
        // Default background image
        return require('./../../assets/images/default_banner_1.jpeg');
      } else {
        return backgroundImage;
      }
    }
  },
  async setup() {
    const { meta } = useMeta({
      title: "Artist Profile",
    });
    const router = useRouter();
    const assets = ref([]);
    const activeTabIndex = ref(0);

    let data = ref(null);
    const artist = computed(() => data.value ? data.value : false);

    const profileState = reactive({
      loading: true,
    });

    watchEffect(async () => {
      if (router.currentRoute.value.params.artistSlug && DEFAULT_CHAIN_ID) {
        profileState.loading = true;
        const res = await ArtistService.show(router.currentRoute.value.params.artistSlug);
        profileState.loading = false;
        if (!res.data) return;
        meta.title = res.data.name;
        data.value = res.data;
      }
    })

    const isArtistFound = computed(() => {
      return (!!artist.value && artist?.value?.slug);
    });

    const hasArtistData = computed(() => !!artist.value && artist?.value?.slug);

    const socials = computed(() =>
      artist.value && artist.value.socials
        ? artist.value.socials
        : null
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

    const creationsReactive = reactive({
      listOfCollectables: [],
      hasMoreCreations: false,
      loading: true,
    })

    const previousState = reactive({
      lastArtistId: null
    });

    let paginatedCreations;
    watchEffect(async () => {
      if(artist?.value?.id || artist?.value?.id === 0) {
        // If it is the first fetch of collectables OR if the artist ID has changed, start a fresh fetch of creations
        if(!paginatedCreations?.listOfCollectables?.value || artist?.value?.id !== previousState.lastArtistId) {
          paginatedCreations = useDropsWithPagination(6, {artistId: artist?.value?.id});
          previousState.lastArtistId = artist?.value?.id;
          creationsReactive.loading = true;
          await paginatedCreations.load();
          creationsReactive.loading = false;
        }
        creationsReactive.listOfCreations = paginatedCreations.listOfCollectables.value;
        creationsReactive.hasMoreCreations = paginatedCreations.hasMore.value;
      }
    });

    const handleLoadMoreCreations = async () => {
      paginatedCreations.loadMore();
    };

    return {
      artist,
      isArtistFound,
      hasArtistData,
      profileState,
      socials,
      assets,
      creationsReactive,
      handleLoadMoreCreations,
      navigateToCollectable,
      activeTabIndex,
    };
  },
};
</script>

<style scoped lang="scss">
.no-collectable-zone {
  height: 568px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-desktop {
  @apply hidden xl:inline-flex;
  @screen xl {
    @apply w-60 h-60 p-1 rounded-full -mt-30 bg-white inline-flex justify-center items-center;
    left: 35px;
    position: relative;
    box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
  }
}
.avatar-mobile {
  @apply inline-flex xl:hidden w-60 h-60 p-1 rounded-full -mt-30 bg-white inline-flex justify-center items-center;
  left: 50%;
  transform: translateX(-50%);
  position: relative;
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
}
.wallet-address-badge {
  @apply py-1 w-66 font-address;
}
.profile-background {
  height: 300px;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-color: whitesmoke;
  box-shadow: 0px 6px 10px rgba(142, 152, 160, 0.4);
}
.no-avatar {
  @apply h-10;
}
.content-zone {
  @screen xl {
    display: flex;
  }
}
.left-sidebar {
  @screen xl {
    @apply pr-6;
    width: 344px;
  }
  width: 100%;
}
.right-content-area {
  @screen xl {
    width: calc(100% - 344px);
  }
  width: 100%;
}
.tab-container {
  @screen xl {
    @apply mt-4;
  }
}
.sticky-bio {
  position: sticky;
  top: 150px;
}
.bio-description-zone {
  max-height: calc(100vh - 420px);
  overflow-y: auto;
}
</style>

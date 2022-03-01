<template>
  <div class="profile">
    <container class="relative">
      <div v-if="isUserFound || profileState.loading">
        <edit-profile :class="profileUser ? 'mt-8 w-full' : 'mb-8'"
          :userData="profileUser"
          v-if="!profileState.loading"
        ></edit-profile>
        <div
          class="profile-background rounded-xl mt-8"
          :style="{ backgroundImage: `url(${profileUser && getBackgroundImage(profileUser?.banner_image)})` }"
          v-if="profileUser || profileState.loading"
        ></div>
        <div :class="'avatar-mobile'">
          <div
            v-if="hasUserData"
            class="bg-background-gray rounded-full w-full h-full flex justify-center items-center overflow-hidden"
          >
            <div class="profile-avatar" :style="{ backgroundImage: `url(${profileUser?.avatar_image})` }">
              <identicon :size="232" :address="profileUser?.wallet" v-if="profileUser && !profileUser.avatar_image" class="flex justify-center"/>
            </div>
          </div>
        </div>
        <div class="content-zone">
          <div class="left-sidebar">
            <div class="sticky-bio mb-6 xl:mb-12">
              <div :class="'avatar-desktop hidden xl:inline-flex'">
                <div
                  v-if="hasUserData"
                  class="bg-background-gray rounded-full w-full h-full flex justify-center items-center overflow-hidden"
                >
                  <div class="profile-avatar" :style="{ backgroundImage: `url(${profileUser?.avatar_image})` }">
                    <identicon :size="232" :address="profileUser?.wallet" v-if="profileUser && !profileUser.avatar_image" class="flex justify-center"/>
                  </div>
                </div>
              </div>
              <div class="mt-4 flex flex-wrap items-center" :class="profileUser ? 'justify-between' : 'justify-center'">
                <div class="flex justify-start flex-wrap flex-col" v-if="profileUser">
                  <p class="font-bold text-3xl mr-4">{{ profileUser ? profileUser.username : 'New Profile' }}</p>
                  <div class="wallet-address-badge rounded-20px flex justify-between items-center">
                    <copy-helper
                      v-if="hasUserData"
                      :toCopy="profileUser.wallet"
                      :isIconSuffix="true"
                      :text="cropWithExtension(profileUser.wallet, 20)"
                    />
                  </div>
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
                    <div v-else>User has no socials yet</div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-10 md:grid-cols-2 my-2 flex render-line-breaks bio-description-zone" v-if="profileUser">
                <div>
                  {{
                    profileUser?.description ? profileUser.description : "User has no description."
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-content-area">
            <TabView class="tab-container -mx-6 md:mx-0" v-model:activeIndex="activeTabIndex">
              <TabPanel header="Collected">
                <div v-if="profileUser && listOfCollectables && listOfCollectables.length > 0">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 my-8">
                    <template
                      v-for="collectable in listOfCollectables"
                      :key="collectable && collectable.data.id"
                    >
                      <template v-if="collectable != null">
                        <product-card-v3
                          v-if="collectable != null"
                          :collectable="collectable.data"
                          @click="navigateToCollectable(collectable.data.slug, collectable.data.is_slug_full_route, collectable.data.version)"
                        />
                      </template>
                      <product-card-v3-placeholder v-else />
                    </template>
                  </div>
                  <div class="flex justify-center w-full" v-if="listOfCollectables && listOfCollectables.length > 0 && hasMore">
                    <button
                      class="button dark mb-12 mt-8 mx-auto w-full md:w-96"
                      @click="handleLoadMore"
                    >
                      Load More
                    </button>
                  </div>
                </div>
                <div v-else-if="collectablesReactive.loading">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 my-8">
                    <product-card-v3-placeholder />
                    <product-card-v3-placeholder />
                    <product-card-v3-placeholder/>
                    <product-card-v3-placeholder/>
                  </div>
                </div>
                <div v-else class="text-xl text-center py-8 no-collectable-zone">
                  User has not collected any SEEN collectables yet.
                </div>
              </TabPanel>
              <TabPanel header="Created">
                <div v-if="profileUser && creationsReactive?.listOfCreations && creationsReactive.listOfCreations.length > 0 && !creationsReactive.loading">
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
                      <product-card-v3-placeholder v-else />
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
                    <product-card-v3-placeholder/>
                    <product-card-v3-placeholder/>
                    <product-card-v3-placeholder/>
                    <product-card-v3-placeholder/>
                  </div>
                </div>
                <div v-else class="text-xl text-center py-8 no-collectable-zone">
                  User has no SEEN creations yet.
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
import useUser from "@/hooks/useUser";

import { UserService } from "@/services/apiService";
import useUsersCollectionWithPagination from "@/hooks/v3/useUsersCollectionWithPaginationV3.js";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import EditProfile from "@/components/EditProfile.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import Identicon from "@/components/Identicon/Identicon";
import NotFound from "@/components/Common/NotFound"

import ProductCardV3 from "@/components/ProductCardV3.vue";
import ProductCardV3Placeholder from "@/components/ProductCardV3Placeholder.vue";
import { DEFAULT_CHAIN_ID } from "@/constants/ChainIds";

export default {
  name: "Profile",
  components: {
    Container,
    CopyHelper,
    EditProfile,
    SocialLine,
    Identicon,
    NotFound,
    ProductCardV3,
    ProductCardV3Placeholder,
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
      title: "Profile",
    });
    const router = useRouter();
    const route = useRoute();
    const { account } = useWeb3();
    const assets = ref([]);
    const activeTabIndex = ref(0);
    const { user } = useUser();

    const isOwnProfile = computed(() => (account.value === route.params.userAddressOrUsername) || !route.params.userAddressOrUsername);
    const address = route.params.userAddressOrUsername
      ? route.params.userAddressOrUsername
      : account.value;

    let data = ref(null);
    const profileUser = computed(() => isOwnProfile.value ? user.value : data.value);
    const collection = useUsersCollectionWithPagination();

    const profileState = reactive({
      loading: true,
    });

    const collectablesReactive = reactive({
      loading: true,
    })

    watchEffect(async () => {
      if (route.params.userAddressOrUsername && DEFAULT_CHAIN_ID) {
        profileState.loading = true;
        const res = await UserService.get(route.params.userAddressOrUsername);
        profileState.loading = false;
        if (!res.data) return;
        meta.title = res.data.user.username;
        data.value = res.data.user;
        collection.setAddress(res?.data?.user?.wallet);
        collection.setChainId(DEFAULT_CHAIN_ID);
        collection.load();
      }
    })

    watchEffect(() => {
      collectablesReactive.loading = collection.loading;
    })

    const isUserFound = computed(() => {
      console.log((!!profileUser.value) || (isOwnProfile.value && account.value));
      return (!!profileUser.value && profileUser.value?.wallet) || (isOwnProfile.value && account.value);
    });

    const hasUserData = computed(() => !!profileUser.value && profileUser.value?.wallet);

    const socials = computed(() =>
      profileUser.value && profileUser.value.socials
        ? [
            { type: "twitter", url: profileUser.value.socials.twitter },
            { type: "instagram", url: profileUser.value.socials.instagram },
            { type: "website", url: profileUser.value.socials.website },
          ]
        : null
    );

    const handleLoadMore = async () => {
      collection.loadMore();
    };

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

    const listOfCollectables = computed(
      () => collection.listOfCollectables.value
    );

    const hasMore = computed(() => collection.hasMore.value);

    const creationsReactive = reactive({
      listOfCollectables: [],
      hasMoreCreations: false,
      loading: true,
    })

    const previousState = reactive({
      lastUserId: null
    });

    let paginatedCreations;
    watchEffect(async () => {
      if(profileUser.value?.id || profileUser.value?.id === 0) {
        // If it is the first fetch of collectables OR if the user ID has changed, start a fresh fetch of creations
        if(!paginatedCreations?.listOfCollectables?.value || profileUser.value?.id !== previousState.lastUserId) {
          paginatedCreations = useDropsWithPagination(6, {userId: profileUser.value?.id});
          previousState.lastUserId = profileUser.value?.id;
          creationsReactive.loading = true;
          await paginatedCreations.load();
          creationsReactive.loading = false;
        }
        creationsReactive.listOfCreations = paginatedCreations.listOfCollectables.value;
        creationsReactive.hasMoreCreations = paginatedCreations.hasMore.value;
      }
      if(creationsReactive.listOfCreations?.length > 0) {
        // If user has creations, set the creations tab to active
        activeTabIndex.value = 1;
      } else {
        // else use the collected tab
        activeTabIndex.value = 0;
      }
    });

    const handleLoadMoreCreations = async () => {
      paginatedCreations.loadMore();
    };

    return {
      profileUser,
      isUserFound,
      hasUserData,
      profileState,
      socials,
      assets,
      collectablesReactive,
      listOfCollectables,
      creationsReactive,
      hasMore,
      handleLoadMore,
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

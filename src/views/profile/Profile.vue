<template>
  <div class="profile">
    <div
      class="profile-background"
      :style="{ backgroundImage: `url(${user.picture})` }"
      v-if="user && user.image"
    ></div>
    <container class="relative">
      <div v-if="isUserFound">
        <div class="avatar">
          <div
            class="bg-background-gray rounded-full w-full h-full flex justify-center items-center pt-1.5"
          >
            <identicon :size="100" />
          </div>
        </div>
        <div class="mt-4 flex justify-between flex-wrap items-center">
          <div class="flex justify-start flex-wrap">
            <p class="font-bold text-3xl mr-4">{{ user.username }}</p>
            <div class="wallet-address-badge flex justify-between items-center">
              <i class="fas fa-volleyball-ball text-lg"></i>
              <copy-helper
                :toCopy="user.wallet"
                :isIconSuffix="true"
                :text="cropWithExtension(user.wallet, 20)"
              />
            </div>
          </div>
          <edit-profile
            :userData="user"
          ></edit-profile>
        </div>
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 my-8">
          <div>
            {{
              user.description ? user.description : "User has no description."
            }}
          </div>
          <div class="text-xs text-gray-400">
            <div v-if="socials">
              <social-line
                class="my-1"
                :social="social"
                :isVertical="true"
                v-for="social in socials"
                :key="social.url"
              />
            </div>
            <div v-else>User has no socials yet</div>
          </div>
        </div>
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Collection</fenced-title
        >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8" v-if="listOfCollectables && listOfCollectables.length > 0">
          <template
            v-for="collectable in listOfCollectables"
            :key="collectable && collectable.data.id"
          >
            <template v-if="collectable != null">
              <gift-product-card
                v-if="collectable.asGift"
                :collectable="collectable.data"
              />
              <product-card
                v-else
                :collectable="collectable.data"
                @click="
                  navigateToCollectable(collectable.data.contract_address)
                "
              />
            </template>
            <div
              v-else
              class="placeholder-card overflow-hidden rounded-3xl bg-gray-100"
              :style="{ 'padding-bottom': '120%' }"
            ></div>
          </template>

          <div class="flex justify-center">
            <button
              class="button dark mt-20 mx-auto w-full md:w-96"
              v-if="hasMore"
              @click="handleLoadMore"
            >
              Load More
            </button>
          </div>
        </div>
        <div v-else class="text-xl text-center py-8 mb-12">
          User has no collectables yet.
        </div>
      </div>
      <not-found v-else />
    </container>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import useWeb3 from "@/connectors/hooks";

import { UserService } from "@/services/apiService";
import useUsersCollectionWithPagination from "@/hooks/useUsersCollectionWithPagination.js";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import EditProfile from "@/components/EditProfile.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import Identicon from "@/components/Identicon/Identicon";
import NotFound from "@/components/Common/NotFound"
import {useStore} from "vuex";

import ProductCard from "@/components/ProductCard.vue";
import GiftProductCard from "@/views/profile/components/GiftProductCard.vue";

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
  },
  async setup() {
    const { meta } = useMeta({
      title: "Profile",
    });
    const store = useStore()
    const router = useRouter();
    const route = useRoute();
    const { account } = useWeb3();
    const assets = ref([]);

    const isOwnProfile = computed(() => (account.value === route.params.userAddress) || !route.params.userAddress);
    const address = route.params.userAddress
      ? route.params.userAddress
      : account.value;

    let data = ref(null);
    const user = computed(() => isOwnProfile.value ? store.getters['user/user'] : data.value);
    const userLocal = computed(() => store.getters['user/user']);
    const collection = useUsersCollectionWithPagination();
    watchEffect(() => {
      if (isOwnProfile.value && userLocal.value) {
        collection.setAddress(userLocal.value.wallet);
        collection.load();
      }
    })

    if (address && !isOwnProfile.value) {
      const res = await UserService.get(address);
      data.value = res.data.user;
      collection.setAddress(address);
      collection.load();
    }

    const isUserFound = computed(() => !!user.value);

    const socials = computed(() =>
      user.value.socials
        ? [
            { type: "twitter", url: user.value.socials.twitter },
            { type: "website", url: user.value.socials.website },
          ]
        : null
    );

    const handleLoadMore = async () => {
      collection.loadMore();
    };

    const navigateToCollectable = function (address) {
      router.push({
        name: "collectableAuction",
        params: { contractAddress: address },
      });
    };

    const listOfCollectables = computed(
      () => collection.listOfCollectables.value
    );

    const hasMore = computed(() => collection.hasMore.value);

    return {
      user,
      isUserFound,
      socials,
      assets,
      listOfCollectables,
      hasMore,
      handleLoadMore,
      navigateToCollectable,
    };
  },
};
</script>

<style scoped lang="scss">
.avatar {
  @apply w-30 h-30 p-1 rounded-full -mt-15 bg-white inline-flex justify-center items-center;
  border: solid 1px #e6e6e6;
}
.wallet-address-badge {
  @apply pr-3.5 py-1 pl-2 rounded-3xl w-66 font-address;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.15);
}
.profile-background {
  height: 235px;
  width: 100%;
  background-size: cover;
  background-position: center;
}
</style>

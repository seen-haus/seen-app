<template>
  <div class="profile">
    <div class="profile-background" :style="{backgroundImage: `url(${artist.avatar})`}">
    
    </div>
    <container class="relative pb-20">
      <div class="avatar">
        <div class="bg-background-gray rounded-full w-full h-full bg-contain bg-center" :style="{backgroundImage: `url(${artist.avatar})`}">
        </div>
      </div>
      <div class="mt-4 flex justify-between flex-wrap items-center">
        <div class="flex justify-start flex-wrap">
          <p class="font-bold text-3xl mr-4">{{artist.name}}</p>
          <!-- <div class="wallet-address-badge flex justify-between items-center">
            <i class="fas fa-volleyball-ball text-lg"></i>
            <copy-helper :toCopy="user.wallet" :isIconSuffix="true" :text="cropWithExtension(user.wallet, 20)"/>
          </div> -->
        </div>
      </div>
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 my-8">
        <div>
          {{artist?.bio ? artist.bio : 'No biography available.'}}
        </div>
        <div class="text-xs text-gray-400">
          <social-line class="my-1" :social="social" :isVertical="true" v-for="social in artist.socials" :key="social.url" />
        </div>
      </div>
      <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Your collection</fenced-title
      >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-10">
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.contract_address)"
          />
          <div
            v-else
            class="placeholder-card overflow-hidden rounded-3xl bg-gray-100"
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
import {ref, computed} from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import { ArtistService } from "@/services/apiService";
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
  },
  async setup() {
    const { meta } = useMeta({
      title: "Loading...",
    });
    const router = useRouter();
    const {data} = await ArtistService.show(router.currentRoute.value.params.artistSlug);
    const artist = ref(data);
    meta.title = artist.value.name;

    const paginatedCollectables = useDropsWithPagination(artist.value.id);
    await paginatedCollectables.load();
    const hasMore = computed(() => paginatedCollectables.hasMore.value);
    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const navigateToCollectable = function (address) {
      router.push({
        name: "collectableAuction",
        params: { contractAddress: address },
      });
    };

    return {
      artist,
      navigateToCollectable,
      listOfCollectables,
      handleLoadMore,
      hasMore,

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

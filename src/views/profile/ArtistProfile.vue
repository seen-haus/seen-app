<template>
  <div class="profile">
    <div class="profile-background" :style="{backgroundImage: `url(${artist.avatar})`}">
    
    </div>
    <container class="relative">
      <div class="avatar">
        <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center pt-1.5">
          <identicon :size="100"/>
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
          {{artist?.bio ? artist.bio : artist.description}}
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8">
        <!-- <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card /> -->
      </div>
    </container>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import { UserService } from "@/services/apiService"
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import EditProfile from '@/components/EditProfile.vue';
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import Identicon from "@/components/Identicon/Identicon";
import { useRouter } from "vue-router";
import { ArtistService } from "@/services/apiService";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import {ref} from "vue";

// import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "ArtistProfile",
  components: { FencedTitle, Container, CopyHelper, EditProfile, SocialLine, Identicon, /* ProductCard  */},
  methods: {
    cropWithExtension: function(text, maxCharacters) {
      const txtLength = text.length; // Length of the incoming text
      const txtLengthHalf = maxCharacters ? Math.round(maxCharacters / 2) : Math.round(txtLength / 2); // set max txtHalfLength
      return text.substring(0, (txtLengthHalf -1)).trim() + '...' + text.substring((txtLength - txtLengthHalf) + 2, txtLength).trim(); //Return the string
    },
  },
  async setup() {
    const router = useRouter();
    const paginatedCollectables = useDropsWithPagination(router.currentRoute.value.params.artistId);
    await paginatedCollectables.load();
    const {data} = await ArtistService.show(router.currentRoute.value.params.artistId);
    const artist = ref(data);

    return { artist };
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

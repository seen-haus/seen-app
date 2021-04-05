<template>
  <div class="profile">
    <div class="profile-background" :style="{backgroundImage: `url(${user.picture})`}" v-if="user && user.image"></div>
    <container class="relative">
      <div v-if="isUserFound">
        <div class="avatar">
          <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center pt-1.5">
            <identicon :size="100"/>
          </div>
        </div>
        <div class="mt-4 flex justify-between flex-wrap items-center">
          <div class="flex justify-start flex-wrap">
            <p class="font-bold text-3xl mr-4">{{user.username}}</p>
            <div class="wallet-address-badge flex justify-between items-center">
              <i class="fas fa-volleyball-ball text-lg"></i>
              <copy-helper :toCopy="user.wallet" :isIconSuffix="true" :text="cropWithExtension(user.wallet, 20)"/>
            </div>
          </div>
          <edit-profile :userData="user"></edit-profile>
        </div>
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 my-8">
          <div>
            {{user.description ? user.description : 'User has no description.'}}
          </div>
          <div class="text-xs text-gray-400">
            <div v-if="socials">
              <social-line class="my-1" :social="social" :isVertical="true" v-for="social in socials" :key="social.url" />
            </div>
            <div v-else>
              User has no socials yet
            </div>
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
      </div>
      <not-found v-else />
    </container>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import { UserService } from "@/services/apiService"
import { OpenSeaAPIService } from "@/services/apiService"
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import EditProfile from '@/components/EditProfile.vue';
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import Identicon from "@/components/Identicon/Identicon";
import NotFound from "@/components/Common/NotFound"
import { useRoute } from "vue-router";
import useWeb3 from "@/connectors/hooks";
import { ref, computed } from "vue";
import {useStore} from "vuex";

// import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "Profile",
  components: { FencedTitle, Container, CopyHelper, EditProfile, SocialLine, Identicon, NotFound, /* ProductCard  */},
  methods: {
    cropWithExtension: function(text, maxCharacters) {
      const txtLength = text.length; // Length of the incoming text
      const txtLengthHalf = maxCharacters ? Math.round(maxCharacters / 2) : Math.round(txtLength / 2); // set max txtHalfLength
      return text.substring(0, (txtLengthHalf -1)).trim() + '...' + text.substring((txtLength - txtLengthHalf) + 2, txtLength).trim(); //Return the string
    },
  },
  async setup() {
    const store = useStore()
    const route = useRoute();
    const {account} = useWeb3();
    const assets = ref([]);
          debugger; // eslint-disable-line

    const isOwnProfile = computed(() => (account.value === route.params.userAddress) || !route.params.userAddress);
    const address = route.params.userAddress ? route.params.userAddress : account.value;

    let data;
    if (address) {
      const res = await UserService.get(address);
      data = res.data;
    }

    if (isOwnProfile.value) {
      store.dispatch('user/setUser', data ? data.user : null);
    }
    const user = isOwnProfile.value ? computed(() => store.getters['user/user']) : ref(data ? data.user : null);
    const isUserFound = computed(() => !!user.value);

    if (isUserFound.value) {
      // TODO JASA IMPLEMENT
      assets.value = await OpenSeaAPIService.getProfileEntries('0x43392235b6b13e0ce9d4b6cc48c8f5d2b46bff5f');
    }

    const socials = computed(() => user.value.socials ?
      [{type: 'twitter', url: user.value.socials.twitter}, {type: 'website', url: user.value.socials.website}] :
      null
    );

    return {
      user,
      isUserFound,
      socials,
      assets
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

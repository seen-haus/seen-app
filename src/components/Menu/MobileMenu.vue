<template>
  <nav id="menu" class="min-h-screen slideout-menu bg-black text-white pt-13">
    <button class="button w-full text-white" @click="closeMobileMenu">CLOSE</button>
    <router-link :to="{ name: 'spaaaaace'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <img src="@/assets/icons/icon--spacenft.svg" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-1 inline-flex" alt="SEEN">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Space NFT</span>
    </router-link>
    <router-link :to="{ name: 'auctions'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Auctions</span>
    </router-link>
    <router-link :to="{ name: 'editions'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Editions</span>
    </router-link>
    <router-link :to="{ name: 'artists'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Artists</span>
    </router-link>
    <router-link :to="{ name: 'leaderboard'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Leaderboard</span>
    </router-link>
    <wallet-button class="pl-8"/>  
  </nav>
</template>

<script>
import {useStore} from "vuex";
import {watchEffect, onMounted, ref, computed} from "vue";
import Slideout from "slideout";
import WalletButton from "@/components/WalletButton";

export default {
  name: "MobileMenu",
  components: {WalletButton},
  setup() {
    const store = useStore()
    let slideout = ref(null)
    let isOpen = computed(() => {
      return store.getters['application/mobileMenu']
    })

    watchEffect(() => {
      if (!slideout.value) {
        return
      }
      if (isOpen.value && slideout.value) {
        slideout.value.open()
      }
      if (!isOpen.value && slideout.value) {
        slideout.value.close()
      }
    }, {
      flush: 'post'
    })

    onMounted(() => {
      slideout.value = new Slideout({
        panel: document.getElementById('main'),
        menu: document.getElementById('menu'),
        padding: 256,
        tolerance: 70,
        touch: false,
      })
    })

    return {closeMobileMenu: () => store.commit('application/CLOSE_MOBILE_MENU')} 
  },
}
</script>

<style scoped lang="scss">
  .routing-link:hover {
    img {
      filter: brightness(0) invert(1) !important;
    }
  }
</style>

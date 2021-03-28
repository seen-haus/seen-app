<template>
  <nav id="menu" class="min-h-screen slideout-menu bg-black text-white pt-13">
    <button class="button w-full text-white" @click="closeMobileMenu">CLOSE</button>
    <!-- <router-link :to="{ name: 'spaaaaace'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <img src="@/assets/icons/icon--spacenft.svg" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-1 inline-flex" alt="SEEN">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Space NFT</span>
    </router-link> -->
    <router-link :to="{ name: 'drops'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <img src="@/assets/icons/icon-fire.svg" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-2 inline-flex icon-fire" alt="SEEN">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Drops</span>
    </router-link>
    <router-link :to="{ name: 'artists'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Artists</span>
    </router-link>
    <router-link :to="{ name: 'collectors'}" v-slot="{isActive}" class="routing-link block py-1 px-8">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Collectors</span>
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

  .icon-fire {
    height: 22px;
    filter: brightness(0) saturate(100%) opacity(0.4);
  }
</style>

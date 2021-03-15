<template>
  <div>
    <top-header-bar/>
    <div :class="headerClasses">
      <container>
      <header>
        <div class="flex items-center justify-between">
          <div id="logo" class="flex items-center">
            <img src="@/assets/images/logo--black.png"  class="mr-4" alt="">
          </div>
          <div class="items-center hidden lg:flex justify-between">
            <desktop-menu/>
            <wallet-button/>            
          </div>
          <nav class="lg:hidden">
            <button
              @click="openMobileMenu"
              class="cursor-pointer button primary"
            >
              menu
            </button>
          </nav>
        </div>
      </header>
    </container>
    </div>
  </div>
</template>

<script>
import DesktopMenu from "@/components/Menu/DesktopMenu";
import WalletButton from "@/components/WalletButton";
import Container from "@/components/Container";
import TopHeaderBar from "@/components/TopHeaderBar";
import {useStore} from "vuex"

export default {
  name: 'AppHeader',
  components: {TopHeaderBar, Container, WalletButton, DesktopMenu},
  setup() {
    const store = useStore();
    return {openMobileMenu: () => store.commit('application/OPEN_MOBILE_MENU')};
  },
  computed: {
    headerClasses() {
      return this.$route.fullPath.match('/profile') ? 'pt-10 pb-14 bg-background-gray' : 'py-10';
    }
  }
}
</script>

<style scoped>

</style>

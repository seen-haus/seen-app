<template>
  <div>
    <top-header-bar/>
    <div :class="darkMode ? [headerClasses, 'text-white'].join(' ') : headerClasses">
      <container>
        <header>
          <div class="flex items-center flex-wrap justify-between">
            <router-link to="/">
              <div id="logo" class="flex items-center" style="width:100%; max-width: 208px">
                <img v-if="darkMode" src="@/assets/images/seen-white.svg" class="mr-4" alt="">
                <img v-if="!darkMode" src="@/assets/images/seen-black.svg" class="mr-4" alt="">
              </div>
            </router-link>
            <div class="items-center hidden lg:flex lg:flex-grow justify-between">
              <desktop-menu class="flex justify-center flex-1"/>
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
import { computed } from "vue";
import {useStore} from "vuex";

import DesktopMenu from "@/components/Menu/DesktopMenu";
import WalletButton from "@/components/WalletButton";
import Container from "@/components/Container";
import TopHeaderBar from "@/components/TopHeaderBar";

export default {
  name: 'AppHeader',
  components: {TopHeaderBar, Container, WalletButton, DesktopMenu},
  setup() {
    const store = useStore();
    const darkMode = computed(() => {
      return store.getters['application/darkMode']
    });
    return {
      openMobileMenu: () => store.commit('application/OPEN_MOBILE_MENU'),
      darkMode
    };
  },
  computed: {
    headerClasses() {
      return this.$route.fullPath.match('/profile') ? 'pt-10 pb-14 bg-background-gray' : 'py-10';
    }
  }
}
</script>

<style lang="scss" scoped>
#logo img {
  width: auto;
  max-width: 180px;
  height: 39px;
}

@screen lg {
  #logo img {
    width: auto;
    max-width: 208px;
    height: 39px;
  }
}

</style>

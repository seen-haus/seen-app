<template>
  <div>
    <top-header-bar/>
    <div :class="darkMode ? [headerClasses, 'text-white', 'dark-mode-section'].join(' ') : [headerClasses, 'transparent-border-section'].join(' ')">
      <container>
        <header>
          <div class="flex items-center flex-wrap justify-between">
            <router-link to="/">
              <div id="logo" class="flex items-center" style="width:100%; max-width: 208px">
                <img :class="!darkMode && 'hidden'" src="@/assets/images/seen-logo-white.svg" class="mr-4" alt="">
                <img :class="darkMode && 'hidden'" src="@/assets/images/seen-logo-black.svg" class="mr-4" alt="">
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
import {useStore} from "vuex";

import DesktopMenu from "@/components/Menu/DesktopMenu";
import WalletButton from "@/components/WalletButton";
import Container from "@/components/Container";
import TopHeaderBar from "@/components/TopHeaderBar";
import useDarkMode from "@/hooks/useDarkMode";

export default {
  name: 'AppHeader',
  components: {TopHeaderBar, Container, WalletButton, DesktopMenu},
  setup() {
    const store = useStore();
    const { darkMode } = useDarkMode();

    return {
      openMobileMenu: () => store.commit('application/OPEN_MOBILE_MENU'),
      darkMode
    };
  },
  computed: {
    headerClasses() {
      return this.$route.fullPath.match('/profile') ? 'py-0.5 header-borders' : 'py-0.5 header-borders';
    }
  }
}
</script>

<style lang="scss" scoped>
#logo img {
  width: auto;
  max-width: 133px;
}

.header-borders {
  border-top: 1px solid #DFE4E9;
  border-bottom: 1px solid #DFE4E9;
}

@screen lg {
  #logo img {
    width: auto;
    max-width: 133px;
  }
}

</style>

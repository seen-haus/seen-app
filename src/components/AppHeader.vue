<template>
  <div>
    <top-header-bar/>
    <div :class="darkMode ? [headerClasses, 'text-white', 'dark-mode-section', 'header-borders-dark-mode'].join(' ') : [headerClasses, 'transparent-border-section'].join(' ')">
      <container>
        <header>
          <div class="flex items-center flex-wrap justify-between header-size">
            <router-link to="/">
              <div id="logo" class="flex items-center" style="width:100%; max-width: 208px">
                <img :class="!darkMode && 'hidden'" src="@/assets/images/seen-logo-white.svg" alt="">
                <img :class="darkMode && 'hidden'" src="@/assets/images/seen-logo-black.svg" alt="">
              </div>
            </router-link>
            <div class="items-center hidden lg:flex lg:flex-grow justify-between">
              <desktop-menu class="flex justify-center flex-1 header-desktop flex-center-vertical"/>
              <!-- <wallet-button class="disable-horizontal-padding"/> -->
            </div>
            <!-- <nav class="lg:hidden">
              <button
                  @click="openMobileMenu"
                  class="cursor-pointer button primary"
              >
                menu
              </button>
            </nav> -->
          </div>
        </header>
      </container>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";

import DesktopMenu from "@/components/Menu/DesktopMenu";
import Container from "@/components/Container";
import TopHeaderBar from "@/components/TopHeaderBar";
import useDarkMode from "@/hooks/useDarkMode";

export default {
  name: 'AppHeader',
  components: {TopHeaderBar, Container, DesktopMenu},
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
      return this.$route.fullPath.match('/profile') ? 'header-borders' : 'header-borders';
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

.header-borders-dark-mode {
  border-top: 1px solid #262626!important;
  border-bottom: 1px solid #262626!important;
}

@screen lg {
  #logo img {
    width: auto;
    max-width: 133px;
  }
}

.header-size {
  height: 89px;
}

.header-desktop {
  height: 88px;
}
</style>

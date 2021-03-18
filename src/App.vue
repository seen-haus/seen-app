<template>
  <web3-provider>
    <!--  Modals -->
    <wallet-modal/>
    <!--  Modals END -->
    <mobile-menu/>
    <main id="main" class="flex flex-col justify-between min-h-screen z-10 bg-white text-black font-body">
     <div class="flex flex-col">
      <app-header/>
        <div class="router-wrap">
          <router-view/>
        </div>
     </div>
      <app-footer/>
    </main>
  </web3-provider>
</template>

<script>
import Web3Provider from "@/connector/Web3Provider"
import WalletModal from "@/components/WalletModal/WalletModal"
import MobileMenu from "@/components/Menu/MobileMenu";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {useStore} from "vuex"

export default {
  name: 'App',
  components: {AppFooter, AppHeader, MobileMenu, WalletModal, Web3Provider},
  setup() {
    const store = useStore();
    const getExchangeRates = () => {
      store.dispatch('application/getExchangeRates')
    };
    getExchangeRates();
  }
}
</script>
<style lang="scss" scoped>
.router-wrap {
  min-height: calc(100vh - 298px);
}
</style>

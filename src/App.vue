<template>
  <metainfo>
    <template v-slot:title="{ content }"
      >{{ content === "Home" ? "" : content + " | " }}SEEN.HAUS</template
    >
    <template name="banana" v-slot="{ content }">{{ content }}</template>
  </metainfo>
  <web3-provider>
    <!--  Modals -->
    <wallet-modal />
    <!--  Modals END -->
    <mobile-menu />
    <winner-info></winner-info>
    <main
      id="main"
      class="flex flex-col justify-between min-h-screen z-10 bg-white text-black font-body"
    >
      <div class="flex flex-col">
        <app-header />
        <Suspense>
          <div class="router-wrap">
            <router-view />
          </div>
        </Suspense>
      </div>
      <app-footer />
    </main>
  </web3-provider>
</template>

<script>
import { useStore } from "vuex";
import { useMeta, useActiveMeta } from "vue-meta";

import Web3Provider from "@/connector/Web3Provider";
import WalletModal from "@/components/WalletModal/WalletModal";
import MobileMenu from "@/components/Menu/MobileMenu";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import WinnerInfo from "@/components/WinnerInfo";

export default {
  name: "App",
  components: {
    AppFooter,
    AppHeader,
    MobileMenu,
    WalletModal,
    Web3Provider,
    WinnerInfo,
  },
  setup() {
    const { meta } = useMeta({
      title: "SEEN.HAUS",
      meta: [
        {
          name: "keywords",
          content: "seen, seen.haus",
        },
        {
          name: "robots",
          content: "INDEX,FOLLOW",
        },
        {
          name: "description",
          content:
            "seen.haus is merging the digital and physical worlds through non-fungible token (NFT) and tangible product auctions",
        },
      ],
    });
    const metadata = useActiveMeta();
    const store = useStore();
    const getExchangeRates = () => {
      store.dispatch("application/getExchangeRates");
    };
    getExchangeRates();

    return {
      metadata,
    };
  },
};
</script>
<style lang="scss" scoped>
.router-wrap {
  min-height: calc(100vh - 298px);
}
</style>

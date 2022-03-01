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
    <notifications-modal />
    <network-modal/>
    <transaction-modal />
    <!--  Modals END -->
    <mobile-menu/>
    <Toast />
    <winner-info></winner-info>
    <main
      id="main"
      class="flex flex-col justify-between min-h-screen z-10 text-black font-body"
      :class="darkMode ? 'dark-mode-background' : 'light-mode-background'"
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
import useWeb3 from "@/connectors/hooks"
import {watchEffect} from 'vue';
import {useStakingContract, useTokenContract} from "@/hooks/useContract";
import useDarkMode from '@/hooks/useDarkMode';

import Web3Provider from "@/connector/Web3Provider";
import WalletModal from "@/components/WalletModal/WalletModal";
import NotificationsModal from "@/components/NotificationsModal/NotificationsModal";
import NetworkModal from "@/components/NetworkModal/NetworkModal";
import TransactionModal from "@/components/TransactionModal/TransactionModal";
import MobileMenu from "@/components/Menu/MobileMenu";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import WinnerInfo from "@/components/WinnerInfo";
import useUser from '@/hooks/useUser.js'
import useSigner from "@/hooks/useSigner";
import {formatEther} from "@ethersproject/units";

export default {
  name: "App",
  components: {
    AppFooter,
    AppHeader,
    MobileMenu,
    WalletModal,
    NotificationsModal,
    NetworkModal,
    TransactionModal,
    Web3Provider,
    WinnerInfo,
  },
  setup() {
    const { account, provider } = useWeb3();
    const store = useStore();
    let accountCurrent = null;

    const { darkMode } = useDarkMode();

    watchEffect(async () => {
      if (account.value && account.value !== accountCurrent) {
        const signer = useSigner();
        if (signer) {
          // TODO: Uncomment next line, delete one after it, uncomment third line and last line also.
          const tokenContract = useTokenContract('0xCa3FE04C7Ee111F0bbb02C328c699226aCf9Fd33');
          const seenBalance = await tokenContract.balanceOf(account.value);
          accountCurrent = account.value;
          const ethBalance = await signer.getBalance();
          const stakeContract = useStakingContract();
          const xSeenBalance = await stakeContract.balanceOf(account.value);
          const xSeenTotalSupply = await stakeContract.totalSupply();
          const xSeenTotalSeenBalance = await tokenContract.balanceOf(process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS)
          store.dispatch('application/setBalance', {
            eth: formatEther(ethBalance),
            seen: formatEther(seenBalance),
            xSeen: formatEther(xSeenBalance),
            xSeenTotalSupply: formatEther(xSeenTotalSupply),
            xSeenTotalSeenBalance: formatEther(xSeenTotalSeenBalance),
            xSeenToSeenRatio: xSeenTotalSeenBalance/(xSeenTotalSupply)});
        }
      }
    });
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
          content: "seen.haus is merging the digital and physical worlds through non-fungible token (NFT) and tangible product auctions",
        }
      ],
    });
    const metadata = useActiveMeta();
    const getExchangeRates = () => {
      store.dispatch("application/getExchangeRates");
    };
    getExchangeRates();
    useUser();
    return {
      metadata,
      darkMode,
    };
  },
};
</script>
<style lang="scss" scoped>
.router-wrap {
  min-height: calc(100vh - 298px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

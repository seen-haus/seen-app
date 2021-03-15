<template>
  <div class="py-3 relative">
    <button v-if="!account" class="cursor-pointer button primary flex-shrink-0" @click="openWalletModal"><i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet</button>
    
 
    <button v-if="account" @click="isOpen = !isOpen" class="tooltip-target b3 cursor-pointer button primary flex items-center wallet">
       <identicon/> <span class="ml-2">{{ shortenAddress('0x397Fb10C9a36C780Ca3D7dB90B49c78D5D1b04bE') }}</span></button>
    <div class="dropdown-menu" v-if="isOpen">
      <div class="arrow-up"></div>
      <div class="py-6 px-8 bg-background-gray rounded-t-lg">
        <p class="text-xs font-bold text-grey-9">YOUR WALLET BALANCE</p>
        <p class="text-3xl font-bold">5323.32 <span class="text-lg font-normal">ETH</span></p>
        <p class="text-sm text-grey-9">$2442.55</p>
      </div>
      <div>
        <button class="button dropdown-btn">
           <img src="@/assets/icons/icon--person.svg" class="cursor-pointer mr-2" alt="SEEN"> View Your Profile
        </button>
        <div class="mx-8 h-0.5 bg-background-gray"></div>
        <button class="button dropdown-btn">
           <img src="@/assets/icons/icon--disconnect.svg" class="cursor-pointer mr-2" alt="SEEN"> Disconnect
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import useWeb3 from "@/connectors/hooks"
import {useStore} from "vuex"
import Identicon from "@/components/Identicon/Identicon"
import {shortenAddress} from "@/services/utils/index"
import VTooltip from 'v-tooltip';

export default {
  name: 'WalletButton',
  components: {Identicon, VTooltip},
  data() {
    return {
      isOpen: true
    }
  },
  setup() {
    const {error, account} = useWeb3();
    const store = useStore();
    const openWalletModal = () => {
      store.dispatch('application/openModal', 'WalletModal')
    };

    return {
      error,
      account,
      openWalletModal,
      shortenAddress
    }
  }
}
</script>

<style scoped lang="scss">
  .dropdown-menu {
    @apply absolute w-80 rounded-lg mt-5 z-10;
    box-shadow: 0 2px 36px 0 rgba(0, 0, 0, 0.24);
    right: 0;
  }
  .arrow-up {
    width: 0; 
    height: 0;
    position: absolute;
    top: -.5rem;
    right: 5rem;
    border-left:.5rem solid transparent;
    border-right: .5rem solid transparent;
    border-bottom: .5rem solid #F5F4F3;
  }
</style>

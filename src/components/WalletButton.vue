<template>
  <div class="py-3 relative">
    <button v-if="!account" class="cursor-pointer button primary flex-shrink-0" @click="openWalletModal"><i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet</button>


    <button v-if="account" @click="isOpen = !isOpen" class="cursor-pointer button primary flex items-center wallet">
       <identicon/> <span class="ml-2">{{ shortenAddress('0x397Fb10C9a36C780Ca3D7dB90B49c78D5D1b04bE') }}</span></button>
    <div class="dropdown-menu" v-if="isOpen">
      <div class="arrow-up"></div>
      <div class="py-6 px-8 bg-background-gray lg:rounded-t-lg">
        <p class="text-xs font-bold text-grey-9">YOUR WALLET BALANCE</p>
        <p class="text-3xl font-bold text-black">5323.32 <span class="text-lg font-normal">ETH</span></p>
        <p class="text-sm text-grey-9">$2442.55</p>
      </div>
      <div class="lg:bg-white lg:rounded-b-lg">
        <button class="button dropdown-btn" @click="openWalletModal">
           <img src="@/assets/icons/icon--person.svg" class="cursor-pointer mr-2" alt="SEEN"> View Your Profile
        </button>
        <div class="mx-8 h-0.5 bg-background-gray"></div>
        <button class="button dropdown-btn" @click="handleDisconnect">
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
import {ref} from 'vue'


export default {
  name: 'WalletButton',
  components: {Identicon},
  setup() {
    const {error, account, deactivate} = useWeb3();
    const store = useStore();
    let isOpen = ref(false);
    const openWalletModal = () => {
      isOpen.value = false;
      store.dispatch('application/openModal', 'WalletModal')
    };
    const handleDisconnect = () => {
      isOpen.value = false;
      deactivate();
    };

    return {
      error,
      account,
      openWalletModal,
      shortenAddress,
      handleDisconnect,
      isOpen
    }
  }
}
</script>

<style scoped lang="scss">
  .dropdown-menu {
    @apply absolute w-64 lg:w-80 lg:rounded-lg mt-5 z-10 right-0;
    box-shadow: 0 2px 36px 0 rgba(0, 0, 0, 0.24);
  }
  .arrow-up {
    @apply hidden lg:block -top-2 absolute w-0 h-0 right-20;
    border-left:.5rem solid transparent;
    border-right: .5rem solid transparent;
    border-bottom: .5rem solid #F5F4F3;
  }
</style>

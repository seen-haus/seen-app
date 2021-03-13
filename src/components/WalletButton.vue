<template>
  <div class="py-3">
    <button v-if="!account" class="cursor-pointer button primary flex-shrink-0" @click="openWalletModal"><i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet</button>
    <button v-else class="cursor-pointer flex items-center" @click="openWalletModal"> <identicon/> <span class="ml-2">{{ shortenAddress(account) }}</span></button>
  </div>
</template>

<script>
import useWeb3 from "@/connectors/hooks"
import {useStore} from "vuex"
import Identicon from "@/components/Identicon/Identicon"
import {shortenAddress} from "@/services/utils/index"

export default {
  name: 'WalletButton',
  components: {Identicon},
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

<style scoped>

</style>

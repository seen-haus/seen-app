<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm">Connected with {{ name }}</div>
      <button @click="openOptions">Change</button>
    </div>
    <div class="flex items-center mb-4">
      <span class="mr-2"><identicon/></span> <span class="text-xl">{{ account && shortenAddress(account) }}</span>
    </div>
    <div class="text-xs text-gray-600">
      <copy-helper :to-copy="account" text="Copy Address" class="cursor-pointer"/>
      <a :href="getEtherscanLink(chainId, account, 'address')" target="_blank"><i class="fas fa-external-link-alt"></i> View on Etherscan</a>
    </div>
  </div>
</template>

<script>

import useWeb3 from "@/connectors/hooks";
import {SUPPORTED_WALLETS} from "@/connectors/constants";
import Identicon from "@/components/Identicon/Identicon";
import {shortenAddress, getEtherscanLink} from "@/services/utils/index";
import CopyHelper from "@/components/CopyHelper/CopyHelper";

export default {
  name: "AccountView",
  components: {CopyHelper, Identicon},
  setup(props, {emit}) {
    const {chainId, account, connector} = useWeb3()

    const {ethereum} = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
        .filter(
            k =>
                SUPPORTED_WALLETS[k].connector === connector && (isMetaMask === (k === 'METAMASK'))
        )
        .map(k => SUPPORTED_WALLETS[k].name)[0]
    const openOptions = () => {
      emit('changeView', 'options');
    }
    return {
      name,
      account,
      chainId,
      openOptions,
      shortenAddress,
      getEtherscanLink
    }
  }
}
</script>

<style scoped>

</style>

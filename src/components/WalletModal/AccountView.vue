<template>
  <div class="-mb-8 pt-9 relative">
    <div class="flex justify-center text-grey-9">
      <div class="avatar absolute">
        <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center">
          <img src="@/assets/icons/avatar.svg" class="h-16 cursor-pointer" alt="SEEN">
        </div>
      </div>
      <button class="text-sm mb-8"><i class="fas fa-pencil-alt"></i> Change Avatar</button>
    </div>
    <div class="mb-4">
      <div class="text-xs font-bold mb-3">YOUR NAME</div>
      <div class="flex justify-between">
        <div class="outlined-input flex justify-between h-15 flex-grow mr-3">
          <input type="text" placeholder="John Doe" class="text-sm"/>
        </div>
        <button class="button dark account-button w-45">Change Name</button>
      </div>
      <div class="my-8 h-0.5 bg-background-gray"></div>
    </div>
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="text-xs font-bold mb-3 uppercase">Connected with {{ name }}</div>
        <div class="flex">
          <span class="mr-2"><identicon/></span> <span class="text-lg">{{ account && shortenAddress(account) }}</span>
        </div>
      </div>
      <div>
        <button class="button dark account-button w-45" @click="openOptions">Change Wallet</button>
      </div>
    </div>
    <div class="text-xs text-gray-600">
      <copy-helper :to-copy="account" text="Copy Address" class="cursor-pointer mr-4 text-grey-9"/>
      <a :href="getEtherscanLink(chainId, account, 'address')" class="text-grey-9" target="_blank"><i class="fas fa-external-link-alt"></i> View on Etherscan</a>
    </div>
    <div class="text-sm bg-background-gray rounded-lg mt-6 mb-8 transactions-box">
      <p class="text-grey-9 p-5 text-center">Your transactions will appear here...</p>
    </div>
    <div class="newsletter bg-black py-4 px-8 text-white align-center -mx-8 rounded-b-lg">
      <div class="w-full py-4 inline-flex flex-col justify-center text-center">
        <p class="text-2xl mb-1 font-bold">Be the first to to hear about upcoming drops!</p>
        <p class="color-white opacity-50 text-md">Join our newsletter TODAY!</p>
      </div>
      <div class="w-full py-4 md:inline-flex">
        <input type="text" class="mr-3 text-black w-full h-13 text-md pl-4 rounded inline-flex flex-grow" placeholder="Your e-mail">
        <button class="cursor-pointer primary button mt-3 md:mt-0">
          Join&nbsp;Newsletter
        </button>
      </div>
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

<style scoped lang="scss">
.avatar {
  @apply w-30 h-30 p-1 rounded-full -mt-15 bg-white inline-flex justify-center items-center;
  border: solid 1px #e6e6e6;
  top: -32px;
}
.transactions-box {
  border: solid 1px #e6e6e6;
}
</style>

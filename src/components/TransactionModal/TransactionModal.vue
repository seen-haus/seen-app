<template>
  <modal :visible="isOpen" class="rounded-lg">
    <modal-content class="rounded-b-lg">
      <div class="w-full rounded-container flex items-center" v-if="!pendingTransactionHash">
          <i
              class="fas fa-wallet transform rotate-12 text-3xl icon-right mr-6"
              :class="'text-gray-500'"
          ></i>
          <div class="text-sm font-bold">
              Please review the pending interaction in your Ethereum wallet provider (e.g. MetaMask).
          </div>
      </div>
      <div v-if="pendingTransactionHash" class="flex-col flex">
          <ProgressSpinner />
          <sub-title
              class="text-black hidden lg:flex pt-6 auto-margins"
              text-align="center"
              fontSize="24px"
          >
            Awaiting Transaction Completion
          </sub-title>
          <light-typography>
            <a target="_blank" rel="noopener noreferrer" :href="getEtherscanLink(etherscanLinkChainId, pendingTransactionHash, 'transaction')" class="green-link">View on Etherscan</a>
          </light-typography>
      </div>
    </modal-content>
  </modal>
</template>

<script>
import {computed} from "vue"

import {useStore} from "vuex"

import Modal from "@/components/Modal/Modal"
import ModalContent from "@/components/Modal/Content"
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

import { getEtherscanLink } from "@/services/utils";

import useWeb3 from "@/connectors/hooks";

export default {
  name: "NotificationsModal",
  components: {
    ModalContent,
    Modal,
    SubTitle,
    LightTypography,
  },
  setup() {
    const name = 'TransactionModal'

    const store = useStore();

    const { chainId } = useWeb3()

    const isOpen = computed(() => store.getters['application/openModal'] === name);
    const pendingTransactionHash = computed(() => store.getters['application/pendingTransactionHash']);
    const etherscanLinkChainId = computed(() => chainId?.value ? Number(chainId.value) : 1);

    return {
      isOpen,
      pendingTransactionHash,
      getEtherscanLink,
      etherscanLinkChainId,
    }
  }
}
</script>

<style scoped>

</style>

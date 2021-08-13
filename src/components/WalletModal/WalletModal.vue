<template>
  <modal :visible="isOpen" class="rounded-lg">
    <modal-header @back="handleBack" :is-profile-page="view === views.ACCOUNT" :has-back-button="hasBackButton" class="rounded-t-lg font-title">{{ title }}</modal-header>
    <modal-content class="rounded-b-lg">
      <div>
        <account-view v-if="view === views.ACCOUNT" @change-view="setView"/>
        <options-view v-if="view === views.OPTIONS" @change-view="setView"/>
        <pending-view v-if="view === views.PENDING" @change-view="setView"/>
      </div>
    </modal-content>
  </modal>
</template>

<script>
import {useStore} from "vuex"
import {ref, computed, watchEffect} from "vue"
import Modal from "@/components/Modal/Modal"
import ModalHeader from "@/components/Modal/Header"
import ModalContent from "@/components/Modal/Content"
import useWeb3 from "@/connectors/hooks";
import AccountView from "@/components/WalletModal/AccountView";
import OptionsView from "@/components/WalletModal/OptionsView";
import PendingView from "@/components/WalletModal/PendingView";
const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account',
  PENDING: 'pending'
}
export default {
  name: "WalletModal",
  components: {
    PendingView,
    OptionsView,
    AccountView,
    ModalHeader,
    ModalContent,
    Modal
  },
  setup() {
    const store = useStore()
    const name = 'WalletModal'
    const connectOnlyName = 'WalletModalConnectOnly'
    const {account} = useWeb3();
    const view = ref(WALLET_VIEWS.OPTIONS)
    if (account.value) {
      view.value = WALLET_VIEWS.ACCOUNT;
    }
    const handleBack = () => {
      view.value = WALLET_VIEWS.OPTIONS
    }
    const setView = (value) => {
      view.value = value
    }
    const title = computed(() => view.value === WALLET_VIEWS.ACCOUNT
        ? 'Edit Profile'
        : (view.value === WALLET_VIEWS.PENDING ? '' : (account.value ? '' : 'Connect your wallet')))
    const isOpen = computed(() => store.getters['application/openModal'] === name || store.getters['application/openModal'] === connectOnlyName);
    watchEffect(() => {
      if (isOpen.value && account.value) {
        view.value = WALLET_VIEWS.ACCOUNT
      }
    })
    watchEffect(() => {
      if (isOpen.value && !account.value) {
        view.value = WALLET_VIEWS.OPTIONS
      }
    })
    const hasBackButton = computed(() => view.value === WALLET_VIEWS.PENDING
        || view.value === WALLET_VIEWS.ACCOUNT);
    return {
      views: WALLET_VIEWS,
      isOpen,
      view,
      handleBack,
      hasBackButton,
      title,
      setView
    }
  }
}
</script>

<style scoped>
</style>
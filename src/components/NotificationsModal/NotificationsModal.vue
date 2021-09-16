<template>
  <modal :visible="isOpen" class="rounded-lg">
    <modal-header
      :additionalDismissFunctionality="dismissFunction"
      class="rounded-t-lg font-title"
    >
      {{ title }}
    </modal-header>
    <modal-content class="rounded-b-lg">
      <notification-manager-form :isModal="true"/>
    </modal-content>
  </modal>
</template>

<script>
import {computed} from "vue"

import {useStore} from "vuex"

import Modal from "@/components/Modal/Modal"
import ModalHeader from "@/components/Modal/Header"
import ModalContent from "@/components/Modal/Content"

import useWeb3 from "@/connectors/hooks";

import NotificationManagerForm from "../NotificationManagerForm.vue";

export default {
  name: "NotificationsModal",
  components: {
    ModalHeader,
    ModalContent,
    Modal,
    NotificationManagerForm,
  },
  setup() {
    const name = 'NotificationsModal'

    const store = useStore();
    const { account } = useWeb3();

    const dismissFunction = () => { account?.value && localStorage.setItem(`hasDismissedNotificationModal-${account?.value}`, true) }

    const title = 'Notification Manager';
    const isOpen = computed(() => store.getters['application/openModal'] === name);

    return {
      isOpen,
      title,
      dismissFunction,
    }
  }
}
</script>

<style scoped>

</style>
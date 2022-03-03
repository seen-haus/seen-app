<template>
  <button class="button dark inline-flex" @click="openEditProfileModal" v-if="isEditProfileButtonShown">
    <i class="fas fa-pencil-alt mr-2 text-xl icon-left text-white"></i>
    {{user ? 'Edit Profile' : 'Create Profile'}}
  </button>
</template>

<script>
import {ref, computed} from 'vue';
import useWeb3 from "@/connectors/hooks";
import {useStore} from "vuex";


export default {
  name: "EditProfile",
  props: {
    userData: Object,
  },
  setup(props) {
    const store = useStore()
    const user = computed(() => props.userData);
  
    const { account } = useWeb3();
    // username, description, twitter, website, sig
    const isEditProfileButtonShown = computed(() => account && account.value && ((account.value.toLowerCase() === user.value?.wallet.toLowerCase()) || !user.value));

    const openEditProfileModal = () => {
      store.dispatch('application/openModal', 'WalletModal');
    }
    
    return {
      user,
      isEditProfileButtonShown,
      openEditProfileModal,
    };
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <button class="button dark inline-flex" @click="openEditProfileModal" v-if="isEditProfileButtonShown">
    <i class="fas fa-pencil-alt mr-2 text-xl icon-left text-white"></i>
    Edit Profile
  </button>
  <Dialog v-model:visible="isEditProfileModalShown" :style="{width: '36rem'}" :modal="true" :closable="true">
    <template #header>
      <h3 class="font-bold text-3xl text-black text-center block w-full ellipsis">{{user.username ? user.username : user.wallet}}</h3>
    </template>
    <form @submit="onSubmit" class="font-semibold uppercase text-md text-black">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-name">Name</label>
          <input type="text" id="winner-name" class="w-full outlined-input mt-2" autocomplete="given-name" v-model="firstNameField.value" placeholder="Your name" />
          <span>{{ firstNameField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="winner-last-name">Last name</label>
          <input type="text" id="winner-last-name" class="w-full outlined-input mt-2" autocomplete="family-name" v-model="lastNameField.value" placeholder="Your surname" />
          <span>{{ lastNameField.errors[0] }}</span>
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-description">Description</label>
        <input type="phone" id="winner-description" class="w-full outlined-input mt-2" autocomplete="description" v-model="descriptionField.value" placeholder="Your description" />
        <span>{{ descriptionField.errors[0] }}</span>
      </div>
        
      <div class="flex items-center justify-center mb-4 mt-8">
        <button type="submit" class="cursor-pointer primary button mt-3 md:mt-0">
          Submit
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import {ref, reactive, computed} from 'vue';
import { useField, useForm } from "vee-validate";
import useWeb3 from "@/connectors/hooks";
import { UserService } from "@/services/apiService"

export default {
  name: "EditProfile",
  components: { Dialog },
  props: {
    userData: Object,
  },
  setup(props) {
    const user = ref(props.userData);
    const {account} = useWeb3();

    const form = useForm({
      initialValues: {
        address: "",
        first_name: "",
        last_name: "",
        description: "",
      },
    });

    const firstNameField = reactive(useField("first_name", "required|min:3"));
    const lastNameField = reactive(useField("last_name", "required|min:3"));
    const descriptionField = reactive(useField("description", "required|min:6"));
    
    const onSubmit = form.handleSubmit((values) => {
      UserService.create({...values, wallet: user.value.wallet})
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
      })
    });

    const isEditProfileButtonShown = computed(() => account && account.value && (account.value.toLowerCase() === user.value.wallet.toLowerCase()));
    const isEditProfileModalShown = ref(false);
    const openEditProfileModal = () => {
      isEditProfileModalShown.value = true;
    }
    
    return {
      user,
      isEditProfileButtonShown,
      openEditProfileModal,
      isEditProfileModalShown,
      firstNameField,
      lastNameField,
      descriptionField,
      onSubmit,
    };
  }
}
</script>

<style scoped lang="scss">

</style>

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
      <div class="fc mb-4">
        <label for="profile-username">Username</label>
        <input type="text" id="profile-username" class="w-full outlined-input mt-2" v-model="usernameField.value" />
        <span>{{ usernameField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="profile-twitter">Twitter</label>
        <input type="text" id="profile-twitter" class="w-full outlined-input mt-2" v-model="twitterField.value" />
        <span>{{ twitterField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="profile-website">Website</label>
        <input type="text" id="profile-website" class="w-full outlined-input mt-2" v-model="websiteField.value" />
        <span>{{ websiteField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-description">Description</label>
        <textarea id="winner-description" class="w-full outlined-input mt-2" v-model="descriptionField.value" ></textarea>
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
import { UserService } from "@/services/apiService";
import useSigner from "@/hooks/useSigner";
import { useToast } from "primevue/usetoast";

export default {
  name: "EditProfile",
  components: { Dialog },
  props: {
    userData: Object,
    userUpdated: Function
  },
  setup(props) {
    const user = ref(props.userData);
    const {account} = useWeb3();
    const toast = useToast();
  // username, description, twitter, website, sig
    const form = useForm({
      initialValues: {
        username: user.value.username ? user.value.username : "",
        twitter: user.value.socials ? user.value.socials.twitter : "",
        website: user.value.socials ? user.value.socials.website : "",
        description: user.value.description ? user.value.description : "",
      },
    });

    const usernameField = reactive(useField("username", "required"));
    const twitterField = reactive(useField("twitter"));
    const websiteField = reactive(useField("website", "required|min:3"));
    const descriptionField = reactive(useField("description", "required|min:6"));
    
    const onSubmit = form.handleSubmit(async (values) => {
      const signer = useSigner();
      const msg = `I would like to update my account preferences for ${account.value}.`

      if (signer) {
        const sig = await signer
          .signMessage(msg)
          .catch((e) => {
            let msg = 'Error has occurred. Try again later.';
            if (e.code === 4001) {
                msg = 'Request was rejected.';
            }
            toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
            // ToastifyService.fail(msg);
            //this.submitting = false;
            return e;
        });

        UserService.update(account.value, {...values, sig})
          .then(res => {
            debugger; // eslint-disable-line
            props.userUpdated(res.data.user);
            toast.add({severity:'info', summary:'Success', detail:'Your profile has been updated.', life: 3000});
            isEditProfileModalShown.value = false;
          })
          .catch(e => {
            toast.add({severity:'error', summary:'Error', detail:'Profile update failed.', life: 3000});
            console.log(e);
        });
      }
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
      usernameField,
      twitterField,
      websiteField,
      descriptionField,
      onSubmit,
    };
  }
}
</script>

<style scoped lang="scss">

</style>

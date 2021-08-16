<template>
  <div class="-mb-8 pt-9 relative">
    <div class="flex justify-center text-grey-9">
      <div class="avatar absolute">
        <div class="absolute clear-image-icon" v-if="temporaryImageUrl" @click="resetTemporaryImage"><i class="fas fa-times"></i></div>
        <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center pt-1.5 profile-avatar" :style="{ backgroundImage: `url(${temporaryImageUrl ? temporaryImageUrl : user?.image})` }">
          <img src="@/assets/icons/avatar.svg" class="h-16 cursor-pointer" alt="SEEN" v-if="!user?.image && !temporaryImageUrl">
          <input type="file" id="profileAvatarUpload" class="hidden" @change="uploadImage" accept="image/*">
        </div>
      </div>
      <button class="text-sm mb-8" @click="openUploadWindow"><i class="fas fa-pencil-alt"></i> Change Avatar</button>
    </div>
    <div class="flex justify-between items-center mb-4 my-8">
      <div>
        <div class="text-xs font-bold mb-3 uppercase">Connected with {{ name }}</div>
        <div class="flex">
          <span class="mr-2 pt-1"><identicon/></span> <span class="text-lg font-address">{{ account && shortenAddress(account) }}</span>
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
    <div class="text-sm bg-background-gray rounded-lg my-8 transactions-box">
      <!-- <p class="text-grey-9 p-5 text-center">Your transactions will appear here...</p> -->
    </div>
    <div>
      <form @submit="onSubmit" class="font-semibold uppercase text-md text-black">
        <div class="fc mb-4">
          <label for="profile-username">Username</label>
          <input type="text" id="profile-username" class="w-full outlined-input mt-2" v-model="usernameField.value" />
          <span class="error-notice">{{ usernameField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="profile-twitter">Twitter</label>
          <input type="text" id="profile-twitter" class="w-full outlined-input mt-2" v-model="twitterField.value" />
          <span class="error-notice">{{ twitterField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="profile-website">Website</label>
          <input type="text" id="profile-website" class="w-full outlined-input mt-2" v-model="websiteField.value" />
          <span class="error-notice">{{ websiteField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="winner-description">Description</label>
          <textarea id="winner-description" class="w-full outlined-input mt-2" v-model="descriptionField.value" ></textarea>
          <span class="error-notice">{{ descriptionField.errors[0] }}</span>
        </div>

        <div class="flex items-center justify-center my-8 mb-12">
          <button type="submit" class="w-full cursor-pointer primary button mt-3 md:mt-0">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    <!-- <div class="newsletter bg-black py-4 px-8 text-white align-center -mx-8 rounded-b-lg">
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
    </div> -->
  </div>
</template>

<script>

import useWeb3 from "@/connectors/hooks";
import {SUPPORTED_WALLETS} from "@/connectors/constants";
import Identicon from "@/components/Identicon/Identicon";
import {shortenAddress, getEtherscanLink, clean} from "@/services/utils/index";
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import {useStore} from "vuex";

import {reactive, computed, ref} from 'vue';
import { useField, useForm } from "vee-validate";
import { UserService } from "@/services/apiService"
import useSigner from "@/hooks/useSigner";
import { useToast } from "primevue/usetoast";
import {twitterRegx, isValidHttpUrl} from '@/connectors/constants'

export default {
  name: "AccountView",
  components: {CopyHelper, Identicon},
  setup(props, {emit}) {
    const {chainId, account, connector} = useWeb3();
    const store = useStore()
    const user = computed(() => store.getters['user/user']);
    const toast = useToast();
    const temporaryImageUrl = ref('');

    const {ethereum} = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
        .filter(
            k =>
                SUPPORTED_WALLETS[k].connector === connector && (isMetaMask === (k === 'METAMASK'))
        )
        .map(k => SUPPORTED_WALLETS[k].name)[0];
    const form = useForm({
      initialValues: {
        username: (user.value && user.value.username) ? user.value.username : "",
        twitter: (user.value && user.value.socials) ? user.value.socials.twitter : "",
        website: (user.value && user.value.socials) ? user.value.socials.website : "",
        description: (user.value && user.value.description) ? user.value.description : "",
      },
    });

    const resetTemporaryImage = () => {
      temporaryImageUrl.value = '';
    }

    const uploadImage = (event) => {
      const fd = new FormData();
      const file = event.target.files[0];
      if (file && file.size > 500000) {
        toast.add({severity:'error', summary:'Error', detail:'Profile image must be less than 0.5 MB.', life: 3000});
        return;
      }
      fd.append('files', file);

      UserService.avatar(fd)
        .then(res => {
          const imageSrc = res.data.url;
          temporaryImageUrl.value = imageSrc;
          form.setFieldValue('image', imageSrc);
        })
        .catch(e => {
          console.error(e)
          toast.add({severity:'error', summary:'Error', detail:'Profile avatar upload failed.', life: 3000});
      });
    }

    const openUploadWindow = () => {
      document.getElementById('profileAvatarUpload').click();
    }

    const usernameField = reactive(useField("username", "required"));
    const twitterField = reactive(useField("twitter", url => {
      const res = twitterRegx.exec(url);
      if (!url) return true;
      return (res && res[1]) ? true : 'This is not a valid twitter address';
    }));
    const websiteField = reactive(useField("website", isValidHttpUrl));
    const descriptionField = reactive(useField("description"));

    const onSubmit = form.handleSubmit(async (values) => {
      values.image = temporaryImageUrl.value;
      const signer = useSigner();
      const msg = `I would like to update my account preferences for ${account.value}.`

      if (signer) {
        const sig = await signer
          .signMessage(msg)
          .catch((e) => {
            toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
            // ToastifyService.fail(msg);
            //this.submitting = false;
            return e;
        });

        values = clean(values);
        UserService.update(account.value, {...values, sig})
          .then(res => {
            store.dispatch('user/setUser', res.data.user);
            toast.add({severity:'info', summary:'Success', detail:'Your profile has been updated.', life: 3000});
            store.dispatch('application/closeModal');
            temporaryImageUrl.value = '';
          })
          .catch(e => {
            console.error(e)
            toast.add({severity:'error', summary:'Error', detail:'Profile update failed.', life: 3000});
        });
      }
    });

    const openOptions = () => {
      emit('changeView', 'options');
    }
    return {
      name,
      account,
      chainId,
      openOptions,
      shortenAddress,
      getEtherscanLink,
      usernameField,
      twitterField,
      websiteField,
      descriptionField,
      onSubmit,
      uploadImage,
      openUploadWindow,
      user,
      temporaryImageUrl,
      resetTemporaryImage,
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
.input-width {
  width: 65%;
  min-width:300px;
}
.clear-image-icon {
  right: .5rem;
  top: .5rem;
  color: black;
  background: white;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .75rem;
  cursor: pointer;
}
</style>

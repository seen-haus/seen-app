<template>
  <div class="banner-image-container-account-modal absolute">
    <div class="absolute clear-image-icon reset-banner-icon" v-if="temporaryBannerImageUrl" @click="resetTemporaryBannerImage"><i class="fas fa-undo"></i></div>
    <img class="banner-image-account-modal" :style="{ backgroundImage: `url(${temporaryBannerImageUrl ? temporaryBannerImageUrl : user?.banner_image})` }">
    <input type="file" id="profileBannerUpload" class="hidden" @change="uploadBannerImage" accept="image/*">
  </div>
  <div class="absolute edit-banner-button">
    <button class="text-sm mb-8 text-grey-9" @click="openBannerUploadWindow"><i class="fas fa-pencil-alt"></i> Banner</button>
  </div>
  <div class="-mb-8 pt-9 relative">
    <div class="flex justify-center text-grey-9">
      <div class="avatar absolute">
        <div class="absolute clear-image-icon" v-if="temporaryAvatarImageUrl" @click="resetTemporaryAvatarImage"><i class="fas fa-undo"></i></div>
        <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center pt-1.5 profile-avatar" :style="{ backgroundImage: `url(${temporaryAvatarImageUrl ? temporaryAvatarImageUrl : user?.avatar_image})` }">
          <img src="@/assets/icons/avatar.svg" class="h-16 cursor-pointer" alt="SEEN" v-if="!user?.avatar_image && !temporaryAvatarImageUrl">
          <input type="file" id="profileAvatarUpload" class="hidden" @change="uploadAvatarImage" accept="image/*">
        </div>
      </div>
      <button class="text-sm mb-8" @click="openAvatarUploadWindow"><i class="fas fa-pencil-alt"></i> Avatar</button>
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
          <label for="profile-instagram">Instagram</label>
          <input type="text" id="profile-instagram" class="w-full outlined-input mt-2" v-model="instagramField.value" />
          <span class="error-notice">{{ instagramField.errors[0] }}</span>
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
import useUser from "@/hooks/useUser";
import {SUPPORTED_WALLETS} from "@/connectors/constants";
import Identicon from "@/components/Identicon/Identicon";
import {shortenAddress, getEtherscanLink, clean} from "@/services/utils/index";
import CopyHelper from "@/components/CopyHelper/CopyHelper";
import {useStore} from "vuex";

import {reactive, ref} from 'vue';
import { useField, useForm } from "vee-validate";
import { UserService } from "@/services/apiService"
import useSigner from "@/hooks/useSigner";
import { useToast } from "primevue/usetoast";
import {twitterRegx, instagramRegx, isValidHttpUrl} from '@/connectors/constants'

export default {
  name: "AccountView",
  components: {CopyHelper, Identicon},
  setup(props, {emit}) {
    const {chainId, account, connector} = useWeb3();
    const store = useStore()
    const { user, setUser } = useUser();
    const toast = useToast();
    const temporaryAvatarImageUrl = ref('');
    const temporaryBannerImageUrl = ref('');

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
        instagram: (user.value && user.value.socials) ? user.value.socials.instagram : "",
        website: (user.value && user.value.socials) ? user.value.socials.website : "",
        description: (user.value && user.value.description) ? user.value.description : "",
      },
    });

    const resetTemporaryAvatarImage = () => {
      temporaryAvatarImageUrl.value = '';
    }

    const resetTemporaryBannerImage = () => {
      temporaryBannerImageUrl.value = '';
    }

    const uploadAvatarImage = (event) => {
      const fd = new FormData();
      const file = event.target.files[0];
      if (file && file.size > 1500000) {
        toast.add({severity:'error', summary:'Error', detail:'Profile image must be less than 1.5 MB.', life: 3000});
        return;
      }
      fd.append('files', file);

      UserService.avatar(fd)
        .then(res => {
          const imageSrc = res.data.url;
          temporaryAvatarImageUrl.value = imageSrc;
          form.setFieldValue('avatar_image', imageSrc);
        })
        .catch(e => {
          console.error(e)
          toast.add({severity:'error', summary:'Error', detail:'Profile avatar upload failed.', life: 3000});
      });
    }

    const uploadBannerImage = (event) => {
      const fd = new FormData();
      const file = event.target.files[0];
      if (file && file.size > 1500000) {
        toast.add({severity:'error', summary:'Error', detail:'Profile image must be less than 1.5 MB.', life: 3000});
        return;
      }
      fd.append('files', file);

      UserService.banner(fd)
        .then(res => {
          const imageSrc = res.data.url;
          temporaryBannerImageUrl.value = imageSrc;
          form.setFieldValue('banner_image', imageSrc);
        })
        .catch(e => {
          console.error(e)
          toast.add({severity:'error', summary:'Error', detail:'Profile avatar upload failed.', life: 3000});
      });
    }

    const openAvatarUploadWindow = () => {
      document.getElementById('profileAvatarUpload').click();
    }

    const openBannerUploadWindow = () => {
      document.getElementById('profileBannerUpload').click();
    }

    const usernameField = reactive(useField("username", "required"));
    const twitterField = reactive(useField("twitter", url => {
      const res = twitterRegx.exec(url);
      if (!url) return true;
      return (res && res[1]) ? true : 'This is not a valid twitter address';
    }));
    const instagramField = reactive(useField("instagram", url => {
      const res = instagramRegx.exec(url);
      if (!url) return true;
      return (res && res[1]) ? true : 'This is not a valid instagram username';
    }));
    const websiteField = reactive(useField("website", isValidHttpUrl));
    const descriptionField = reactive(useField("description"));

    const onSubmit = form.handleSubmit(async (values) => {
      values.avatar_image = temporaryAvatarImageUrl.value;
      values.banner_image = temporaryBannerImageUrl.value;
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
            setUser(res.data.user);
            toast.add({severity:'info', summary:'Success', detail:'Your profile has been updated.', life: 3000});
            store.dispatch('application/closeModal');
            temporaryAvatarImageUrl.value = '';
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
      instagramField,
      websiteField,
      descriptionField,
      onSubmit,
      uploadAvatarImage,
      uploadBannerImage,
      openAvatarUploadWindow,
      openBannerUploadWindow,
      user,
      temporaryAvatarImageUrl,
      temporaryBannerImageUrl,
      resetTemporaryAvatarImage,
      resetTemporaryBannerImage,
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
  padding-left: 2px;
  padding-top: 1px;
}
.reset-banner-icon {
  top: calc(100% - 30px);
}
.banner-image-container-account-modal {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 165px;
  overflow: hidden;
}
.banner-image-account-modal {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.edit-banner-button {
  right: 15px;
  margin-top: -20px;
}
</style>

<template>
  <div class="flex w-full flex-center mt-8">
      <div class="abstract-circles abstract-circles-request">
        <img src="@/assets/images/abstract-circles.svg" alt="" />
      </div>
    <div class="mint-access-request-form-container" v-if="!hasSubmittedRequest || !submissionSuccessful">
      <sub-title
        class="
          light-back-button
          light-mode-text-washed
          disable-text-transform
          clickable
          lg:flex
          mb-1
          mt-2
        "
        text-align="left"
        font-size="13px"
        @click="$router.go(-1)"
      >
        <i class="fas fa-chevron-left mr-1"></i>Go Back
      </sub-title>
      <sub-title
        class="text-black lg:flex pt-6"
        text-align="center"
        font-size="36px"
      >
        You do not have access
      </sub-title>
      <light-typography
        class="text-light-grey lg:flex pt-6"
        text-align="center"
        font-size="16px"
      >
        To mint on seen.haus you must be an approved creator.<br />You may
        complete the following to be considered
      </light-typography>
      <div class="mt-6">
        <form
            @submit="onSubmit"
            class="font-semibold uppercase text-md text-black"
          >
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label class="disabled" for="wallet">Wallet Address</label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="wallet"
                  class="w-full outlined-input disabled mt-2 wallet-input-background"
                  placeholder="Your connected wallet address"
                  :class="walletField.errors[0] && 'invalid-outline'"
                  v-model="walletField.value"
                />
                <i class="mx-4 fa fa-wallet"></i>
                <span class="error-notice">{{ walletField.errors[0] }}</span>
              </div>
            </div>
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label for="name">Name</label>
                <label
                  :class="
                    nameField?.value?.length > maxLengths.name
                      ? 'error-text'
                      : 'light-mode-text-washed'
                  "
                >
                  {{ nameField.value ? nameField.value.length : 0 }} /
                  {{ maxLengths.name }}
                </label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="name"
                  class="w-full outlined-input mt-2"
                  placeholder="Enter your name"
                  :class="nameField.errors[0] && 'invalid-outline'"
                  v-model="nameField.value"
                />
                <i class="mx-4 far fa-user"></i>
                <span class="error-notice">{{ nameField.errors[0] }}</span>
              </div>
            </div>
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label for="email">Email</label>
                <label
                  :class="
                    emailField?.value?.length > maxLengths.email
                      ? 'error-text'
                      : 'light-mode-text-washed'
                  "
                >
                  {{
                    emailField.value ? emailField.value.length : 0
                  }}
                  / {{ maxLengths.email }}
                </label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="email"
                  class="w-full outlined-input mt-2"
                  placeholder="Enter your e-mail"
                  :class="emailField.errors[0] && 'invalid-outline'"
                  v-model="emailField.value"
                />
                <i class="mx-4 far fa-envelope"></i>
                <span class="error-notice">{{ emailField.errors[0] }}</span>
              </div>
            </div>
            
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label for="twitter">Twitter</label>
                <label
                  :class="
                    twitterField?.value?.length > maxLengths.twitter
                      ? 'error-text'
                      : 'light-mode-text-washed'
                  "
                >
                  {{
                    twitterField.value ? twitterField.value.length : 0
                  }}
                  / {{ maxLengths.twitter }}
                </label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="twitter"
                  class="w-full outlined-input mt-2"
                  placeholder="Enter your Twitter ID"
                  :class="twitterField.errors[0] && 'invalid-outline'"
                  v-model="twitterField.value"
                />
                <i class="mx-4 fab fa-twitter"></i>
                <span class="error-notice">{{ twitterField.errors[0] }}</span>
              </div>
            </div>
            
            
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label for="instagram">Instagram</label>
                <label
                  :class="
                    instagramField?.value?.length > maxLengths.instagram
                      ? 'error-text'
                      : 'light-mode-text-washed'
                  "
                >
                  {{
                    instagramField.value ? instagramField.value.length : 0
                  }}
                  / {{ maxLengths.instagram }}
                </label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="instagram"
                  class="w-full outlined-input mt-2"
                  placeholder="Enter your Instagram ID"
                  :class="instagramField.errors[0] && 'invalid-outline'"
                  v-model="instagramField.value"
                />
                <i class="mx-4 fab fa-instagram"></i>
                <span class="error-notice">{{ instagramField.errors[0] }}</span>
              </div>
            </div>
            
            <div class="fc mb-6">
              <div class="flex-space-between">
                <label for="website">Website</label>
                <label
                  :class="
                    websiteField?.value?.length > maxLengths.website
                      ? 'error-text'
                      : 'light-mode-text-washed'
                  "
                >
                  {{
                    websiteField.value ? websiteField.value.length : 0
                  }}
                  / {{ maxLengths.website }}
                </label>
              </div>
              <div class="icon-prefix-input-container">
                <input
                  type="text"
                  id="website"
                  class="w-full outlined-input mt-2"
                  placeholder="Enter your website URL"
                  :class="websiteField.errors[0] && 'invalid-outline'"
                  v-model="websiteField.value"
                />
                <i class="mx-4 fa fa-globe"></i>
                <span class="error-notice">{{ websiteField.errors[0] }}</span>
              </div>
            </div>
            
            <button
              class="button mt-10 w-full primary"
              type="submit"
            >
              Continue
            </button>
          </form>
      </div>
    </div>
    <div v-if="hasSubmittedRequest && submissionSuccessful">
      <sub-title
        class="text-black lg:flex pt-6"
        text-align="center"
        font-size="36px"
      >
        Your request has been sent
      </sub-title>
      <light-typography
        class="text-light-grey lg:flex pt-6"
        text-align="center"
        font-size="16px"
      >
        Our team manually curates creators and<br/>will reach out if you are selected
      </light-typography>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useField, useForm } from "vee-validate";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import useSigner from "@/hooks/useSigner";
import { useMeta } from "vue-meta";
import { ArtistService } from "@/services/apiService"
import { useToast } from 'primevue/usetoast';
import useWeb3 from "@/connectors/hooks";
import {clean} from "@/services/utils/index";

export default {
  name: "AccessRequestForm",
  props: {},
  methods: {},
  components: {
    SubTitle,
    LightTypography,
  },
  setup() {
    useMeta({
      title: "Access Request Form",
    });
    const toast = useToast();

    const {account} = useWeb3();

    const { handleSubmit } = useForm({
      initialValues: {
        wallet: account.value ? account.value : "",
        name: "",
        email: "",
        twitter: "",
        instagram: "",
        website: "",
      },
    });
    
    const isSubmittingRef = ref(false);
    const hasSubmittedRequest = ref(false);
    const submissionSuccessful = ref(false);

    const hasOneOfRequiredSocials = (values) => {
      if(values?.website && values?.website?.length > 0){
        return true;
      }
      if(values?.twitter && values?.twitter?.length > 0){
        return true;
      }
      if(values?.instagram && values?.instagram?.length > 0){
        return true;
      }
      return false;
    }
    const onSubmit = handleSubmit(async (values) => {
      if(!hasOneOfRequiredSocials(values)){
        toast.add({severity:'error', summary:'Error', detail: "One of your socials must be added to continue", life: 3000});
        return;
      }
      const signer = useSigner();
      const msg = `{"reason":"Request access to SEEN.HAUS self-minting.","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`

      if (signer) {
        const signature = await signer
          .signMessage(msg)
          .catch((e) => {
            toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
            return e;
        });
        isSubmittingRef.value = true;

        values = clean(values);
        ArtistService.requestAccessToSelfCreate({...values, signature, msg})
          .then(res => {
            isSubmittingRef.value = false;
            submissionSuccessful.value = true;
            toast.add({severity:'info', summary:'Success', detail:'Your request has been submitted.', life: 5000});
          })
          .catch(e => {
            console.error(e)
            isSubmittingRef.value = false;
            submissionSuccessful.value = false;
            toast.add({severity:'error', summary:'Error', detail: e.data.message, life: 3000});
          })
          .finally(() => {
            hasSubmittedRequest.value = true;
          });
      }
    });

    let maxLengths = {
      name: 50,
      email: 50,
      twitter: 50,
      instagram: 50,
      website: 150,
    };

    const walletField = reactive(
      useField("wallet", `required`)
    );
    const nameField = reactive(
      useField("name", `required|min:1|max:${maxLengths.name}`)
    );
    const emailField = reactive(
      useField("email", `required|min:1|max:${maxLengths.email}|email`)
    );
    const twitterField = reactive(
      useField("twitter", `max:${maxLengths.twitter}`)
    );
    const instagramField = reactive(
      useField("instagram", `max:${maxLengths.instagram}`)
    );
    const websiteField = reactive(
      useField("website", `max:${maxLengths.website}`)
    );

    return {
      walletField,
      nameField,
      emailField,
      twitterField, 
      instagramField,
      websiteField,
      maxLengths,
      onSubmit,
      isSubmittingRef,
      hasSubmittedRequest,
      submissionSuccessful,
    };
  },
};
</script>

<style lang="scss" scoped>
.mint-access-request-form-container {
  max-width: 800px;
  min-width: 50%;
  position: relative;
}


.icon-prefix-input-container {
  position: relative;
}

.icon-prefix-input-container i {
  position: absolute;
  left: 0;
  top: 40%;
  color: #8E98A0;
}

.icon-prefix-input-container .error-notice {
  position: absolute;
  top: 95%;
}

.icon-prefix-input-container input {
  padding-left: 40px;
}

.abstract-circles-request {
  top: 100px;
}

.wallet-input-background {
  background-color: #f5f5f5;
}

.light-back-button {

}

</style>

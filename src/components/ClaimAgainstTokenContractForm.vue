<template>
  <container>
    <div class="loading-mask">
      <template v-if="claim.contract_address">
        <button
          class="button dark mt-20 mx-auto w-full md:w-96"
          @click="onClaim"
        >
          Claim
        </button>
      </template>
      <template v-else>
        <form
          @submit="onSubmit"
          class="font-semibold uppercase text-md text-black"
        >
          <div class="fc mb-4">
            <label for="winner-email">Email</label>
            <input
              type="email"
              id="winner-email"
              class="w-full outlined-input-darkmode-green mt-2"
              autocomplete="email"
              v-model="emailField.value"
            />
            <span class="error-notice">{{ emailField.errors[0] }}</span>
          </div>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="fc mb-4">
              <label for="winner-name">Name</label>
              <input
                type="text"
                id="winner-name"
                class="w-full outlined-input-darkmode-green mt-2"
                autocomplete="given-name"
                v-model="firstNameField.value"
              />
              <span class="error-notice">{{ firstNameField.errors[0] }}</span>
            </div>
            <div class="fc mb-4">
              <label for="winner-last-name">Last name</label>
              <input
                type="text"
                id="winner-last-name"
                class="w-full outlined-input-darkmode-green mt-2"
                autocomplete="family-name"
                v-model="lastNameField.value"
              />
              <span class="error-notice">{{ lastNameField.errors[0] }}</span>
            </div>
          </div>
          <div class="fc mb-4">
            <label for="winner-phone">Phone</label>
            <input
              type="phone"
              id="winner-phone"
              class="w-full outlined-input-darkmode-green mt-2"
              autocomplete="tel"
              v-model="phoneField.value"
            />
            <span class="error-notice">{{ phoneField.errors[0] }}</span>
          </div>
          <div class="fc mb-4">
            <label for="winner-address">Address</label>
            <input
              type="text"
              id="winner-address"
              class="w-full outlined-input-darkmode-green mt-2"
              autocomplete="street-address"
              v-model="addressField.value"
            />
            <span class="error-notice">{{ addressField.errors[0] }}</span>
          </div>
          <div class="fc mb-4">
            <label for="winner-city">City</label>
            <input
              type="text"
              id="winner-city"
              class="w-full outlined-input-darkmode-green mt-2"
              autocomplete="address-level2"
              v-model="cityField.value"
            />
            <span class="error-notice">{{ cityField.errors[0] }}</span>
          </div>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div class="fc mb-4">
              <label for="winner-state">State / Province</label>
              <input
                type="text"
                id="winner-state"
                class="w-full outlined-input-darkmode-green mt-2"
                autocomplete="address-level1"
                v-model="provinceField.value"
              />
              <span class="error-notice">{{ provinceField.errors[0] }}</span>
            </div>
            <div class="fc mb-4">
              <label for="winner-zip">ZIP</label>
              <input
                type="text"
                id="winner-zip"
                class="w-full outlined-input-darkmode-green mt-2"
                autocomplete="postal-code"
                v-model="zipField.value"
              />
              <span class="error-notice">{{ zipField.errors[0] }}</span>
            </div>
          </div>
          <div class="fc mb-4">
            <label for="winner-country">Country</label>
            <select
              v-model="countryField.value"
              name="winner-country"
              id="winner-country"
              autocomplete="country-name"
              class="w-full outlined-input-darkmode-green mt-2"
            >
              <option
                :value="country"
                v-for="country in countries"
                :key="country"
              >
                {{ country }}
              </option>
            </select>
            <span class="error-notice">{{ countryField.errors[0] }}</span>
          </div>

          <div class="fc mb-4">
            <label for="claim-message">Message/Instructions <span v-if="state.messageHelper" style="opacity: 0.5"> - {{state.messageHelper}}</span></label>
            <textarea name="claim-message" id="claim-message" class="w-full outlined-input-darkmode-green mt-2" :required="state.requiresMessage ? true : false" v-model="messageField.value"></textarea>
            <span class="error-notice">{{ messageField.errors[0] }}</span>
          </div>

          <div class="fc mb-4">
            <div :style="{'display': 'flex', 'justify-content': 'space-between'}">
              <input
                v-model="understandsClaimQuantityField.value"
                type="checkbox"
                placeholder="Understands Claim Quantity"
                :style="{'display': 'inline-block', height: '30px'}"
              />
              <label :style="{'display': 'inline-block', width: 'calc(100% - 30px)', 'padding-left': '10px'}">By ticking this checkbox, you acknowledge that this claim submission will be considered as a physical claim for all of the units claimed by your Ethereum address (e.g. if you use this Ethereum address to run multiple on-chain claims for different token IDs within this drop, these claims will be batched together).</label>
            </div>
            <span class="error-notice">{{ understandsClaimQuantityField.errors[0] }}</span>
          </div>

          <div class="flex items-center justify-center mb-4 mt-8">
            <button
              type="submit"
              class="cursor-pointer primary button mt-3 md:mt-0"
            >
              {{
                state.isSigning ? 
                  'Check MetaMask...'
                    : state.isSubmitting 
                      ? 'Submitting...' 
                        : `${preloadData.email ? 'Update' : 'Save'} Shipping Information`
              }}
            </button>
          </div>
        </form></template
      >
    </div>
  </container>
</template>

<script>
import { Web3Provider } from "@ethersproject/providers";
import { computed, ref, reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import Container from "@/components/Container.vue";
import { ClaimsService } from "@/services/apiService";

import useWeb3 from "@/connectors/hooks";
import useSigner from "@/hooks/useSigner";
import { useClaimContract } from "@/hooks/useContract";
import { useField, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { useMeta } from "vue-meta";
import { countryList } from "@/connectors/constants";
import parseError from "@/services/utils/parseError";

export default {
  name: "ClaimAgainstTokenContractForm",
  components: {
    Container,
  },
  props: {
    claimContractAddress: {
      type: String || Boolean,
      default: false,
    },
    preloadData: {
      type: Object || Boolean,
      default: false,
    },
    afterInfoSubmitted: {
      type: Function,
    },
  },
  setup(props) {

    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const claim = ref({});
    const title = ref("Claim");
    const state = reactive({
      loading: true,
      contractAddress: null,
      requiresMessage: false,
      messageHelper: null,
      isSubmitting: false,
      isSigning: false,
    });
    const countries = countryList;
    const { account, provider } = useWeb3();
    const { meta } = useMeta({
      title: title.value,
    });

    const form = useForm({
      initialValues: {
        email: props.preloadData.email || "",
        first_name: props.preloadData.first_name || "",
        last_name: props.preloadData.last_name || "",
        phone: props.preloadData.phone || "",
        telegram_username: props.preloadData.telegram_username || "",
        address: props.preloadData.address || "",
        city: props.preloadData.city || "",
        province: props.preloadData.province || "",
        zip: props.preloadData.zip || "",
        country: props.preloadData.country || "",
        message: props.preloadData.message || "",
      },
    });

    const emailField = reactive(useField("email", "email"));
    const firstNameField = reactive(useField("first_name", "required|min:3"));
    const lastNameField = reactive(useField("last_name", "required|min:3"));
    const phoneField = reactive(useField("phone", "required|min:6"));
    const telegramUsernameField = reactive(useField("telegram_username"));
    const addressField = reactive(useField("address", "required|min:3"));
    const cityField = reactive(useField("city", "required|min:2"));
    const provinceField = reactive(useField("province"));
    const zipField = reactive(useField("zip", "required"));
    const countryField = reactive(useField("country", "required"));
    const messageField = reactive(useField("message"));
    const understandsClaimQuantityField = reactive(useField("claim quantity acknowledgement", inputValue => !!inputValue));

    const onSubmit = form.handleSubmit(async (values) => {
      state.isSigning = true;
      const msg = `{"reason":"Save shipping information for wallet address","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`
      const signer = useSigner();

      if (signer) {
        const signature = await signer.signMessage(msg).catch((e) => {
          console.log({e})
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "Message signing failed.",
            life: 3000,
          });
          // let msg = 'Error has occurred. Try again later.';
          // if (e.code === 4001) {
          //     msg = 'Request was rejected.';
          // }
          // ToastifyService.fail(msg);
          //this.submitting = false;
          return e;
        });

        state.isSigning = false;
        state.isSubmitting = true;

        // TODO
        ClaimsService.claimAgainstTokenContract(props.claimContractAddress, {
          ...values,
          signature,
          msg: msg,
          wallet_address: account.value,
        })
          .then(() => {
            let message =
              "Your artwork will be delivered within 3 - 4 weeks, keep in mind it may take longer due to COVID restrictions in certain countries";
            // if(claim?.value?.collectable?.is_slug_full_route && claim?.value?.collectable?.slug) {
            //   router.push({
            //     name: claim?.value?.collectable?.slug,
            //   });
            // } else {
            //   router.push({
            //     name: "collectableAuction",
            //     params: { slug: claim?.value?.collectable?.slug },
            //   });
            // }
            toast.add({
              severity: "success",
              summary: "Success",
              detail: message,
              life: 10000,
            });
          })
          .catch((e) => {
              let message = e?.data?.message ? parseError(e?.data?.message) : e;
              if(!message) {
                message = "Could not submit your details. Please try to enter them later.";
              }
              if(message.indexOf('already submitted a claim') > -1) {
                // if(claim?.value?.collectable?.is_slug_full_route && claim?.value?.collectable?.slug) {
                //   router.push({
                //     name: claim?.value?.collectable?.slug,
                //   });
                // } else {
                //   router.push({
                //     name: "collectableAuction",
                //     params: { slug: claim?.value?.collectable?.slug },
                //   });
                // }
              }
              toast.add({
                severity: "error",
                summary: "Error",
                detail: message,
                life: 10000,
              })
            }
          );
          state.isSubmitting = false;
          props.afterInfoSubmitted();
      } else {
        // toastr to login
      }
    });

    const isLoading = computed(() => state.loading);

    return {
      title,
      claim,
      isLoading,
      onSubmit,
      emailField,
      firstNameField,
      lastNameField,
      phoneField,
      telegramUsernameField,
      addressField,
      cityField,
      provinceField,
      zipField,
      countryField,
      countries,
      messageField,
      understandsClaimQuantityField,
      state,
    };
  },
};
</script>

<style lang="scss" scoped>
.description {
  p {
    margin-bottom: 1rem;
  }
}
label {
  color: white;
}
</style>



<template>
  <Dialog v-model:visible="displayModal" :style="{width: '36rem'}" :modal="true" :closable="true">
    <template #header>
      <h3 class="font-bold text-3xl text-black text-center block w-full">{{collectableData.title}}</h3>
    </template>
    <form @submit="onSubmit" class="font-semibold uppercase text-md text-black">
      <div class="fc mb-4">
        <label for="winner-email">Email</label>
        <input type="email" id="winner-email" class="w-full outlined-input mt-2" autocomplete="email" v-model="emailField.value" />
        <span class="error-notice">{{ emailField.errors[0] }}</span>
      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-name">Name</label>
          <input type="text" id="winner-name" class="w-full outlined-input mt-2" autocomplete="given-name" v-model="firstNameField.value" />
          <span class="error-notice">{{ firstNameField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="winner-last-name">Last name</label>
          <input type="text" id="winner-last-name" class="w-full outlined-input mt-2" autocomplete="family-name" v-model="lastNameField.value" />
          <span class="error-notice">{{ lastNameField.errors[0] }}</span>
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-phone">Phone</label>
        <input type="phone" id="winner-phone" class="w-full outlined-input mt-2" autocomplete="tel" v-model="phoneField.value" />
        <span class="error-notice">{{ phoneField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-telegram">Telegram Username (optional)</label>
        <input type="text" id="winner-telegram" class="w-full outlined-input mt-2" autocomplete="new-password" v-model="telegramUsernameField.value" />
        <span class="error-notice">{{ telegramUsernameField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-address">Address</label>
        <input type="text" id="winner-address" class="w-full outlined-input mt-2" autocomplete="street-address" v-model="addressField.value" />
        <span class="error-notice">{{ addressField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-city">City</label>
        <input type="text" id="winner-city" class="w-full outlined-input mt-2" autocomplete="address-level2" v-model="cityField.value" />
        <span class="error-notice">{{ cityField.errors[0] }}</span>
      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-state">State / Province</label>
          <input type="text" id="winner-state" class="w-full outlined-input mt-2" autocomplete="address-level1" v-model="provinceField.value" />
          <span class="error-notice">{{ provinceField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="winner-zip">ZIP</label>
          <input type="text" id="winner-zip" class="w-full outlined-input mt-2" autocomplete="postal-code" v-model="zipField.value" />
          <span class="error-notice">{{ zipField.errors[0] }}</span>
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-country">Country</label>
        <select v-model="countryField.value" name="winner-country" id="winner-country" autocomplete="country-name" class="w-full outlined-input mt-2">
          <option :value="country" v-for="country in countries" :key="country">{{country}}</option>
        </select>
        <span class="error-notice">{{ countryField.errors[0] }}</span>
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
import {ref, reactive, watchEffect} from 'vue';
import emitter from "@/services/utils/emitter"
import { useField, useForm } from "vee-validate";
import { CollectablesService } from "@/services/apiService";
import { useTokenContract } from "@/hooks/useContract";
import useSigner from "@/hooks/useSigner";
import useWeb3 from "@/connectors/hooks"
import { useToast } from "primevue/usetoast";
import {countryList} from '@/connectors/constants'

export default {
  name: "WinnerInfo",
  components: { Dialog, },
  setup() {
    const toast = useToast();
    const displayModal = ref(false);
    const collectableData = ref({});
    const tokenContract = ref(null);
    const { account } = useWeb3();
    const countries = countryList;

    emitter.on('openWinnerModal', payload => {
      collectableData.value = payload;
      displayModal.value = true;
    });

    watchEffect(() => {
      if (collectableData.value && collectableData.value.contract_address) {
        tokenContract.value = useTokenContract(collectableData.value.contract_address);
      }
    })

    const form = useForm({
      initialValues: {
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        telegram_username: "",
        address: "",
        city: "",
        province: "",
        zip: "",
        country: "",
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

    const onSubmit = form.handleSubmit(async (values) => {
      //this.submitting = true
      const msg = `I would like to save my shipping information for wallet address ${account.value.toLowerCase()}.`;
      const signer = useSigner();

      if (signer) {
        const sig = await signer
          .signMessage(msg)
          .catch((e) => {
            toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
            // let msg = 'Error has occurred. Try again later.';
            // if (e.code === 4001) {
            //     msg = 'Request was rejected.';
            // }
            // ToastifyService.fail(msg);
            //this.submitting = false;
            return e;
        });
        CollectablesService.winner(collectableData.value.contract_address, {...values, sig, wallet_address: account.value})
          .then(() => {
            displayModal.value = false;
            toast.add({severity:'success', summary:'Success', detail:'Claimer details successfully saved.', life: 3000});
          })
          .catch(() => toast.add({severity:'error', summary:'Error', detail:'Could not submit your details. Please try to enter them later.', life: 3000}));
      } else {
        // toastr to login
      }
    });

    return {
      displayModal,
      collectableData,
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
    };
  },
};
</script>

<style lang="scss">
  input {
    @apply flex items-center border rounded-md border-gray-200 px-5;
  }
</style>

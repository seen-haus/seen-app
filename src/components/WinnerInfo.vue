

<template>
  <Dialog v-model:visible="displayModal" :style="{width: '36rem'}" :modal="true" :closable="true">
    <template #header>
      <h3 class="font-bold text-3xl text-black text-center block w-full">{{collectableData.title}}</h3>
    </template>
    <form @submit="onSubmit" class="font-semibold uppercase text-md text-black">
      <div class="fc mb-4">
        <label for="winner-email">Email</label>
        <input type="email" id="winner-email" class="w-full outlined-input mt-2" autocomplete="email" v-model="emailField.value" placeholder="Your email" />
        <span>{{ emailField.errors[0] }}</span>
      </div>
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
        <label for="winner-phone">Phone</label>
        <input type="phone" id="winner-phone" class="w-full outlined-input mt-2" autocomplete="tel" v-model="phoneField.value" placeholder="Your phone" />
        <span>{{ phoneField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-telegram">Telegram Username (optional)</label>
        <input type="text" id="winner-telegram" class="w-full outlined-input mt-2" autocomplete="new-password" v-model="telegramUsernameField.value" placeholder="Your Telegram username" />
        <span>{{ telegramUsernameField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-address">Address</label>
        <input type="text" id="winner-address" class="w-full outlined-input mt-2" autocomplete="street-address" v-model="addressField.value" placeholder="Your address" />
        <span>{{ addressField.errors[0] }}</span>
      </div>
      <div class="fc mb-4">
        <label for="winner-city">City</label>
        <input type="text" id="winner-city" class="w-full outlined-input mt-2" autocomplete="address-level2" v-model="cityField.value" placeholder="Your city" />
        <span>{{ cityField.errors[0] }}</span>
      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-state">State / Province</label>
          <input type="text" id="winner-state" class="w-full outlined-input mt-2" autocomplete="address-level1" v-model="stateField.value" placeholder="Your state / province" />
          <span>{{ stateField.errors[0] }}</span>
        </div>
        <div class="fc mb-4">
          <label for="winner-zip">ZIP</label>
          <input type="text" id="winner-zip" class="w-full outlined-input mt-2" autocomplete="postal-code" v-model="zipField.value" placeholder="Your zip code" />
          <span>{{ zipField.errors[0] }}</span>
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-country">Country</label>
        <input type="text" id="winner-country" class="w-full outlined-input mt-2" autocomplete="country-name" v-model="countryField.value" placeholder="Your country" />
        <span>{{ countryField.errors[0] }}</span>
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
import {ref, reactive} from 'vue';
import emitter from "@/services/utils/emitter"
import { useField, useForm } from "vee-validate";
import { CollectablesService } from "@/services/apiService";

export default {
  name: "WinnerInfo",
  components: { Dialog },
  setup() {
    const displayModal = ref(false);
    const collectableData = ref({});
    emitter.on('openWinnerModal', payload => {
      collectableData.value = payload;
      displayModal.value = true;
    });
    const form = useForm({
      initialValues: {
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        telegram_username: "",
        address: "",
        city: "",
        state: "",
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
    const stateField = reactive(useField("state"));
    const zipField = reactive(useField("zip", "required"));
    const countryField = reactive(useField("country", "required|min:4"));
    
    const onSubmit = form.handleSubmit((values) => {
      debugger; // eslint-disable-line
      CollectablesService.winner(collectableData.value.contract_address, values)
        .then((res) => console.log(res))
        .catch(() => console.log('Something went wrong!'));
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
      stateField,
      zipField,
      countryField,
    };
  },
};
</script>

<style lang="scss">
  input {
    @apply flex items-center border rounded-md border-gray-200 px-5;
  }
</style>

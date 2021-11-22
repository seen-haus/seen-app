<template>
  <div class="flex w-full mt-8">
    <div class="access-request-form-container">
      <!-- <sub-title
        class="
          light-self-create-back-button light-mode-text-washed
          disable-text-transform
          clickable
          hidden
          lg:flex
          mb-1
          mt-2
        "
        text-align="left"
        font-size="13px"
        @click="prevStep"
      >
        <i class="fas fa-chevron-left mr-1"></i>Go Back
      </sub-title> -->
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
        To mint on seen.haus you must be an approved artist.<br />You may
        complete the following to be considered
      </light-typography>
      <div class="mt-6">
        <form
            @submit="onSubmit"
            class="font-semibold uppercase text-md text-black"
          >
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
              <input
                type="text"
                id="name"
                class="w-full outlined-input mt-2"
                placeholder="Name"
                :class="nameField.errors[0] && 'invalid-outline'"
                v-model="nameField.value"
              />
              <span class="error-notice">{{ nameField.errors[0] }}</span>
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
              <input
                type="text"
                id="email"
                class="w-full outlined-input mt-2"
                placeholder="Email"
                :class="emailField.errors[0] && 'invalid-outline'"
                v-model="emailField.value"
              />
              <span class="error-notice">{{ emailField.errors[0] }}</span>
            </div>
            <button
              class="button mt-6 w-full primary"
              type="submit"
            >
              Continue
            </button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useField, useForm } from "vee-validate";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import { useMeta } from "vue-meta";

export default {
  name: "AccessRequestForm",
  props: {
    nameData: String,
    emailData: String,
  },
  methods: {
  },
  components: {
    SubTitle,
    LightTypography,
  },
  setup() {
    useMeta({
      title: "Access Request Form",
    });

    const { handleSubmit } = useForm({
      initialValues: {
        name: "",
        email: "",
      },
    });

    const onSubmit = handleSubmit((values) => {
      console.log("in the submit function");
      console.log({ 
        values
       });
      // const signer = useSigner();
      // const msg = `{"reason":"Update SEEN.HAUS account email address & preferences","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`

      // if (signer) {
      //   const signature = await signer
      //     .signMessage(msg)
      //     .catch((e) => {
      //       toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
      //       return e;
      //   });

      //   isSubmittingRef.value = true;

      //   values = clean(values);
      //   UserService.updateEmailAddressAndPreferences(account.value, {...values, signature, msg})
      //     .then(res => {
      //       store.dispatch('user/setUser', res.data.user);
      //       store.dispatch('user/setUserEmailPreferences', res.data.email_preferences);
      //       isSubmittingRef.value = false;
      //       toast.add({severity:'info', summary:'Success', detail:'Your email address & preferences have been updated.', life: 5000});
      //       if(props.isModal) {
      //           store.dispatch('application/closeModal');
      //       }
      //     })
      //     .catch(e => {
      //       console.error(e)
      //       isSubmittingRef.value = false;
      //       toast.add({severity:'error', summary:'Error', detail:'Email address & preferences update failed.', life: 3000});
      //   });
      // }
    });

    let maxLengths = {
      name: 30,
      email: 50,
    };

    const nameField = reactive(
      useField("name", `required|min:1|max:${maxLengths.name}`)
    );
    const emailField = reactive(
      useField("email", `required|min:1|max:${maxLengths.email}|email`)
    );

    return {
      nameField,
      emailField,
      maxLengths,
      onSubmit
    };
  },
};
</script>

<style lang="scss" scoped>
.mint-access-request-form-container {
  max-width: 800px;
  margin-right: 20px;
  position: relative;
}
</style>

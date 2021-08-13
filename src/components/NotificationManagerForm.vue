<template>
    <div>
        <div v-if="showTitle" class="text-4xl font-title font-bold mb-6">{{title}}</div>
        <div v-if="!account" class="flex items-center justify-center flex-col">
            <div class="w-full rounded-container flex items-center mb-6">
                <i
                    class="fas fa-wallet transform rotate-12 text-3xl icon-right mr-6"
                    :class="'text-gray-500'"
                ></i>

                <div class="text-sm font-bold">
                    In order to adjust your notification preferences, you must first connect to your wallet.
                </div>
            </div>
            <button class="primary w-full cursor-pointer button mt-3 md:mt-0" @click="openWalletModal">
                <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
            </button>
        </div>
        <div v-if="account && !editMode" class="flex items-center justify-center flex-col">
            <div class="rounded-container flex items-center mb-6">
                <i
                    class="fas fa-id-badge text-3xl icon-right mr-6"
                    :class="'text-gray-500'"
                ></i>

                <div class="text-sm font-bold">
                    In order to adjust your notification preferences, you must first verify ownership of this account.
                </div>
            </div>
            <button class="primary w-full cursor-pointer button mt-3 md:mt-0" @click="showEmailAddressAndPreferences">
                {{'Verify Account'}}
            </button>
        </div>
        <div v-if="account && editMode">
            <div class="rounded-container flex items-center mb-6">
                <i
                    class="fas fa-bell text-3xl icon-right mr-6"
                    :class="'text-gray-500'"
                ></i>

                <div class="text-sm font-bold">
                    Email notifications allow you to stay in the loop with activity that is related to your account.
                </div>
            </div>
            <form @submit="onSubmit" class="font-semibold uppercase text-md text-black">
                <div class="fc mb-4">
                    <label for="email">Email Address</label>
                    <input name="email" type="text" :disabled="!editMode" :class="!editMode && 'opacity-0-6'" id="email" class="w-full outlined-input mt-2" v-model="emailField.value" />
                    <div class="flex justify-between">
                        <span class="error-notice">{{ emailField.errors[0] }}</span>
                        <span v-if="user?.email" @click="deleteEmailAddress" class="clickable-text error-notice">Delete Email Address</span>
                    </div>
                </div>

                <div class="mb-4">
                  <label>Manage Preferences</label>
                </div>

                <div class="fc mb-4">
                    <div :style="{'display': 'flex', 'justify-content': 'space-between', 'align-items': 'center'}">
                        <InputSwitch id="global-disable" v-model="globalDisableField.value"/>
                        <label for="global-disable" :style="{'display': 'inline-block', width: 'calc(100% - 30px)'}" class="ml-3 clickable">Disable all email notifications</label>
                    </div>
                    <span class="error-notice">{{ globalDisableField.errors[0] }}</span>
                </div>

                <div :class="globalDisableField.value && 'opacity-20'">

                    <div class="fc mb-4">
                        <div :style="{'display': 'flex', 'justify-content': 'space-between', 'align-items': 'center'}">
                            <InputSwitch id="outbid" v-model="outbidField.value"/>
                            <label for="outbid" :style="{'display': 'inline-block', width: 'calc(100% - 30px)'}" class="ml-3 clickable">Email me if someone outbids me on an auction</label>
                        </div>
                        <span class="error-notice">{{ outbidField.errors[0] }}</span>
                    </div>

                    <div class="fc mb-4">
                        <div :style="{'display': 'flex', 'justify-content': 'space-between', 'align-items': 'center'}">
                            <InputSwitch id="claim-page-go-live" v-model="claimPageGoLiveField.value"/>
                            <label for="claim-page-go-live" :style="{'display': 'inline-block', width: 'calc(100% - 30px)'}" class="ml-3 clickable">Email me when I am able to claim a physical</label>
                        </div>
                        <span class="error-notice">{{ claimPageGoLiveField.errors[0] }}</span>
                    </div>

                </div>

                <div class="flex items-center justify-center my-8 mb-1">
                    <button v-if="editMode" :disabled="!editMode || emailField.errors[0] || emailField?.value?.length < 3 || isSubmitting" :class="(!editMode || emailField.errors[0] || emailField?.value?.length < 3 || isSubmitting) ? 'disabled' : 'primary'" type="submit" class="w-full cursor-pointer button mt-3 md:mt-0">
                        {{isSubmitting ? 'Submitting...' : 'Save'}}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import {ref, computed, watchEffect, watch, reactive} from "vue"

import {useStore} from "vuex"
import { useField, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import InputSwitch from 'primevue/inputswitch';

import useWeb3 from "@/connectors/hooks";
import useSigner from "@/hooks/useSigner";
import {clean} from "@/services/utils/index";
import { UserService } from "@/services/apiService"

export default {
  name: "NotificationsManagerForm",
  components: {
    InputSwitch,
  },
  props: {
    showTitle: Boolean,
    isModal: Boolean,
  },
  setup(props) {

    const store = useStore();
    const toast = useToast();
    const {account} = useWeb3();

    console.log({account})

    const editModeRef = ref(false);
    const isSubmittingRef = ref(false);

    const title = 'Notification Manager';
    const user = computed(() => store.getters['user/user']);
    const userEmailPreferences = computed(() => store.getters['user/userEmailPreferences']);
    const editMode = computed(() => editModeRef.value);
    const isSubmitting = computed(() => isSubmittingRef.value);

    const form = useForm({
      initialValues: {
        email: user?.value?.email ? "******************" : "",
        global_disable: false,
        outbid: true,
        claim_page_go_live: true,
      },
    });

    const emailField = reactive(useField("email", "required|email"));
    const globalDisableField = reactive(useField("global_disable", inputValue => inputValue === true || inputValue === false));
    const outbidField = reactive(useField("outbid", inputValue => inputValue === true || inputValue === false));
    const claimPageGoLiveField = reactive(useField("claim_page_go_live", inputValue => inputValue === true || inputValue === false));

    watchEffect(() => {
        let { resetField } = emailField;
        let { resetField: resetGlobalDisableField } = globalDisableField;
        let { resetField: resetOutbidField } = outbidField;
        let { resetField: resetClaimPageGoLiveField } = claimPageGoLiveField;
        console.log({'user?.value': user?.value, 'user?.value?.email': user?.value?.email, 'emailField?.resetValue': emailField?.resetValue, emailField, resetField})
        if(resetField) {
            if(user?.value?.email === true) {
                editModeRef.value = false;
                resetField({
                    value: "******************"
                });
            } else if(!user?.value?.email && account?.value && user?.value?.is_not_registered) {
                editModeRef.value = true;
                resetField({
                    value: "",
                });
                resetGlobalDisableField({
                    value: false
                });
                resetOutbidField({
                    value: true
                });
                resetClaimPageGoLiveField({
                    value: true
                });
            } else if(user?.value?.email) {
                editModeRef.value = true;
                resetField({
                    value: user?.value?.email
                });
            } else if(user?.value?.email === false) {
                if(!userEmailPreferences?.value) {
                    editModeRef.value = false;
                }
                resetField({
                    value: ""
                });
            }
        }
    });

    watch(userEmailPreferences, () => {
        let { resetField: resetGlobalDisableField } = globalDisableField;
        let { resetField: resetOutbidField } = outbidField;
        let { resetField: resetClaimPageGoLiveField } = claimPageGoLiveField;
        if(userEmailPreferences?.value) {
            let globalDisableStoreValue = userEmailPreferences?.value['global_disable'];
            if((globalDisableStoreValue !== undefined) && (globalDisableStoreValue !== globalDisableField.value)) {
                resetGlobalDisableField({
                    value: !!globalDisableStoreValue
                })
            }
            let outbidStoreValue = userEmailPreferences?.value['outbid'];
            if((outbidStoreValue !== undefined) && (outbidStoreValue !== outbidField.value)) {
                resetOutbidField({
                    value: !!outbidStoreValue
                })
            }
            let claimPageGoLiveStoreValue = userEmailPreferences?.value['claim_page_go_live'];
            if((claimPageGoLiveStoreValue !== undefined) && (claimPageGoLiveStoreValue !== claimPageGoLiveField.value)) {
                resetClaimPageGoLiveField({
                    value: !!claimPageGoLiveStoreValue
                })
            }
        }
    })

    console.log({user, emailField, globalDisableField})

    const deleteEmailAddress = async () => {
        const signer = useSigner();
        const msg = `{"reason":"Delete SEEN.HAUS account email address","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`

        if (signer) {
            const signature = await signer
            .signMessage(msg)
            .catch((e) => {
                toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
                return e;
            });

            UserService.deleteEmailAddress(account.value, {signature, msg})
              .then(res => {
                    console.log({res})
                    store.dispatch('user/setUser', res.data.user);
                    editModeRef.value = true;
                    toast.add({severity:'info', summary:'Success', detail:'Email address successfully deleted.', life: 5000});
              })
              .catch(e => {
                console.error(e)
                toast.add({severity:'error', summary:'Error', detail:'Deleting email address failed.', life: 5000});
            });
        }
    }

    const showEmailAddressAndPreferences = async () => {
        const signer = useSigner();
        const msg = `{"reason":"Show SEEN.HAUS account email address and preferences","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`

        if (signer) {
            const signature = await signer
            .signMessage(msg)
            .catch((e) => {
                toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
                return e;
            });

            UserService.getEmailAddressAndPreferences(account.value, {signature, msg})
              .then(res => {
                    console.log({res})
                    store.dispatch('user/setUser', res.data.user);
                    store.dispatch('user/setUserEmailPreferences', res.data.email_preferences);
                    editModeRef.value = true;
                    toast.add({severity:'info', summary:'Success', detail:'Email address & preferences successfully fetched.', life: 3000});
              })
              .catch(e => {
                console.error(e)
                toast.add({severity:'error', summary:'Error', detail:'Fetching email address failed.', life: 3000});
            });
        }
    }

    const onSubmit = form.handleSubmit(async (values) => {
        console.log({values: JSON.stringify(values), 'emailField.value': emailField.value})
      const signer = useSigner();
      const msg = `{"reason":"Update SEEN.HAUS account email address & preferences","account":"${account.value}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`

      if (signer) {
        const signature = await signer
          .signMessage(msg)
          .catch((e) => {
            toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
            return e;
        });

        isSubmittingRef.value = true;

        values = clean(values);
        UserService.updateEmailAddressAndPreferences(account.value, {...values, signature, msg})
          .then(res => {
            store.dispatch('user/setUser', res.data.user);
            store.dispatch('user/setUserEmailPreferences', res.data.email_preferences);
            isSubmittingRef.value = false;
            toast.add({severity:'info', summary:'Success', detail:'Your email address & preferences have been updated.', life: 5000});
            if(props.isModal) {
                store.dispatch('application/closeModal');
            }
          })
          .catch(e => {
            console.error(e)
            isSubmittingRef.value = false;
            toast.add({severity:'error', summary:'Error', detail:'Email address & preferences update failed.', life: 3000});
        });
      }
    });

    const openWalletModal = () => {
      store.dispatch('application/openModal', 'WalletModalConnectOnly')
    };

    return {
        user,
        title,
        emailField,
        globalDisableField,
        outbidField,
        claimPageGoLiveField,
        onSubmit,
        editMode,
        showEmailAddressAndPreferences,
        deleteEmailAddress,
        isSubmitting,
        account,
        openWalletModal,
    }
  }
}
</script>

<style scoped>

</style>

<template>
    <div class="flex w-full mt-8">
        <div class="mint-info-form-container">
            <div class="fc mb-3">
                <label class="font-semibold uppercase text-md text-black">Type</label>
            </div>
            <div class="selection-container mb-6">
                <div class="selection-option-wrapper" :class="data.selectedType === 'auction' ? 'active-selection-option' : 'inactive-selection-option'">
                    <div
                        class="selection-option cursor-pointer"
                        @click="setSelectedType('auction')"
                    >
                        <div class="selection-option-text-container">
                            <sub-title
                                class="text-black hidden uppercase lg:flex"
                                text-align="center"
                                font-size="15px"
                            >
                                Auction
                            </sub-title>
                            <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                        </div>
                    </div>
                </div>
                <div class="selection-option-wrapper" :class="data.selectedType === 'sale' ? 'active-selection-option' : 'inactive-selection-option'">
                    <div 
                        class="selection-option cursor-pointer"
                        @click="setSelectedType('sale')"
                    >
                        <div class="selection-option-text-container">
                            <sub-title
                                class="text-black hidden uppercase lg:flex"
                                text-align="center"
                                font-size="15px"
                            >
                                Sale
                            </sub-title>
                            <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fc mb-8">
                <div class="flex-space-between">
                    <label class="font-semibold uppercase text-md text-black" for="price">Reserve Price</label>
                </div>
                <div class="input-inner-label">
                    <div class="input-icon-label" style="width: 50px;height: 20px;">
                        <img src="@/assets/icons/ethereum-icon.svg"  class="" alt="Ethereum logo">
                        <sub-title
                            class="text-black hidden uppercase lg:flex light-mode-text-washed"
                            text-align="center"
                            font-size="15px"
                        >
                            ETH
                        </sub-title>
                    </div>
                    <input
                        type="number"
                        id="price"
                        class="w-full outlined-input mt-2"
                        placeholder="Minimum acceptable price"
                        :class="priceField.errors[0] && 'invalid-outline'"
                        v-model="priceField.value"
                    />
                </div>
                <span class="error-notice">{{ priceField.errors[0] }}</span>
            </div>
            <button :disabled="invalid" :class="data.isNextStepReady ? 'primary' : 'disabled'" class="button mt-6 w-full" @click="nextStep">
                Continue
            </button>
        </div>
        <div class="preview-container">
            <drop-card-preview :tangibility="data.selectedType" :tags="data.tags" :titleText="priceField.value" :creatorAccount="creatorData.account" :creatorProfilePicture="creatorData.profilePicture" :creatorUsername="creatorData.username" :mediaUrl="mediaUrl" />
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import {useField, useForm} from "vee-validate";
import {useStore} from "vuex"

import Chips from 'primevue/chips';

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import useWeb3 from "@/connectors/hooks"

export default {
    name: "TypeSelection",
    props: {
        nextStep: Function,
        setListingType: Function,
    },
    methods: {
        setSelectedType(type) {
            this.data.selectedType = type;
            this.setListingType(type)
        },
    },
    components: {
        SubTitle,
        LightTypography,
        DropCardPreview,
        Chips,
    },
    setup(props) {

        const store = useStore();
        
        const userLocal = computed(() => store.getters['user/user']);

        const creatorData = ref({
            account: false,
            profilePicture: false,
            username: false,
        });

        watchEffect(() => {
            let userStoreData = store.getters['user/user'];
            if(userStoreData) {
                if(userStoreData?.username?.length > 0) {
                    creatorData.value.username = userStoreData.username;
                }
                if(userStoreData?.wallet?.length > 0) {
                    creatorData.value.account = userStoreData.wallet;
                }
                if(userStoreData?.image?.length > 0) {
                    creatorData.value.profilePicture = userStoreData.image;
                }
            } else if(account) {
                creatorData.value.profilePicture = false;
                creatorData.value.username = false;
                creatorData.value.account = account.value;
            }
            console.log({'creatorData.value': creatorData.value})
        })

        const { account } = useWeb3();

        const data = reactive({
            selectedType: null,
            isNextStepReady: false,
        })

        let maxLengths = {
            title: 30,
            description: 500,
            tags: 10,
        }

        const priceField = reactive(useField("price", `required|min:1|max:${maxLengths.title}`));

        // watchEffect(() => {
        //     if(data.selectedType === 'nft-physical') {
        //         if(countryField.meta.valid && provinceField.meta.valid && cityField.meta.valid) {
        //             data.isNextStepReady = true;
        //             props.setLocationData(countryField.value, provinceField.value, cityField.value);
        //             return;
        //         }
        //         props.clearLocationData();
        //     } else if (data.selectedType === 'nft-digital') {
        //         data.isNextStepReady = true;
        //         props.clearLocationData();
        //         return;
        //     }
        //     data.isNextStepReady = false;
        // })

        return {
            priceField,
            data,
            maxLengths,
            creatorData,
        }

    }
};
</script>

<style lang="scss" scoped>
    .mint-info-form-container {
        max-width: 800px;
        width: 60%;
    }
    .preview-container {
        width: 40%;
    }
    .selection-container {
        display: flex;
        justify-content: space-between;
    }
    .selection-option-wrapper {
        width: calc(50% - 8px);
    }
    .section-description {
        display: flex;
        max-width: 600px;
    }
    .selection-option {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        padding-top: 33px;
        padding-bottom: 33px;
        border-radius: 8px;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        background-color: white;
    }
    .icon-container {
        width: 48px;
        height: 48px;
        margin-right: 20px;
        border-radius: 35px;
    }
    .inactive-icon-container {
        @apply bg-black;
    }
    .active-icon-container {
        background: linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%);
    }
    .selection-option-text-container {
        max-width: calc(100% - 88px);
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .active-selection-option {
        background: linear-gradient(to right, #11998E, #38EF7D);
        border-radius: 10px;
        padding: 2px;
        .selection-option {
            background: #eafbf3;
        }
    }
    .inactive-selection-option {
        background-color: white;
        border-radius: 10px;
        padding: 2px;
    }
</style>

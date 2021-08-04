<template>
    <div class="type-selection-step-container auto-margins">
        <sub-title
            class="text-black hidden lg:flex pb-6 pt-12"
            text-align="center"
        >
            Select type of your NFT
        </sub-title>
        <div class="section-description auto-margins pb-12">
            <light-typography>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </light-typography>
        </div>
        <div class="selection-container">
            <div class="mb-6" :class="data.selectedType === 'nft-digital' ? 'active-selection-option' : 'inactive-selection-option'">
                <div
                    class="selection-option cursor-pointer"
                    @click="setSelectedType('nft-digital')"
                >
                    <div 
                        class="icon-container flex-center"
                        :class="data.selectedType === 'nft' ? 'active-icon-container' : 'inactive-icon-container'"
                    >
                        <img src="@/assets/icons/type-mint-nft-icon.svg" alt="Type NFT Only Icon">
                    </div>
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden lg:flex mb-2 mt-1"
                            text-align="center"
                            font-size="24px"
                        >
                            Mint NFT
                        </sub-title>
                        <light-typography
                            text-align="left"
                            font-size="14px"
                            font-weight="400"
                        >
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </light-typography>
                    </div>
                </div>
            </div>
            <div :class="data.selectedType === 'nft-physical' ? 'active-selection-option' : 'inactive-selection-option'">
                <div 
                    class="selection-option cursor-pointer"
                    @click="setSelectedType('nft-physical')"
                >
                    <div 
                        class="icon-container flex-center"
                        :class="data.selectedType === 'nft-physical' ? 'active-icon-container' : 'inactive-icon-container'"
                    >
                        <img src="@/assets/icons/type-mint-nft-physical-icon.svg" alt="Type NFT Only Icon">
                    </div>
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden lg:flex mb-2 mt-1"
                            text-align="center"
                            font-size="24px"
                        >
                            Mint NFT + Physical
                        </sub-title>
                        <light-typography
                            text-align="left"
                            font-size="14px"
                            font-weight="400"
                        >
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </light-typography>
                    </div>
                </div>
            </div>
            <div v-if="data.selectedType === 'nft-physical'" style="margin-top: 15px;">
                
                <form
                    @submit="onSubmit"
                    class="font-semibold uppercase text-md text-black"
                >
                    <div class="fc mb-4">
                        <label for="country">Country</label>
                        <select v-model="countryField.value" name="country" id="country" autocomplete="country-name" class="w-full outlined-input mt-2">
                        <option :value="country" v-for="country in countries" :key="country">{{country}}</option>
                        </select>
                        <span class="error-notice">{{ countryField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-4">
                        <label for="winner-state">State / Province</label>
                        <input
                            type="text"
                            id="winner-state"
                            class="w-full outlined-input mt-2"
                            autocomplete="address-level1"
                            v-model="provinceField.value"
                        />
                        <span class="error-notice">{{ provinceField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-4">
                        <label for="winner-city">City</label>
                        <input
                        type="text"
                        id="winner-city"
                        class="w-full outlined-input mt-2"
                        autocomplete="address-level2"
                        v-model="cityField.value"
                        />
                        <span class="error-notice">{{ cityField.errors[0] }}</span>
                    </div>
                </form>
            </div>
            <button :disabled="invalid" :class="data.isNextStepReady ? 'primary' : 'disabled'" class="button mt-6 w-full" @click="nextStep">
                Continue
            </button>
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import {useField, useForm} from "vee-validate";

import { countryList } from "@/connectors/constants";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
    name: "TypeSelection",
    props: {
        nextStep: Function,
        setTangibility: Function,
        setLocationData: Function,
        clearLocationData: Function,
    },
    methods: {
        setSelectedType(type) {
            this.data.selectedType = type;
            if (type === 'nft-digital') {
                this.data.isNextStepReady = true;
                this.setTangibility('nft-digital')
            } else if (type === 'nft-physical') {
                this.setTangibility('nft-physical');
                if(this.data.locationData.country && this.data.locationData.province && this.data.locationData.city) {
                    this.data.isNextStepReady = true;
                }else{
                    this.data.isNextStepReady = false;
                }
            }
        },
    },
    components: {
        SubTitle,
        LightTypography,
    },
    setup(props) {
        
        const data = reactive({
            selectedType: null,
            locationData: {
                country: false,
                province: false,
                city: false,
            },
            isNextStepReady: false,
        })

        const form = useForm({
            initialValues: {
                country: null,
                province: "",
                city: ""
            },
        });

        const countries = countryList;

        const countryField = reactive(useField("country", "required|min:3"));
        const provinceField = reactive(useField("province", "required|min:3"));
        const cityField = reactive(useField("city", "required|min:3"));

        watchEffect(() => {
            if(data.selectedType === 'nft-physical') {
                if(countryField.meta.valid && provinceField.meta.valid && cityField.meta.valid) {
                    data.isNextStepReady = true;
                    props.setLocationData(countryField.value, provinceField.value, cityField.value);
                    return;
                }
                props.clearLocationData();
            } else if (data.selectedType === 'nft-digital') {
                data.isNextStepReady = true;
                props.clearLocationData();
                return;
            }
            data.isNextStepReady = false;
        })

        return {
            countries,
            form,
            countryField,
            provinceField,
            cityField,
            data
        }

    }
};
</script>

<style lang="scss" scoped>
    .type-selection-step-container {
        max-width: 800px;
    }
    .section-description {
        display: flex;
        max-width: 600px;
    }
    .selection-option {
        display: flex;
        align-items: center;
        padding: 34px;
        border-radius: 8px;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        background-color: white;
    }
    .icon-container {
        width: 64px;
        height: 64px;
        margin-right: 24px;
        border-radius: 35px;
    }
    .inactive-icon-container {
        @apply bg-black;
    }
    .active-icon-container {
        background: linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%);
    }
    .selection-option-text-container {
        align-items: flex-start;
        max-width: calc(100% - 88px);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .active-selection-option {
        background: linear-gradient(to right, #11998E, #38EF7D);
        border-radius: 10px;
        padding: 2px;
    }
    .inactive-selection-option {
        background-color: white;
        border-radius: 10px;
        padding: 2px;
    }
</style>

<template>
    <div class="flex w-full mt-8">
        <div class="mint-info-form-container">
            <form
                @submit="onSubmit"
                class="font-semibold uppercase text-md text-black"
            >
                <div class="fc mb-6">
                    <div class="flex-space-between">
                        <label for="title">Title</label>
                        <label 
                            :class="titleField?.value?.length > maxLengths.title ? 'error-text' : 'light-mode-text-washed'"
                        >
                            {{titleField.value ? titleField.value.length : 0}} / {{maxLengths.title}}
                        </label>
                    </div>
                    <input
                        type="text"
                        id="title"
                        class="w-full outlined-input mt-2"
                        placeholder="Name your NFT"
                        :class="titleField.errors[0] && 'invalid-outline'"
                        v-model="titleField.value"
                    />
                    <span class="error-notice">{{ titleField.errors[0] }}</span>
                </div>
                <div class="fc mb-6">
                    <div class="flex-space-between">
                        <label for="description">Description</label>
                        <label 
                            :class="descriptionField?.value?.length > maxLengths.description ? 'error-text' : 'light-mode-text-washed'"
                        >
                            {{descriptionField.value ? descriptionField.value.length : 0}} / {{maxLengths.description}}
                        </label>
                    </div>
                    <textarea 
                        name="description"
                        id="description"
                        class="w-full outlined-input mt-2"
                        :class="descriptionField.errors[0] && 'invalid-outline'"
                        placeholder="Tell the world more about your piece"
                        v-model="descriptionField.value"
                        spellcheck="true"
                        rows="7"
                        style="height: auto"
                    />
                    <span class="error-notice">{{ descriptionField.errors[0] }}</span>
                </div>
                <div class="fc mb-6">
                    <div class="flex-space-between">
                        <label for="description">Tags</label>
                        <label 
                            :class="data.tagLength > maxLengths.tags ? 'error-text' : 'light-mode-text-washed'"
                        >
                            {{data.tagLength ? data.tagLength : 0}} / {{maxLengths.tags}}
                        </label>
                    </div>
                    <Chips :class="data.tagLength > maxLengths.tags && 'invalid-outline'" class="w-full outlined-input mt-2" placeholder="Keywords about your piece separated by commas" v-model="data.tags" separator="," />
                </div>
            </form>
            <div class="selection-container">
                <div class="selection-option-wrapper" :class="data.selectedType === 'nft-digital' ? 'active-selection-option' : 'inactive-selection-option'">
                    <div
                        class="selection-option cursor-pointer"
                        @click="setSelectedType('nft-digital')"
                    >
                        <div 
                            class="icon-container flex-center"
                            :class="data.selectedType === 'nft-digital' ? 'active-icon-container' : 'inactive-icon-container'"
                        >
                            <img src="@/assets/icons/type-mint-nft-icon.svg" alt="Type NFT Only Icon">
                        </div>
                        <div class="selection-option-text-container">
                            <sub-title
                                class="text-black hidden lg:flex mb-1 mt-2"
                                text-align="center"
                                font-size="15px"
                            >
                                NFT ONLY
                            </sub-title>
                            <i class="fas fa-info-circle light-mode-text-washed mt-1 ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                        </div>
                    </div>
                </div>
                <div class="selection-option-wrapper" :class="data.selectedType === 'nft-physical' ? 'active-selection-option' : 'inactive-selection-option'">
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
                                class="text-black hidden lg:flex mb-1 mt-2"
                                text-align="center"
                                font-size="15px"
                            >
                                NFT + PHYSICAL
                            </sub-title>
                            <i class="fas fa-info-circle light-mode-text-washed mt-1 ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="data.selectedType === 'nft-physical'" style="margin-top: 15px;">
                <form
                    @submit="onSubmit"
                    class="font-semibold uppercase text-md text-black"
                >
                    <div class="fc mb-6">
                        <label for="country">Country</label>
                        <select :class="countryField.errors[0] && 'invalid-outline'" v-model="countryField.value" name="country" id="country" autocomplete="country-name" class="w-full outlined-input mt-2">
                        <option :value="country" v-for="country in countries" :key="country">{{country}}</option>
                        </select>
                        <span class="error-notice">{{ countryField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-6">
                        <label for="winner-state">State / Province</label>
                        <input
                            type="text"
                            id="winner-state"
                            class="w-full outlined-input mt-2"
                            :class="provinceField.errors[0] && 'invalid-outline'"
                            autocomplete="address-level1"
                            v-model="provinceField.value"
                        />
                        <span class="error-notice">{{ provinceField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-6">
                        <label for="winner-city">City</label>
                        <input
                            type="text"
                            id="winner-city"
                            class="w-full outlined-input mt-2"
                            :class="cityField.errors[0] && 'invalid-outline'"
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
        <div class="preview-container">
            <drop-card-preview :tangibility="data.selectedType" :tags="data.tags" :titleText="titleField.value" :creatorAccount="creatorData.account" :creatorProfilePicture="creatorData.profilePicture" :creatorUsername="creatorData.username" :mediaUrl="mediaUrl" />
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import {useField, useForm} from "vee-validate";
import {useStore} from "vuex"

import Chips from 'primevue/chips';

import { countryList } from "@/connectors/constants";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import useWeb3 from "@/connectors/hooks"

export default {
    name: "TypeSelection",
    props: {
        mediaUrl: String,
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
            locationData: {
                country: false,
                province: false,
                city: false,
            },
            isNextStepReady: false,
            tags: [],
            tagLength: 0,
        })

        const form = useForm({
            initialValues: {
                country: null,
                province: "",
                city: "",
                title: "",
                description: "",
            },
        });

        const countries = countryList;

        let maxLengths = {
            title: 30,
            description: 500,
            tags: 10,
        }

        const countryField = reactive(useField("country", "required|min:3"));
        const provinceField = reactive(useField("province", "required|min:3"));
        const cityField = reactive(useField("city", "required|min:3"));
        const titleField = reactive(useField("title", `required|min:1|max:${maxLengths.title}`));
        const descriptionField = reactive(useField("description", `required|min:1|max:${maxLengths.description}`));

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

        watchEffect(() => {
            if(data.tags) {
                data.tagLength = data.tags.reduce((accumulator, current) => accumulator + current, "").length;
            }
        })

        console.log({'userLocal?.value': userLocal?.value, 'userLocal?.value?.wallet': userLocal?.value?.wallet})

        return {
            countries,
            form,
            countryField,
            provinceField,
            cityField,
            titleField,
            descriptionField,
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
        padding: 20px;
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

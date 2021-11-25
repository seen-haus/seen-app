<template>
    <div class="flex w-full mt-8">
        <div class="mint-info-form-container">
            <sub-title
                class="light-self-create-back-button light-mode-text-washed disable-text-transform clickable hidden lg:flex mb-1 mt-2"
                text-align="left"
                font-size="13px"
                @click="prevStep"
            >
                <i class="fas fa-chevron-left mr-1"></i>Go Back
            </sub-title>
            <div :class="data.nftTokenId && 'cursor-not-allowed'">
                <div :class="data.nftTokenId && 'disabled opacity-0-6'">
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
                                <label for="units">Unit Count</label>
                                <label 
                                    :class="unitField?.value?.length > maxLengths.units ? 'error-text' : 'light-mode-text-washed'"
                                >
                                    {{unitField.value ? unitField.value.length : 0}} / {{maxLengths.units}}
                                </label>
                            </div>
                            <input
                                type="number"
                                id="units"
                                @wheel="$event.target.blur()"
                                class="w-full outlined-input mt-2"
                                placeholder="How many units or editions of this NFT will there be?"
                                :class="unitField.errors[0] && 'invalid-outline'"
                                v-model="unitField.value"
                            />
                            <span class="input-helper disable-text-transform">For auctions, use a unit count of 1. Fixed price sales may have a unit count above 1.</span>
                            <span class="error-notice">{{ unitField.errors[0] }}</span>
                        </div>
                        <div class="fc mb-6">
                            <div class="flex-space-between">
                                <label>Secondary Market Royalty Fee ({{data.secondaryRoyaltyFee.toFixed(2)}}%)</label>
                            </div>
                            <div class="mt-4">
                                <Slider :step="0.25" v-model="data.secondaryRoyaltyFee" :max="15" :min="1" />
                            </div>
                        </div>
                        <div class="fc mb-6">
                            <div class="flex-space-between">
                                <label for="tags">Tags</label>
                                <label 
                                    :class="data.tagLength > maxLengths.tags ? 'error-text' : 'light-mode-text-washed'"
                                >
                                    {{data.tagLength ? data.tagLength : 0}} / {{maxLengths.tags}}
                                </label>
                            </div>
                            <Chips :class="data.tagLength > maxLengths.tags && 'invalid-outline'" class="w-full outlined-input mt-2" placeholder="Keywords about your piece separated by commas" v-model="data.tags" separator="," />
                        </div>
                        <div class="fc mb-6">
                            <div class="flex-space-between mb-2">
                                <label for="properties">Properties</label>
                            </div>
                            <div class="metadata-property-grid-container">
                                <div v-for="(propertySlot, index) in data.properties" :key="`saved-property-slot-${index}`" class="metadata-property-grid-item py-4">
                                    <sub-title
                                        class="hidden lg:flex"
                                        text-align="center"
                                        font-size="14px"
                                    >
                                        {{propertySlot.trait_type}}
                                    </sub-title>
                                    <sub-title
                                        class="disable-text-transform light-mode-text-washed property-value-text hidden lg:flex mt-1"
                                        text-align="center"
                                        font-size="18px"
                                        font-weight="300"
                                    >
                                        {{propertySlot.value}}
                                    </sub-title>
                                </div>
                            </div>
                            <sub-title
                                class="text-black disable-text-transform green-text clickable hidden lg:flex mb-1 mt-2"
                                text-align="left"
                                font-size="13px"
                                @click="showPropertiesModal"
                            >
                                Modify Properties <i class="fas fa-plus-circle mr-2"></i>
                            </sub-title>
                        </div>
                        <mint-properties-modal :properties="data.properties" :setProperties="setProperties"/>
                        <div class="fc mb-6">
                            <div class="flex flex-col">
                                <div>
                                    <label for="rights">Rights</label>
                                </div>
                                <div class="mt-2">
                                    <RadioButton id="rights1" name="rights" value="commercial-included" v-model="data.rights" />
                                    <label for="rights1" class="ml-2">Commercial Rights Included</label>
                                </div>
                                <div class="mt-2">
                                    <RadioButton id="rights2" name="rights" value="non-commercial-included" v-model="data.rights" />
                                    <label for="rights2" class="ml-2">Non-Commercial Rights Included</label>
                                </div>
                                <div class="mt-2">
                                    <RadioButton id="rights3" name="rights" value="rights-not-included" v-model="data.rights" />
                                    <label for="rights3" class="ml-2">Rights Not Included</label>
                                </div>
                            </div>
                        </div>
                        <div class="fc mb-2">
                            <label for="rights">Tangibility</label>
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
                                        class="text-black hidden lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                    >
                                        NFT ONLY
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                                </div>
                            </div>
                        </div>
                        <div class="selection-option-wrapper" :class="data.selectedType === 'nft-physical' ? 'active-selection-option' : 'inactive-selection-option'">
                            <div 
                                class="selection-option"
                                :class="data.isEscrowAgent ? 'cursor-pointer' : 'cursor-not-allowed'"
                                @click="data.isEscrowAgent && setSelectedType('nft-physical')"
                            >
                                <div :class="!data.isEscrowAgent && 'opacity-50'">
                                    <div 
                                        class="icon-container flex-center"
                                        :class="data.selectedType === 'nft-physical' ? 'active-icon-container' : 'inactive-icon-container'"
                                    >
                                        <img src="@/assets/icons/type-mint-nft-physical-icon.svg" alt="Type NFT Only Icon">
                                    </div>
                                </div>
                                <div class="selection-option-text-container">
                                    <sub-title
                                        class="text-black hidden lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                        :class="!data.isEscrowAgent && 'opacity-50'"
                                    >
                                        NFT + PHYSICAL
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="!data.isEscrowAgent && {text: `Minting NFT + Physical pairs requires the ESCROW_AGENT role, please contact the SEEN.HAUS team if you would like to find out more about getting this role.`}"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="data.selectedType === 'nft-physical'" style="margin-top: 15px;">
                        <form
                            @submit="onSubmit"
                            class="font-semibold text-md text-black"
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
                </div>
            </div>
            <button :disabled="invalid" :class="(data.preparedMetaDataLocal && !data.isUploadingMetaData && !metaDataIpfsHashData) ? 'primary' : 'disabled'" class="button mt-6 w-full" @click="uploadMetaDataToIPFS">
                {{data.isUploadingMetaData ? 'Distributing Metadata To IPFS...' : 'Upload Metadata To IPFS'}}
            </button>
            <button v-if="metaDataIpfsHashData" id="mint-button" :disabled="invalid" :class="(metaDataIpfsHashData && data.preparedMetaDataLocal && !data.nftTokenId) ? 'primary' : 'disabled'" class="button mt-6 w-full" @click="mintNftOnChain">
                Mint NFT On-Chain
            </button>
            <button v-if="data.nftTokenId" class="button mt-6 w-full primary" @click="nextStep">
                Continue
            </button>
            <!-- <sub-title
                class="disable-text-transform green-text clickable hidden lg:flex mb-1 mt-2"
                text-align="left"
                font-size="13px"
                @click="toggleShowMetaData"
            >
                {{data.showPreparedMetaData ? 'Hide' : 'View'}} Prepared Token Metadata <i class="fas fa-eye mr-2"></i>
            </sub-title>
            <div :class="(data.preparedMetaDataLocal && data.showPreparedMetaData) ? 'max-height-transition hidden-metadata' : 'max-height-transition shown-metadata'">
                <pre>{{JSON.stringify(data.preparedMetaDataLocal, null, 4)}}</pre>
            </div> -->
        </div>
        <div class="preview-container">
            <drop-card-preview 
                :autoMargins="true"
                :sticky="true"
                :listingType="listingTypeData"
                :startTime="openingTimeUnixData ? openingTimeUnixData * 1000 : null"
                :priceType="priceTypeData"
                :price="priceData"
                :units="unitField.value"
                :items="unitData"
                :itemsOf="unitData"
                :tangibility="data.selectedType"
                :tags="data.tags"
                :titleText="titleField.value"
                :creatorAccount="creatorData.account"
                :creatorProfilePicture="creatorData.profilePicture"
                :creatorUsername="creatorData.username"
                :mediaUrl="mediaUrl"
                :collectableState="collectableState"
                :updateProgress="updateProgress"
                :progress="100"
                :timerState="timerState"
                :liveStatus="liveStatus"
            />
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import {useField, useForm} from "vee-validate";
import {useStore} from "vuex"

import { useToast } from "primevue/usetoast";

import RadioButton from 'primevue/radiobutton';
import Chips from 'primevue/chips';

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import { countryList } from "@/connectors/constants";
import useWeb3 from "@/connectors/hooks";

import useSigner from "@/hooks/useSigner";
import { useV3NftContractNetworkReactive } from '@/hooks/useContract.js';

import parseError from "@/services/utils/parseError";
import emitter from "@/services/utils/emitter";
import { IPFSService } from "@/services/apiService";

import MintPropertiesModal from "@/views/selfCreate/components/MintPropertiesModal.vue";

import { parseConsignmentRegisteredEventData } from "@/services/utils";

export default {
    name: "TypeSelection",
    props: {
        nextStep: Function,
        prevStep: Function,
        mediaUrl: String,
        setTangibilityData: Function,
        tangibilityData: String,
        setLocationData: Function,
        setCountryData: Function,
        setProvinceData: Function,
        setCityData: Function,
        clearLocationData: Function,
        locationDataCountry: String,
        locationDataProvince: String,
        locationDataCity: String,
        setPropertyData: Function,
        propertyData: Array,
        setTitleData: Function,
        titleData: String,
        setDescriptionData: Function,
        descriptionData: String,
        setTagData: Function,
        tagData: Array,
        setRightsData: Function,
        rightsData: String,
        setUnitData: Function,
        unitData: Number,
        priceData: String,
        priceTypeData: String,
        openingTimeUnixData: String,
        listingTypeData: String,
        setPreparedMetaData: Function,
        preparedMetaData: Object,
        setMetaDataIpfsHashData: Function,
        metaDataIpfsHashData: String,
        mediaIpfsHash: String,
        setNftTokenIdData: Function,
        nftTokenIdData: String,
        setNftConsignmentIdData: Function,
        consignmentIdData: String,
        isEscrowAgentData: Boolean,
        setSecondaryRoyaltyFeeData: Function,
        secondaryRoyaltyFeeData: String,
        collectableState: [String, Boolean],
        updateProgress: Function,
        timerState: [String, Boolean],
        liveStatus: [String, Boolean],
    },
    methods: {
        setSelectedType(type) {
            this.data.selectedType = type;
            if (type === 'nft-digital') {
                this.setTangibilityData('nft-digital')
            } else if (type === 'nft-physical') {
                this.setTangibilityData('nft-physical');
            }
        },
        setProperties(properties) {
            let builtProperties = [];
            for(let item of properties) {
                if(item.trait_type && item.value) {
                    builtProperties.push({
                        trait_type: item.trait_type,
                        value: item.value,
                    })
                }
            }
            this.data.properties = builtProperties;
            this.setPropertyData(builtProperties);
        },
        toggleShowMetaData() {
            this.data.showPreparedMetaData = !this.data.showPreparedMetaData;
        },
    },
    components: {
        SubTitle,
        LightTypography,
        DropCardPreview,
        Chips,
        MintPropertiesModal,
        RadioButton,
    },
    setup(props) {

        const store = useStore();
        const toast = useToast();
        
        const userLocal = computed(() => store.getters['user/user']);

        const creatorData = ref({
            account: false,
            profilePicture: false,
            username: false,
        });

        const showPropertiesModal = () => {
            emitter.emit("openNftMintPropertiesModal");
        };

        const { account } = useWeb3();

        watchEffect(() => {
            // If the logic here is changed (i.e. how it calculates the creator username/image)
            // Make sure to check if anything needs change in ProcessRecoveryCard.vue
            let userStoreData = store.getters['user/user'];
            if(userStoreData) {
                if(userStoreData?.username?.length > 0) {
                    creatorData.value.username = userStoreData.username;
                } else {
                    creatorData.value.username = false;
                }
                if(userStoreData?.wallet?.length > 0) {
                    creatorData.value.account = userStoreData.wallet;
                } else {
                    creatorData.value.account = false;
                }
                if(userStoreData?.image?.length > 0) {
                    creatorData.value.profilePicture = userStoreData.image;
                } else {
                    creatorData.value.profilePicture = false;
                }
            } else if(account) {
                creatorData.value.profilePicture = false;
                creatorData.value.username = false;
                creatorData.value.account = account.value;
            }
        })

        const data = reactive({
            selectedType: props.tangibilityData ? props.tangibilityData : null,
            locationData: {
                country: false,
                province: false,
                city: false,
            },
            isNextStepReady: false,
            secondaryRoyaltyFee: props.secondaryRoyaltyFeeData || 5,
            tags: props.tagData || [],
            tagLength: 0,
            properties: props.propertyData || [],
            rights: false,
            preparedMetaDataLocal: props.preparedMetaData || false,
            showPreparedMetaData: false,
            isUploadingMetaData: false,
            nftTokenId: props.nftTokenIdData || false,
            consignmentIdData: props.nftConsignmentIdData || false,
            isEscrowAgent: props.isEscrowAgentData || false,
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
            description: 1000,
            units: 5,
            tags: 25, // Max text length of combined tags
            properties: 10, // 10 properties max, not a limit per text value
        }

        const countryField = reactive(useField("country", "required|min:3"));
        const provinceField = reactive(useField("province", "required|min:3"));
        const cityField = reactive(useField("city", "required|min:3"));
        const titleField = reactive(useField("title", `required|min:1|max:${maxLengths.title}`));
        const unitField = reactive(useField("units", `required|integer|min:1|max:${maxLengths.units}|min_value:1|max_value:99999`));
        const descriptionField = reactive(useField("description", `required|min:1|max:${maxLengths.description}`));

        watchEffect(() => {
            let { resetField } = titleField;
            if(titleField?.value && (props.titleData !== titleField.value)) {
                props.setTitleData(titleField.value)
            } else if (titleField?.value === "" && props.titleData !== false) {
                props.setTitleData(false)
            } else if(props.titleData !== false && titleField?.value !== props.titleData) {
                resetField({
                    value: props.titleData
                })
            } else if (titleField?.value === "") {
                props.setTitleData(false)
            }
        })

        watchEffect(() => {
            data.nftTokenId = props.nftTokenIdData;
            data.nftConsignmentId = props.nftConsignmentIdData;
            data.isEscrowAgent = props.isEscrowAgentData;
        })

        watchEffect(() => {
            let { resetField } = descriptionField;
            if(descriptionField?.value && (props.descriptionData !== descriptionField?.value)) {
                props.setDescriptionData(descriptionField.value)
            } else if (descriptionField?.value === "" && props.descriptionData !== false) {
                props.setDescriptionData(false)
            } else if(props.descriptionData !== false && descriptionField?.value !== props.descriptionData) {
                resetField({
                    value: props.descriptionData
                })
            } else if (descriptionField?.value === "") {
                props.setDescriptionData(false)
            }
        })

        watchEffect(() => {
            let { resetField } = unitField;
            if(unitField?.value && (props.unitData !== unitField.value)) {
                props.setUnitData(unitField.value)
            } else if (unitField?.value === "" && props.unitData !== false) {
                props.setUnitData(false)
            } else if(props.unitData !== false && unitField?.value !== props.unitData) {
                resetField({
                    value: props.unitData
                })
            } else if (unitField?.value === "") {
                props.setUnitData(false)
            }
        })

        watchEffect(() => {
            if(data.secondaryRoyaltyFee) {
                if(data.secondaryRoyaltyFee <= 15) {
                    props.setSecondaryRoyaltyFeeData(data.secondaryRoyaltyFee)
                } else {
                    props.setSecondaryRoyaltyFeeData(false)
                }
            }
        })

        watchEffect(() => {
            if (data.selectedType === 'nft-digital') {
                props.clearLocationData();
                return;
            }
        })

        watchEffect(() => {
            if(data.tags) {
                data.tagLength = data.tags.reduce((accumulator, current) => accumulator + current, "").length;
                if(data.tagLength <= maxLengths.tags) {
                    props.setTagData(data.tags)
                } else {
                    props.setTagData(false)
                }
            }
        })

        watchEffect(() => {
            if(data.rights && (data.rights !== props.rightsData)) {
                props.setRightsData(data.rights)
            }else if(props.rightsData && (props.rightsData !== data.rights)) {
                data.rights = props.rightsData
            }
        })

        watchEffect(() => {
            let { resetField } = countryField;
            if(countryField?.value && (props.locationDataCountry !== countryField.value)) {
                props.setCountryData(countryField.value)
            } else if (countryField?.value === "" && props.locationDataCountry !== false) {
                props.setCountryData(false)
            } else if(props.locationDataCountry !== false && countryField?.value !== props.locationDataCountry) {
                resetField({
                    value: props.locationDataCountry
                })
            } else if (countryField?.value === "") {
                props.setCountryData(false)
            }
        })

        watchEffect(() => {
            let { resetField } = provinceField;
            if(provinceField?.value && (props.locationDataProvince !== provinceField.value)) {
                props.setProvinceData(provinceField.value)
            } else if (provinceField?.value === "" && props.locationDataProvince !== false) {
                props.setProvinceData(false)
            } else if(props.locationDataProvince !== false && provinceField?.value !== props.locationDataProvince) {
                resetField({
                    value: props.locationDataProvince
                })
            } else if (provinceField?.value === "") {
                props.setProvinceData(false)
            }
        })

        watchEffect(() => {
            let { resetField } = cityField;
            if(cityField?.value && (props.locationDataCity !== cityField.value)) {
                props.setCityData(cityField.value)
            } else if (cityField?.value === "" && props.locationDataCity !== false) {
                props.setCityData(false)
            } else if(props.locationDataCity !== false && cityField?.value !== props.locationDataCity) {
                resetField({
                    value: props.locationDataCity
                })
            } else if (cityField?.value === "") {
                props.setCityData(false)
            }
        })

        watchEffect(() => {
            // This doesn't actually handle validation, it's just meant to check if there are validation errors

            // Required fields
            let isValidTitle = titleField?.value && !titleField.errors[0];
            let isValidDescription = descriptionField?.value && !descriptionField.errors[0];
            let isValidUnit = unitField?.value && !unitField.errors[0];
            let isValidTangibility = data.selectedType;
            let isValidRoyaltyFee = data.secondaryRoyaltyFee && (data.secondaryRoyaltyFee <= 15) && (data.secondaryRoyaltyFee >= 1) && !isNaN(data.secondaryRoyaltyFee);

            let isValidLocationData = false;
            if(data.selectedType === 'nft-digital') {
                isValidLocationData = true;
            } else if(data.selectedType === 'nft-physical') {
                if((countryField?.value && !countryField.errors[0]) && (provinceField?.value && !provinceField.errors[0]) && (cityField?.value && !cityField.errors[0])) {
                    isValidLocationData = true;
                }
            }

            // Optional fields
            let isValidTags = data.tags.length === 0 || data.tagLength <= maxLengths.tags;
            let isValidProperties = data.properties.length === 0 || data.properties.length <= maxLengths.properties;
            let isValidRights = !data.rights || data.rights;

            if(
                isValidTitle
                && isValidDescription
                && isValidRoyaltyFee
                && isValidUnit
                && isValidTangibility
                && isValidLocationData
                && isValidTags
                && isValidProperties
                && isValidRights
                && props.mediaIpfsHash
            ) {
                data.preparedMetaDataLocal = {
                    "name": titleField?.value,
                    "description": descriptionField?.value,
                    "image":`ipfs://${props.mediaIpfsHash}`,
                    "tangibility": data.selectedType,
                    ...(data.rights && { rights: data.rights }),
                    ...(data.tags && (data.tags.length > 0) && { tags: data.tags }),
                    ...(data.properties && (data.properties.length > 0) && { attributes: data.properties }),
                }
                if(JSON.stringify(data.preparedMetaDataLocal) !== JSON.stringify(props.preparedMetaData)) {
                    props.setMetaDataIpfsHashData(false);
                }
            } else {
                data.preparedMetaDataLocal = false;
                props.setMetaDataIpfsHashData(false);
            }
        })

        const uploadMetaDataToIPFS = async () => {
            const fd = new FormData();

            if(!data.preparedMetaDataLocal) {
                toast.add({severity:'error', summary:'Error', detail:'File not found, please reselect it via the file browser.', life: 8000});
                return;
            }

            const msg = `{"reason":"Distribute Metadata via SEEN.HAUS IPFS Gateway","account":"${account.value.toLowerCase()}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`;
            const signer = useSigner();

            if (signer) {

                let signingError = false;
                store.dispatch('application/openModal', 'TransactionModal')
                const sig = await signer
                .signMessage(msg)
                .catch((e) => {
                    toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
                    signingError = true;
                    return e;
                });

                store.dispatch('application/closeModal')

                if(signingError) {
                    return false;
                }

                fd.append('json', JSON.stringify(data.preparedMetaDataLocal));
                fd.append('msg', msg);
                fd.append('signature', sig);

                data.isUploadingMetaData = true;

                IPFSService.pinJSON(fd)
                    .then(res => {
                        data.isUploadingMetaData = false;
                        if(res.data.ipfsHash) {
                            props.setMetaDataIpfsHashData(res.data.ipfsHash);
                            props.setPreparedMetaData(data.preparedMetaDataLocal);
                            setTimeout(() => {
                                let element = document.querySelector(`#mint-button`);
                                element.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 100)
                        }else{
                            props.setMetaDataIpfsHashData(false);
                            toast.add({severity:'error', summary:'Error', detail:`IPFS Hash Retrieval Failed`, life: 8000});
                        }
                    })
                    .catch(e => {
                        console.error(e)
                        data.isUploadingMetaData = false;
                        props.setMetaDataIpfsHashData(false);
                        let errorMessage = "(Gateway Error)";
                        if(e?.data?.message) {
                            errorMessage = '(' + (e?.data?.message?.message ? e?.data?.message?.message : e?.data?.message)  + ')';
                        }
                        toast.add({severity:'error', summary:'Error', detail:`Media upload failed ${errorMessage}`, life: 8000});
                    });
            }
        }

        const seenNFTContract = ref({});

        watchEffect(async () => {
            let contract = await useV3NftContractNetworkReactive(true);
            seenNFTContract.value = contract.state;
        })

        const mintNftOnChain = async () => {
            if(seenNFTContract.value.contract && account?.value) {
                if(data.selectedType === 'nft-digital') {
                    store.dispatch('application/openModal', 'TransactionModal')
                    try {
                        let royaltyFeeToBasisPoints = (props.secondaryRoyaltyFeeData.toFixed(2) * 100).toFixed(0)
                        let tx = await seenNFTContract.value.contract.mintDigital(unitField?.value, account?.value, `ipfs://${props.metaDataIpfsHashData}`, royaltyFeeToBasisPoints);
                        store.dispatch('application/setPendingTransactionHash', tx.hash)
                        tx.wait()
                            .then((response) => {
                                if(response.status === 1) {
                                    toast.add({
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: 'NFT successfully minted.',
                                        life: 3000
                                    });
                                    let eventData = parseConsignmentRegisteredEventData(response.events[1].data)
                                    let tokenId = Number(eventData[4]);
                                    let consignmentId = Number(eventData[6]);
                                    props.setNftTokenIdData(tokenId);
                                    props.setNftConsignmentIdData(consignmentId);
                                    store.dispatch('application/closeModal')
                                    store.dispatch('application/clearPendingTransactionHash')
                                    props.nextStep();
                                } else {
                                    throw new Error('Transaction Reverted');
                                }
                            }).catch((e) => {
                                let message = parseError(e.message)
                                props.setNftTokenIdData(false);
                                props.setNftConsignmentIdData(false);
                                toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                                store.dispatch('application/closeModal')
                                store.dispatch('application/clearPendingTransactionHash')
                            })
                    } catch (e) {
                        let message = e?.message ? parseError(e.message) : e;
                        props.setNftTokenIdData(false);
                        props.setNftConsignmentIdData(false);
                        toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                        store.dispatch('application/closeModal')
                        store.dispatch('application/clearPendingTransactionHash')
                    }
                }
            }
        }

        return {
            countries,
            form,
            countryField,
            provinceField,
            cityField,
            titleField,
            descriptionField,
            unitField,
            data,
            maxLengths,
            creatorData,
            showPropertiesModal,
            uploadMetaDataToIPFS,
            mintNftOnChain,
        }

    }
};
</script>

<style lang="scss" scoped>
    .max-height-transition {
        transition: max-height 0.5s;
    }
    .hidden-metadata {
        overflow: hidden;
        max-height: 0px;
    }
    .shown-metadata {
        overflow-y: auto;
        max-height: 400px;
    }
    .mint-info-form-container {
        max-width: 800px;
        width: calc(100% - 368px);
        margin-right: 20px;
        position: relative;
    }
    .preview-container {
        width: 348px;
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

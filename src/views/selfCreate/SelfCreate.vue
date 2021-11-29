<template>
  <div>
    <!-- <div style="position: sticky;top: 0px;"> -->
        <!-- <div style="position: absolute;background-color:#000000d1;color:white; top: 0px;width: 500px;max-height: 120px;overflow: scroll;">
            <pre>{{ JSON.stringify(processData, null, 4) }}</pre>
        </div> -->
    <!-- </div> -->
    <div v-if="!account">
        <container class="role-checking-loader-section flex-center pb-12">
            <div class="flex-col flex">
                <div class="w-full rounded-container flex items-center mb-6">
                    <i
                        class="fas fa-wallet transform rotate-12 text-3xl icon-right mr-6"
                        :class="'text-gray-500'"
                    ></i>

                    <div class="text-sm font-bold">
                        In order to access this section of the SEEN platform, you must first connect your wallet.
                    </div>
                </div>
                <button class="primary w-full cursor-pointer button mt-3 md:mt-0" @click="openWalletModal">
                    <i class="fas fa-wallet mr-2 transform rotate-12"></i> Connect wallet
                </button>
            </div>
        </container>
    </div>
    <div v-if="!processData.hasCheckedRoles && account">
        <container class="role-checking-loader-section flex-center pb-12">
            <div class="flex-col flex">
                <ProgressSpinner />
                <sub-title
                    class="text-black hidden lg:flex pt-6"
                    text-align="center"
                >
                    Checking Roles
                </sub-title>
            </div>
        </container>
    </div>
    <div v-if="processData.showAccessRequestForm && processData.hasCheckedRoles">
        <container class="role-checking-loader-section flex-center pb-12">
            <div class="flex-col w-full flex flex-center">
                <AccessRequestForm />
            </div>
        </container>
    </div>
    <div v-if="processData.hasCheckedRoles && !processData.showAccessRequestForm">
        <container class="pb-12" v-if="processData.currentStep < 5">
            <unfenced-title
                class="text-black hidden lg:flex pb-6 pt-12"
                color="fence-dark"
                text-align="left"
            >Publish NFT</unfenced-title>
            <div v-if="processData.currentStep > 0" class="flex items-center flex-col lg:flex-row mb-8">
                <div class="card flex-grow">
                    <!-- First step isn't part of step process, so we set currentStep in Step component to currentStep - 1 -->
                    <Steps v-if="processData.marketType === 'primary'" :stepOffset="1" :steps="steps" :currentStep="processData.currentStep - 1" :setStep="setStep"  />
                    <Steps v-if="processData.marketType === 'secondary'" :stepOffset="3" :steps="secondarySteps" :currentStep="processData.currentStep - 3" :setStep="setStep"  />
                </div>
            </div>
            <div class="flex items-center flex-col lg:flex-row">
                <!-- <div class="flex-grow" v-if="currentStep === 0">
                    <type-selection :nextStep="nextStep" :setTangibility="setTangibility" :setLocationData="setLocationData" :clearLocationData="clearLocationData"/>
                </div> -->
                <div class="w-full" v-if="processData.currentStep === 0">
                    <initiation
                        :setStep="setStep"
                        :nextStep="nextStep"
                        :prevStep="prevStep"
                        :setMediaIpfsHash="setMediaIpfsHash"
                        :setTempMediaUrl="setTempMediaUrl"
                        :setPropertyData="setPropertyData"
                        :setTangibilityData="setTangibilityData"
                        :setTitleData="setTitleData"
                        :setDescriptionData="setDescriptionData"
                        :setTagData="setTagData"
                        :setRightsData="setRightsData"
                        :setUnitData="setUnitData"
                        :setPreparedMetaData="setPreparedMetaData"
                        :setMetaDataIpfsHashData="setMetaDataIpfsHash"
                        :setNftTokenIdData="setNftTokenId"
                        :setNftTokenAddressData="setNftTokenAddress"
                        :setSecondaryRoyaltyFeeData="setSecondaryRoyaltyFee"
                        :setNftConsignmentIdData="setNftConsignmentId"
                        :setMarketType="setMarketType"
                        :setSecondaryBalance="setSecondaryBalance"
                        :setShowAccessRequestForm="setShowAccessRequestForm"
                        :isMinter="processData.isMinter"
                        :isSeller="processData.isSeller"
                    />
                </div>
                <div class="flex-grow" v-if="processData.currentStep === 1">
                    <upload :nextStep="nextStep" :setMediaIpfsHash="setMediaIpfsHash" :setTempMediaUrl="setTempMediaUrl" :tempMediaUrl="processData.tempMediaUrl" :mediaIpfsHash="processData.mediaIpfsHash" />
                </div>
                <div class="flex-grow" v-if="processData.currentStep === 2">
                    <mint 
                        :setPropertyData="setPropertyData"
                        :propertyData="processData.properties"
                        :mediaUrl="processData.tempMediaUrl"
                        :nextStep="nextStep"
                        :prevStep="prevStep"
                        :setTangibilityData="setTangibilityData"
                        :tangibilityData="processData.tangibility"
                        :setLocationData="setLocationData"
                        :setCountryData="setCountryData"
                        :setProvinceData="setProvinceData"
                        :setCityData="setCityData"
                        :clearLocationData="clearLocationData"
                        :locationDataCountry="processData.locationData.country"
                        :locationDataProvince="processData.locationData.province"
                        :locationDataCity="processData.locationData.city"
                        :setTitleData="setTitleData"
                        :titleData="processData.title"
                        :setDescriptionData="setDescriptionData"
                        :descriptionData="processData.description"
                        :setTagData="setTagData"
                        :tagData="processData.tags"
                        :setRightsData="setRightsData"
                        :rightsData="processData.rights"
                        :setUnitData="setUnitData"
                        :unitData="processData.units"
                        :priceData="processData.price"
                        :priceTypeData="processData.priceType"
                        :openingTimeTypeData="processData.openingTimeType"
                        :openingTimeUnixData="processData.openingTimeUnix"
                        :listingTypeData="processData.listingType"
                        :mediaIpfsHash="processData.mediaIpfsHash"
                        :setPreparedMetaData="setPreparedMetaData"
                        :preparedMetaData="processData.preparedMetaData"
                        :setMetaDataIpfsHashData="setMetaDataIpfsHash"
                        :metaDataIpfsHashData="processData.metaDataIpfsHash"
                        :setNftTokenIdData="setNftTokenId"
                        :nftTokenIdData="processData.nftTokenId"
                        :setNftTokenAddressData="setNftTokenAddress"
                        :secondaryRoyaltyFeeData="processData.secondaryRoyaltyFee"
                        :setSecondaryRoyaltyFeeData="setSecondaryRoyaltyFee"
                        :setNftConsignmentIdData="setNftConsignmentId"
                        :nftConsignmentIdData="processData.nftConsignmentId"
                        :isEscrowAgentData="processData.isEscrowAgent"
                        :updateProgress="updateProgress"
                        :collectableState="processData.collectableState"
                        :latestProgressTick="processData.latestProgressTick"
                        :timerState="processData.timerState"
                        :liveStatus="processData.liveStatus"
                        :isMinter="processData.isMinter"
                        :isSeller="processData.isSeller"
                    />
                </div>
                <div class="flex-grow" v-if="processData.currentStep === 3">
                    <self-create-listing
                        :nextStep="nextStep"
                        :prevStep="prevStep"
                        :setStep="setStep"
                        :setListingTypeData="setListingTypeData"
                        :listingTypeData="processData.listingType"
                        :setPriceData="setPriceData"
                        :priceData="processData.price"
                        :setPriceTypeData="setPriceTypeData"
                        :setOpeningTimeType="setOpeningTimeType"
                        :setOpeningTimeUnix="setOpeningTimeUnix"
                        :priceTypeData="processData.priceType"
                        :mediaUrl="processData.tempMediaUrl"
                        :tangibilityData="processData.tangibility"
                        :titleData="processData.title"
                        :tagData="processData.tags"
                        :unitData="processData.units"
                        :setUnitData="setUnitData"
                        :openingTimeTypeData="processData.openingTimeType"
                        :openingTimeUnixData="processData.openingTimeUnix"
                        :setNftTokenIdData="setNftTokenId"
                        :nftTokenIdData="processData.nftTokenId"
                        :setNftTokenAddressData="setNftTokenAddress"
                        :nftTokenAddressData="processData.nftTokenAddress"
                        :setNftConsignmentIdData="setNftConsignmentId"
                        :nftConsignmentIdData="processData.nftConsignmentId"
                        :isMarketHandlerAssignedData="processData.isMarketHandlerAssigned"
                        :setIsMarketHandlerAssignedData="setIsMarketHandlerAssigned"
                        :updateProgress="updateProgress"
                        :collectableState="processData.collectableState"
                        :latestProgressTick="processData.latestProgressTick"
                        :timerState="processData.timerState"
                        :liveStatus="processData.liveStatus"
                        :marketTypeData="processData.marketType"
                        :secondaryBalanceData="processData.secondaryBalance"
                        :isMinter="processData.isMinter"
                        :isSeller="processData.isSeller"
                    />
                </div>
                <div class="flex-grow" v-if="processData.currentStep === 4 && processData.hasCheckedRoles">
                    <container class="publishing-loader-section flex-center pb-12">
                        <div class="flex-col flex">
                            <ProgressSpinner />
                            <sub-title
                                class="text-black hidden lg:flex pt-6"
                                text-align="center"
                            >
                                Publishing Listing
                            </sub-title>
                            <light-typography>
                                Please wait for this to finish, it may take up to one minute.
                            </light-typography>
                        </div>
                    </container>
                </div>
            </div>
        </container>
        <div v-if="processData.currentStep === 5">
            <div class="bg-light-grey-darkened live-preview-card-zone flex-center">
                <drop-card-preview
                    :autoMargins="true"
                    :listingType="processData.listingType"
                    :startTime="processData.openingTimeUnix ? processData.openingTimeUnix * 1000 : null"
                    :priceType="processData.priceType"
                    :price="processData.price"
                    :units="processData.units"
                    :items="processData.units"
                    :itemsOf="processData.units"
                    :tangibility="processData.tangibility"
                    :tags="processData.tags"
                    :titleText="processData.title"
                    :creatorAccount="processData.creatorAccount || creatorData.account"
                    :creatorProfilePicture="processData.creatorProfilePicture || creatorData.profilePicture"
                    :creatorUsername="processData.creatorUsername || creatorData.username"
                    :mediaUrl="processData.tempMediaUrl"
                    :updateProgress="updateProgress"
                    :collectableState="processData.collectableState"
                    :latestProgressTick="processData.latestProgressTick"
                    :timerState="processData.timerState"
                    :liveStatus="processData.liveStatus"
                    :progress="100"
                />
            </div>
            <div class="bg-white flex-center py-16">
                <div class="flex-row">
                    <unfenced-title
                        class="text-black hidden lg:flex pb-6"
                        color="fence-dark"
                        text-align="center"
                    >
                        YOUR NFT IS LIVE
                    </unfenced-title>
                    <sub-title
                        class="text-green-gradient clickable hidden lg:flex pt-6 pb-12"
                        text-align="center"
                    >
                        {{processData.liveListingUrl}}
                    </sub-title>
                    <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-8">
                        <button class="button outline extended">
                            <i class="fas fa-copy text-sm icon-left"></i>Copy
                        </button>
                        <button class="button outline extended">
                            <i class="fas fa-eye text-sm icon-left"></i>View
                        </button>
                        <button class="button outline extended">
                            <i class="fas fa-share-alt text-sm icon-left"></i>Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import { useToast } from "primevue/usetoast";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import Steps from "@/components/Steps/Steps.vue";
import useWeb3 from "@/connectors/hooks";
import { useAccessControllerContractNetworkReactive, useV3MarketClerkContractNetworkReactive } from '@/hooks/useContract.js';

import { CollectablesService } from "@/services/apiService";
import parseError from "@/services/utils/parseError";

import AccessRequestForm from './components/AccessRequestForm';
import Initiation from './components/Initiation.vue';
import Upload from './components/Upload.vue';
import Mint from './components/Mint.vue';
import SelfCreateListing from './components/SelfCreateListing.vue';
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import {
    COLLECTABLE_STATE,
} from "@/constants/Collectables.js";

import { TIMER_STATE } from "@/hooks/v3/useTimer.js";

import { roleToBytes, marketHandlerToListingType, selfUrl } from '@/constants';

export default {
    name: "SelfCreateWithRoutes",
    components: {
        Container,
        UnfencedTitle,
        SubTitle,
        LightTypography,
        Steps,
        AccessRequestForm,
        Initiation,
        Upload,
        Mint,
        SelfCreateListing,
        DropCardPreview,
    },
    beforeRouteLeave (to, from, next) {
        // If the form is dirty and the user did not confirm leave,
        // prevent losing unsaved changes by canceling navigation
        if (!this.processData.skipFormNavigationCheck && (((this.processData.currentStep >= 1) && (this.processData.currentStep < 4)) || (this.processData.currentStep === 4 && !this.processData.isMarketHandlerAssigned)) && this.confirmStayInDirtyForm()) {
            next(false);
        } else {
            next();
        }
    },
    created() {
        window.addEventListener('beforeunload', this.beforeWindowUnload)
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.beforeWindowUnload)
    },
    data() {
        return {
            steps: [
                {
                    label: 'Upload',
                    helperText: 'Upload media to IPFS'
                },
                {
                    label: 'Mint',
                    helperText: 'Deploy your NFT on-chain'
                },
                {
                    label: 'List',
                    helperText: 'Create on-chain listing'
                },
                {
                    label: 'Publish',
                    helperText: 'Publish on SEEN.HAUS'
                }
            ],
            secondarySteps: [
                {
                    label: 'List',
                    helperText: 'Create on-chain listing'
                },
                {
                    label: 'Publish',
                    helperText: 'Publish on SEEN.HAUS'
                }
            ],
        }
    },
    filters: {
        pretty: function(value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    },
    methods: {
        confirmLeave() {
            return window.confirm('Do you really want to leave? You will lose unsaved changes!')
        },
        confirmStayInDirtyForm() {
            return !this.confirmLeave()
        },
        beforeWindowUnload(e) {
            if (!this.processData.skipFormNavigationCheck && ((this.processData.currentStep >= 1) && (this.processData.currentStep < 4)) && this.confirmStayInDirtyForm()) {
                // Cancel the event
                e.preventDefault()
                // Chrome requires returnValue to be set
                e.returnValue = ''
            }   
        },
        nextStep() {
            this.router.push({
                name: "selfCreate",
                params: { stepName: this.stepIndexToName[this.processData.currentStep + 1]},
            });
        },
        prevStep() {
            this.router.push({
                name: "selfCreate",
                params: { stepName: this.stepIndexToName[this.processData.currentStep - 1]},
            });
        },
        setStep(step) {
            this.router.push({
                name: "selfCreate",
                params: { stepName: this.stepIndexToName[step]},
            });
        },
        setTitleData(title) {
            this.processData.title = title;
        },
        setDescriptionData(description) {
            this.processData.description = description;
        },
        setTagData(tags) {
            this.processData.tags = tags;
        },
        setRightsData(rights) {
            this.processData.rights = rights;
        },
        setTangibilityData(tangibility) {
            this.processData.tangibility = tangibility;
        },
        setListingTypeData(listingType) {
            this.processData.listingType = listingType;
        },
        setMediaIpfsHash(hash) {
            this.processData.mediaIpfsHash = hash;
        },
        setTempMediaUrl(url) {
            this.processData.tempMediaUrl = url;
        },
        setLocationData(country = false, province = false, city = false) {
            if(country) {
                this.processData.locationData.country = country;
            }
            if(province) {
                this.processData.locationData.province = province;
            }
            if(city) {
                this.processData.locationData.city = city;
            }
        },
        setCountryData(country = false) {
            if(country) {
                this.processData.locationData.country = country;
            }
        },
        setProvinceData(province = false) {
            if(province) {
                this.processData.locationData.province = province;
            }
        },
        setCityData(city = false) {
            if(city) {
                this.processData.locationData.city = city;
            }
        },
        setPropertyData(propertyData) {
            this.processData.properties = propertyData;
        },
        setUnitData(unitData) {
            this.processData.units = unitData;
        },
        clearLocationData() {
            this.processData.locationData = {
                country: false,
                province: false,
                city: false,
            }
        },
        setPriceData(priceData) {
            this.processData.price = priceData;
        },
        setPriceTypeData(priceTypeData) {
            this.processData.priceType = priceTypeData;
        },
        setOpeningTimeType(openingTimeType) {
            this.processData.openingTimeType = openingTimeType;
        },
        setOpeningTimeUnix(openingTimeUnix) {
            this.processData.openingTimeUnix = openingTimeUnix;
        },
        setPreparedMetaData(preparedMetaData) {
            this.processData.preparedMetaData = preparedMetaData;
        },
        setMetaDataIpfsHash(metaDataIpfsHash) {
            this.processData.metaDataIpfsHash = metaDataIpfsHash;
        },
        setNftTokenId(id) {
            this.processData.nftTokenId = id;
        },
        setNftTokenAddress(address) {
            this.processData.nftTokenAddress = address;
        },
        setNftConsignmentId(id) {
            this.processData.nftConsignmentId = id;
        },
        setSecondaryRoyaltyFee(feePercentage) {
            this.processData.secondaryRoyaltyFee = feePercentage;
        },
        setIsMarketHandlerAssigned(isAssigned) {
            this.processData.isMarketHandlerAssigned = isAssigned;
        },
        setMarketType(marketType) {
            this.processData.marketType = marketType;
        },
        setSecondaryBalance(balance) {
            this.processData.secondaryBalance = balance;
        },
        setShowAccessRequestForm(status) {
            this.processData.showAccessRequestForm = status;
        }
    },
    async setup() {

        const store = useStore();

        const openWalletModal = () => {
            store.dispatch('application/openModal', 'WalletModalConnectOnly')
        };

        const toast = useToast();

        const router = useRouter();
        const route = useRoute();

        const stepName = route.params.stepName
            ? route.params.stepName
            : 'initiation';

        const publishConsignmentId = route.params.consignmentId;

        const marketClerkContract = ref({});

        watchEffect(async () => {
            let contract = await useV3MarketClerkContractNetworkReactive();
            marketClerkContract.value = contract.state;
        })

        const mediaInputRef = ref(null);

        const temporaryMediaUrl = ref(null);

        const useTemporaryMediaUrl = computed(() => temporaryMediaUrl.value);

        const creatorData = ref({
            account: false,
            profilePicture: false,
            username: false,
        });

        const { account } = useWeb3();

        watchEffect(() => {
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

        const stepNameToStepIndex = {
            'initiation': 0,
            'upload': 1,
            'mint': 2,
            'list': 3,
            'publish': 4,
            'live': 5,
        }

        const stepIndexToName = {
            0: 'initiation',
            1: 'upload',
            2: 'mint',
            3: 'list',
            4: 'publish',
            5: 'live',
        }

        const processData = reactive({
            currentStep: stepNameToStepIndex[stepName],
            tangibility: false,
            locationData: {
                country: false,
                province: false,
                city: false,
            },
            units: false,
            mediaIpfsHash: false,
            tempMediaUrl: false,
            preparedMetaData: false,
            metaDataIpfsHash: false,
            rights: false,
            title: false,
            description: false,
            secondaryRoyaltyFee: false,
            properties: [],
            tags: [],
            listingType: false,
            price: false,
            priceType: false,
            duration: false,
            openingTimeUnix: false,
            openingTimeType: false,
            nftTokenId: false,
            nftConsignmentId: false,
            isMinter: false,
            isSeller: false,
            isEscrowAgent: false,
            hasCheckedRoles: false,
            isMarketHandlerAssigned: false,
            creatorAccount: false,
            creatorProfilePicture: false,
            creatorUsername: false,
            liveListingUrl: false,
            skipFormNavigationCheck: false,
            lastCheckedAccount: false,
            collectableState: false,
            latestProgressTick: false,
            timerState: false,
            liveStatus: false,
            secondaryBalance: false,
            marketType: 'primary',
            showAccessRequestForm: false,
        })

        watchEffect(async () => {
            let currentStepName = route.params.stepName;
            if(currentStepName === 'publish') {
                let useConsignmentId = publishConsignmentId ? publishConsignmentId : processData.nftConsignmentId
                if(useConsignmentId === 0 || useConsignmentId) {
                    try {
                        await CollectablesService.publishConsignmentByConsignmentId(useConsignmentId)
                        .then((response) => {
                            let { data } = response;

                            // Load the data into processData state in case it doesn't already exist
                            // (e.g. hitting the publish link directly for whatever reason)

                            let listingType = marketHandlerToListingType[data.market_handler_type]

                            let priceType;
                            if(listingType === 'auction') {
                                priceType = 'Reserve Price';
                            } else if(listingType === 'sale') {
                                priceType = 'Sale Price';
                            }

                            if(data.market_type === 0) {

                                let previewMedia = data.media.filter(item => item.is_preview)

                                processData.listingType = listingType;
                                processData.openingTimeUnix = new Date(data.starts_at).getTime() / 1000;
                                processData.priceType = priceType;
                                processData.price = data.min_bid ? data.min_bid : data.price;
                                processData.units = data.edition_of;
                                processData.tangibility = data.type === 'tangible_nft' ? 'nft-physical' : 'nft-digital';
                                processData.tags = data.tags.map(item => item.name);
                                processData.title = data.title;
                                processData.creatorAccount = data.user.wallet ? data.user.wallet : false;
                                processData.creatorProfilePicture =  data.user.image ? data.user.image : false;
                                processData.creatorUsername =  data.user.username ? data.user.username : false;
                                processData.tempMediaUrl = previewMedia?.[0]?.url;
                                processData.skipFormNavigationCheck = true;
                                processData.liveListingUrl = selfUrl() + 'drops/' + data.slug;

                            } else if (data.market_type === 1) {

                                let previewMedia = data.collectable.media.filter(item => item.is_preview)

                                processData.listingType = listingType;
                                processData.openingTimeUnix = new Date(data.starts_at).getTime() / 1000;
                                processData.priceType = priceType;
                                processData.price = data.min_bid ? data.min_bid : data.price;
                                processData.units = data.edition_of;
                                processData.tangibility = data.collectable.type === 'tangible_nft' ? 'nft-physical' : 'nft-digital';
                                processData.tags = data.collectable.tags.map(item => item.name);
                                processData.title = data.collectable.title;
                                processData.creatorAccount = data.user.wallet ? data.user.wallet : false;
                                processData.creatorProfilePicture =  data.user.image ? data.user.image : false;
                                processData.creatorUsername =  data.user.username ? data.user.username : false;
                                processData.tempMediaUrl = previewMedia?.[0]?.url;
                                processData.skipFormNavigationCheck = true;
                                processData.liveListingUrl = selfUrl() + 'drops/secondary/' + data.slug;

                            }

                            if(!publishConsignmentId) {
                                router.push({
                                    name: "selfCreate",
                                    params: { stepName: 'live'},
                                });
                            } else {
                                router.push({
                                    name: "selfCreateWithConsignmentId",
                                    params: { 
                                        stepName: 'live',
                                        consignmentId: publishConsignmentId
                                    },
                                });
                            }
                            
                        })
                        .catch((e) => {
                            console.log({e})
                            let message = e?.data?.message ? parseError(e?.data?.message) : e;
                            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 5000});
                        })
                    } catch (e) {
                        console.log({e})
                        let message = e?.message ? parseError(e.message) : e;
                        toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 5000});
                    }
                } else {
                    toast.add({severity: 'error', summary: 'Error', detail: `Consignment ID not found`, life: 5000});
                }
            }
        })

        watchEffect(() => {
            if(route.params.stepName) {
                processData.currentStep = stepNameToStepIndex[route.params.stepName];
            } else {
                processData.currentStep = 0;
            }
        })

        const updateProgress = (event) => {
            console.log("Runs updateProgress")
            processData.latestProgressTick = Date.now();
        }

        watchEffect(() => {
            const now = new Date().setMilliseconds(0);
            const start = processData.openingTimeUnix ? new Date(processData.openingTimeUnix * 1000) : null;
            const isStartInPast = start && start.getTime() <= now;

            // Leave this here, as it should trigger a recalc of this watchEffect if it changes
            if(processData.latestProgressTick) {
                console.log("Rechecking status")
            }

            if((processData.listingType === 'auction') && isStartInPast) {
                processData.collectableState = COLLECTABLE_STATE.AWAITING_RESERVE;
                processData.liveStatus = "awaiting-reserve-bid";
                return;
            }

            if (now < start) {
                processData.collectableState = COLLECTABLE_STATE.WAITING;
                processData.timerState = TIMER_STATE.WAITING;
                processData.liveStatus = "coming soon";
                return;
            }

            if ((now >= start) && (processData.listingType === 'sale')) {
                processData.collectableState = COLLECTABLE_STATE.IN_PROGRESS;
                processData.timerState = TIMER_STATE.IN_PROGRESS;
                processData.liveStatus = "live";
                return;
            }

            processData.collectableState = COLLECTABLE_STATE.WAITING;
            processData.timerState = COLLECTABLE_STATE.WAITING;
            processData.liveStatus = "coming soon";
        });

        const resetTemporaryImage = () => {
            temporaryMediaUrl.value = null;
        }

        const onMediaChange = () => {
            temporaryMediaUrl.value = URL.createObjectURL(mediaInputRef.value.files[0]);
        }

        const accessControllerContract = ref({});

        watchEffect(async () => {
            let contract = await useAccessControllerContractNetworkReactive();
            accessControllerContract.value = contract.state;
        })

        watchEffect(async () => {
            // Assume no access
            if(account?.value && (account?.value !== processData.lastCheckedAccount)) {
                processData.hasCheckedRoles = false;
                processData.isMinter = false;
                processData.isSeller = false;
                processData.isEscrowAgent = false;
                if(accessControllerContract.value.contract) {
                    processData.lastCheckedAccount = account?.value;
                    // Check that current user has access to NFT minting & selling
                    let hasMinterRole = await accessControllerContract.value.contract.hasRole(roleToBytes["MINTER"], account?.value);
                    let hasSellerRole = await accessControllerContract.value.contract.hasRole(roleToBytes["SELLER"], account?.value);
                    let hasEscrowAgentRole = await accessControllerContract.value.contract.hasRole(roleToBytes["ESCROW_AGENT"], account?.value);
                    processData.isMinter = hasMinterRole;
                    processData.isSeller = hasSellerRole;
                    processData.isEscrowAgent = hasEscrowAgentRole;
                    processData.hasCheckedRoles = true;
                    processData.showAccessRequestForm = false;
                }
            } else if (!account?.value) {
                processData.lastCheckedAccount = false;
                processData.hasCheckedRoles = false;
                processData.isMinter = false;
                processData.isSeller = false;
                processData.isEscrowAgent = false;
            }
        })

        return {
            account,
            openWalletModal,
            mediaInputRef,
            temporaryMediaUrl,
            useTemporaryMediaUrl,
            onMediaChange,
            stepName,
            processData,
            router,
            stepIndexToName,
            creatorData,
            updateProgress,
        }
    }
};
</script>

<style scoped>

    .live-preview-card-zone {
        height: 650px;
    }

    .role-checking-loader-section {
        height: 100%;
    }

    .publishing-loader-section {
        height: 408px;
    }

</style>

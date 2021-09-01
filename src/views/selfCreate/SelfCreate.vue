<template>
  <div>
    <div style="position: sticky;top: 0px;">
        <div style="position: absolute;background-color:#000000d1;color:white; top: 0px;width: 500px;max-height: 120px;overflow: scroll;">
            <pre>{{ JSON.stringify(processData, null, 4) }}</pre>
        </div>
    </div>
    <container class="section-featured-auctions pb-12" v-if="processData.currentStep < 4">
        <unfenced-title
            class="text-black hidden lg:flex pb-6 pt-12"
            color="fence-dark"
            text-align="left"
          >Publish NFT</unfenced-title
        >
        <div class="flex items-center flex-col lg:flex-row mb-8">
            <div class="card flex-grow">
                <Steps :steps="steps" :currentStep="processData.currentStep" :setStep="setStep"  />
            </div>
        </div>
        <div class="flex items-center flex-col lg:flex-row">
            <!-- <div class="flex-grow" v-if="currentStep === 0">
                <type-selection :nextStep="nextStep" :setTangibility="setTangibility" :setLocationData="setLocationData" :clearLocationData="clearLocationData"/>
            </div> -->
            <div class="flex-grow" v-if="processData.currentStep === 0">
                <upload :nextStep="nextStep" :setMediaIpfsHash="setMediaIpfsHash" :setTempMediaUrl="setTempMediaUrl" :tempMediaUrl="processData.tempMediaUrl" :mediaIpfsHash="processData.mediaIpfsHash" />
            </div>
            <div class="flex-grow" v-if="processData.currentStep === 1">
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
                />
            </div>
            <div class="flex-grow" v-if="processData.currentStep === 2">
                <self-create-listing
                    :nextStep="nextStep"
                    :prevStep="prevStep"
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
                    :openingTimeTypeData="processData.openingTimeType"
                    :openingTimeUnixData="processData.openingTimeUnix"
                />
            </div>
        </div>
    </container>
    <div v-if="processData.currentStep === 4">
        <div class="bg-light-grey-darkened live-preview-card-zone flex-center">
            <drop-card-preview
                :listingType="processData.listingType"
                :startTime="processData.openingTimeUnix ? processData.openingTimeUnix * 1000 : null"
                :priceType="processData.priceType"
                :price="processData.price"
                :units="processData.units"
                :tangibility="processData.tangibility"
                :tags="processData.tags"
                :titleText="processData.title"
                :creatorAccount="creatorData.account"
                :creatorProfilePicture="creatorData.profilePicture"
                :creatorUsername="creatorData.username"
                :mediaUrl="processData.tempMediaUrl"
            />
        </div>
    </div>
  </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import { useField, useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex"

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import Steps from "@/components/Steps/Steps.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";
import useWeb3 from "@/connectors/hooks";

import TypeSelection from './components/TypeSelection.vue';
import Upload from './components/Upload.vue';
import Mint from './components/Mint.vue';
import SelfCreateListing from './components/SelfCreateListing.vue';

export default {
    name: "SelfCreateWithRoutes",
    beforeRouteLeave (to, from, next) {
        // If the form is dirty and the user did not confirm leave,
        // prevent losing unsaved changes by canceling navigation
        if (this.confirmStayInDirtyForm()) {
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
            if (this.confirmStayInDirtyForm()) {
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
        }
    },
    components: {
        Container,
        UnfencedTitle,
        SubTitle,
        LightTypography,
        Steps,
        MediaLoader,
        Upload,
        TypeSelection,
        Mint,
        SelfCreateListing,
        DropCardPreview,
    },
    setup() {

        const store = useStore();

        const router = useRouter();
        const route = useRoute();

        const stepName = route.params.stepName
            ? route.params.stepName
            : 'upload';

        const mediaInputRef = ref(null);

        const temporaryMediaUrl = ref(null);

        const useTemporaryMediaUrl = computed(() => temporaryMediaUrl.value);

        const uploadForm = useForm({
            initialValues: {
                nftFile: ""
            },
        });

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
            'upload': 0,
            'mint': 1,
            'list': 2,
            'publish': 3,
            'live': 4,
        }

        const stepIndexToName = {
            0: 'upload',
            1: 'mint',
            2: 'list',
            3: 'publish',
            4: 'live',
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
            properties: [],
            tags: [],
            listingType: false,
            price: false,
            priceType: false,
            duration: false,
            openingTimeUnix: false,
            openingTimeType: false,
            nftTokenId: false,
        })

        watchEffect(() => {
            if(route.params.stepName) {
                processData.currentStep = stepNameToStepIndex[route.params.stepName];
            }
        })

        const resetTemporaryImage = () => {
            temporaryMediaUrl.value = null;
        }

        const onMediaChange = () => {
            temporaryMediaUrl.value = URL.createObjectURL(mediaInputRef.value.files[0])
            console.log({temporaryMediaUrl: temporaryMediaUrl.value})
            console.log({useTemporaryMediaUrl: useTemporaryMediaUrl.value})
        }

        const uploadField = reactive(useField("email", "email"));

        return {
            uploadForm,
            uploadField,
            mediaInputRef,
            temporaryMediaUrl,
            useTemporaryMediaUrl,
            onMediaChange,
            stepName,
            processData,
            router,
            stepIndexToName,
            creatorData,
        }
    }
};
</script>

<style scoped>

    .live-preview-card-zone {
        height: 650px;
    }

</style>

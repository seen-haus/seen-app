<template>
  <div class="faqs">
    <div style="position: sticky;background-color:#000000d1;color:white; top: 0px;max-width: 500px;max-height: 300px;overflow: scroll;">
        <pre>{{ JSON.stringify(processData, null, 4) }}</pre>
    </div>
    <container class="section-featured-auctions pb-12">
        <unfenced-title
            class="text-black hidden lg:flex pb-6 pt-12"
            color="fence-dark"
            text-align="left"
          >Publish NFT</unfenced-title
        >
        <div class="flex items-center flex-col lg:flex-row">
            <div class="card flex-grow">
                <Steps :steps="steps" :currentStep="currentStep"  />
            </div>
        </div>
        <div class="flex items-center flex-col lg:flex-row py-8">
            <!-- <div class="flex-grow" v-if="currentStep === 0">
                <type-selection :nextStep="nextStep" :setTangibility="setTangibility" :setLocationData="setLocationData" :clearLocationData="clearLocationData"/>
            </div> -->
            <div class="flex-grow" v-if="currentStep === 0">
                <upload :nextStep="nextStep" :setMediaIpfsHash="setMediaIpfsHash" :setTempMediaUrl="setTempMediaUrl" />
            </div>
            <div class="flex-grow" v-if="currentStep === 1">
                <mint 
                    :setPropertyData="setPropertyData"
                    :propertyData="processData.properties"
                    :mediaUrl="processData.tempMediaUrl"
                    :nextStep="nextStep"
                    :setTangibilityData="setTangibilityData"
                    :setLocationData="setLocationData"
                    :clearLocationData="clearLocationData"
                    :setTitleData="setTitleData"
                    :setDescriptionData="setDescriptionData"
                    :setTagData="setTagData"
                    :setLicenseData="setLicenseData"
                />
            </div>
            <div class="flex-grow" v-if="currentStep === 2">
                <self-create-listing
                    :setListingType="setListingType"
                />
            </div>
        </div>
        <div class="flex items-center flex-col lg:flex-row">
            <button class="button primary mt-6" @click="nextStep">
                Next
            </button>
            <button class="button primary mt-6" @click="prevStep">
                Previous
            </button>
        </div>
    </container>
  </div>
</template>

<script>

import { ref, reactive, computed } from "vue";
import { useField, useForm } from "vee-validate";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import Steps from "@/components/Steps/Steps.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

import TypeSelection from './components/TypeSelection.vue';
import Upload from './components/Upload.vue';
import Mint from './components/Mint.vue';
import SelfCreateListing from './components/SelfCreateListing.vue';

export default {
    name: "SelfCreate",
    data() {
        return {
            steps: [
                {
                    label: 'Upload',
                    helperText: 'Upload media to IPFS'
                },
                {
                    label: 'Mint',
                    helperText: 'Mint your NFT on-chain'
                },
                {
                    label: 'List',
                    helperText: 'Provide information about your listing'
                },
                {
                    label: 'Publish',
                    helperText: 'Publish your listing on our site'
                }
            ],
            processData: {
                tangibility: false,
                locationData: {
                    country: false,
                    province: false,
                    city: false,
                },
                mediaIpfsHash: false,
                tempMediaUrl: false,
                licenseRights: false,
                title: false,
                description: false,
                properties: [],
                tags: [],
                listingType: false,
                price: false,
                duration: false,
                startDate: false,
            },
            currentStep: 0,
        }
    },
    filters: {
        pretty: function(value) {
            return JSON.stringify(JSON.parse(value), null, 2);
        }
    },
    methods: {
        nextStep() {
            if(this.currentStep < this.steps.length - 1) {
                this.currentStep++;
            }
        },
        prevStep() {
            if(this.currentStep > 0) {
                this.currentStep--;
            }
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
        setLicenseData(licenseRights) {
            this.processData.licenseRights = licenseRights;
        },
        setTangibilityData(tangibility) {
            this.processData.tangibility = tangibility;
        },
        setListingType(listingType) {
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
            if(country) {
                this.processData.locationData.city = city;
            }
        },
        setPropertyData(propertyData) {
            this.processData.properties = propertyData;
        },
        clearLocationData() {
            this.processData.locationData = {
                country: false,
                province: false,
                city: false,
            }
        },

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
    },
    setup() {

        const mediaInputRef = ref(null);

        const temporaryMediaUrl = ref(null);

        const useTemporaryMediaUrl = computed(() => temporaryMediaUrl.value);

        const uploadForm = useForm({
            initialValues: {
                nftFile: ""
            },
        });

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
        }
    }
};
</script>

<style scoped>
</style>

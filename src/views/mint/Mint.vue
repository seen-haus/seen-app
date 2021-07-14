<template>
  <div class="faqs">
    <container class="section-featured-auctions pb-12">
        <unfenced-title
            class="text-black hidden lg:flex pb-6 pt-12"
            color="fence-dark"
            text-align="left"
          >Publish NFT</unfenced-title
        >
        <div class="flex items-center flex-col lg:flex-row">
            <div class="card flex-grow">
                <Steps :steps="steps" :currentStep="currentStep" />
            </div>
        </div>
        <div class="flex items-center flex-col lg:flex-row py-8">
            <div class="flex-grow" v-if="currentStep === 0">
                <type-selection/>
            </div>
            <div class="flex-grow" v-if="currentStep === 1">
                <upload/>
            </div>
            <div class="flex-grow" v-if="currentStep === 2">
                Page 3
            </div>
            <div class="flex-grow" v-if="currentStep === 3">
                Page 4
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

export default {
    name: "Mint",
    data() {
        return {
            steps: [
                {
                    label: 'Type',
                    helperText: 'Select your NFT type'
                },
                {
                    label: 'Upload',
                    helperText: 'Upload your media file'
                },
                {
                    label: 'Mint',
                    helperText: 'Provide information about your listing'
                },
                {
                    label: 'Publish',
                    helperText: 'Publish your listing on our site'
                }
            ],
            formObject: {},
            currentStep: 0,
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

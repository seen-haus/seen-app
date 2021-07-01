<template>
  <div class="faqs">
    <container class="section-featured-auctions pb-12">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Publish NFT</fenced-title
        >
      </div>
        <div class="flex items-center flex-col lg:flex-row">
            <div class="card flex-grow">
                <Steps :steps="steps" :currentStep="currentStep" />
            </div>
        </div>
        <div class="flex items-center flex-col lg:flex-row py-6">
            <div v-if="currentStep === 0">
                <upload/>
            </div>
            <div v-if="currentStep === 1">
                Page 2
            </div>
            <div v-if="currentStep === 2">
                Page 3
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
import FencedTitle from "@/components/FencedTitle.vue";
import Steps from "@/components/Steps/Steps.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

import Upload from './components/Upload.vue';

export default {
    name: "Mint",
    data() {
        return {
            steps: [
                {
                    label: 'Upload',
                },
                {
                    label: 'Mint',
                },
                {
                    label: 'Publish',
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
        FencedTitle,
        Steps,
        MediaLoader,
        Upload,
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

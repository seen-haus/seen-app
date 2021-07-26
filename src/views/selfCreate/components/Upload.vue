<template>
  <div class="faqs">
    <container class="section-featured-auctions py-12">
        <div class="flex w-full items-center justify-center text-center" id="app">
            <div class="bg-gray-100 border border-gray-300 dropzone flex-center" @dragover="dragover" @dragleave="dragleave" @drop="drop">
                <input ref="mediaInputRef" type="file" id="file-to-pin" class="hidden" @change="onMediaChange" accept="image/png,image/jpg,image/gif,video/mp4">
                <label class="block cursor-pointer flex-center-column">
                    <div class="flex-center media-preview-container">
                        <media-loader
                            :key="useTemporaryMediaUrl"
                            v-if="useTemporaryMediaUrl"
                            :src="useTemporaryMediaUrl"
                            ignoreAspectRatioPadding
                            muted
                            loop
                            autoplay
                            maxWidthAndHeight
                        />
                        <img v-if="!useTemporaryMediaUrl" src="@/assets/icons/upload-icon.svg" style="width: 64px;height: 64px" alt="Upload">
                    </div>
                    <sub-title
                        class="text-black hidden lg:flex pb-5"
                        text-align="center"
                    >
                        Upload
                    </sub-title>
                    <light-typography
                        text-align="center"
                        font-size="15px"
                        font-weight="400"
                        margin-bottom="5px"
                    >
                        JPG, PNG, GIF, MP4 allowed
                    </light-typography>
                    <light-typography
                        text-align="center"
                        font-size="14px"
                        font-weight="400"
                    >
                    25 MB maximum
                    </light-typography>
                    <button :disabled="invalid" :class="'primary'" class="button mt-4 mb-6 w-full" @click="$refs.mediaInputRef.click()">
                        Browse
                    </button>
                    <light-typography
                        text-align="center"
                        font-size="15px"
                        font-weight="400"
                    >
                        or drag and drop into this space
                    </light-typography>
                </label>
                <ul class="mt-4" v-if="mediaInputRef?.value?.files?.length" v-cloak>
                    <li class="text-sm p-1" v-for="file in mediaInputRef.value.files" :key="file">
                        ${ file.name }<button class="ml-2" type="button" @click="remove(filelist.indexOf(file))" title="Remove file">remove</button>
                    </li>
                </ul>
            </div>
        </div>
        <button class="button mt-4 mb-6 w-full primary" @click="openWalletModal" v-if="!account && !useIsUploadComplete && useTemporaryMediaUrl">Connect Wallet</button>
        <button v-if="account && !useIsUploadComplete && useTemporaryMediaUrl" :class="useIsUploading ? 'disabled' : 'primary'" :disabled="useIsUploading" class="button mt-4 mb-6 w-full" @click="pinFile()">
            {{
                useIsUploading 
                    ? 
                        useIsMediaProcessing 
                            ? `Completing IPFS Distribution...`
                            : `Uploading Media To IPFS - ${useUploadProgress} %`
                    : 'Upload Media To IPFS'
            }}
        </button>
        <button v-if="useIsUploadComplete" :class="'primary'" class="button mt-4 mb-6 w-full" @click="nextStep">
            Continue
        </button>
    </container>
  </div>
</template>

<script>

import { ref, reactive, computed } from "vue";
import { useField, useForm } from "vee-validate";
import { useStore } from "vuex";

import { useToast } from "primevue/usetoast";

import useWeb3 from "@/connectors/hooks"
import useSigner from "@/hooks/useSigner";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

import { IPFSService } from "@/services/apiService";

export default {
    name: "Mint",
    props: {
        nextStep: Function,
        setMediaIpfsHash: Function,
        setTempMediaUrl: Function,
    },
    data() {
        return {
            filelist: [] // Store our uploaded files
        }
    },
    methods: {
        onChange() {
            this.filelist = [...this.$refs.file.files];
        },
        remove(i) {
            this.filelist.splice(i, 1);
        },
        dragover(event) {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains('bg-green-300')) {
                event.currentTarget.classList.remove('bg-gray-100');
                event.currentTarget.classList.add('bg-green-300');
            }
        },
        dragleave(event) {
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
    },
    components: {
        Container,
        MediaLoader,
        SubTitle,
        LightTypography,
    },
    setup(props) {

        const store = useStore();

        const openWalletModal = () => {
            store.dispatch('application/openModal', 'WalletModalConnectOnly')
        }

        const toast = useToast();

        const mediaInputRef = ref(null);

        const temporaryMediaUrl = ref(null);

        const { account } = useWeb3();

        let uploadProgress = ref(0);
        let isUploading = ref(false);
        let isMediaProcessing = ref(false);
        let isUploadComplete = ref(false);

        const useTemporaryMediaUrl = computed(() => temporaryMediaUrl.value);

        const useUploadProgress = computed(() => uploadProgress.value);
        const useIsUploading = computed(() => isUploading.value);
        const useIsMediaProcessing = computed(() => isMediaProcessing.value);
        const useIsUploadComplete = computed(() => isUploadComplete.value);

        const uploadForm = useForm({
            initialValues: {
                nftFile: ""
            },
        });

        const resetTemporaryImage = () => {
            temporaryMediaUrl.value = null;
        }

        const handleProgressPercent = (percent = 0) => {
            console.log({percent})
            uploadProgress.value = percent;
            if(percent >= 100) {
                isMediaProcessing.value = true;
            }
        }

        const pinFile = async () => {
            const fd = new FormData();
            const file = document.getElementById('file-to-pin').files[0];

            if (file && file.size > 25000000) {
                toast.add({severity:'error', summary:'Error', detail:'Media must be less than 25 MB.', life: 3000});
                return;
            }

            const msg = `{"reason":"Distribute file via SEEN.HAUS IPFS Gateway","account":"${account.value.toLowerCase()}","timestamp":${Math.floor(new Date().getTime() / 1000)}}`;
            const signer = useSigner();

            if (signer) {
                const sig = await signer
                .signMessage(msg)
                .catch((e) => {
                    toast.add({severity:'error', summary:'Error', detail:'Message signing failed.', life: 3000});
                    // let msg = 'Error has occurred. Try again later.';
                    // if (e.code === 4001) {
                    //     msg = 'Request was rejected.';
                    // }
                    // ToastifyService.fail(msg);
                    //this.submitting = false;
                    return e;
                });
                fd.append('files', file);
                fd.append('msg', msg);
                fd.append('signature', sig);

                isUploading.value = true;

                IPFSService.pin(fd, handleProgressPercent, file.size)
                    .then(res => {
                        // const imageSrc = res.data.url;
                        // temporaryImageUrl.value = imageSrc;
                        // form.setFieldValue('image', imageSrc);
                        isUploading.value = false;
                        isMediaProcessing.value = false;
                        handleProgressPercent(0);
                        if(res.data.ipfsHash) {
                            isUploadComplete.value = true;
                            props.setMediaIpfsHash(res.data.ipfsHash)
                            props.setTempMediaUrl(useTemporaryMediaUrl)
                        }else{
                            props.setMediaIpfsHash(false)
                            props.setTempMediaUrl(false)
                            toast.add({severity:'error', summary:'Error', detail:`IPFS Hash Retrieval Failed`, life: 8000});
                        }
                    })
                    .catch(e => {
                        console.error(e)
                        toast.add({severity:'error', summary:'Error', detail:`Media upload failed ${e?.data?.message && '(' + (e?.data?.message?.message ? e?.data?.message?.message : e?.data?.message)  + ')'}`, life: 8000});
                    });
            }
        }

        const onMediaChange = () => {
            temporaryMediaUrl.value = URL.createObjectURL(mediaInputRef.value.files[0])
            isUploadComplete.value = false;
            isUploading.value = false;
            isMediaProcessing.value = false;
            props.setMediaIpfsHash(false)
            props.setTempMediaUrl(false)
            console.log({temporaryMediaUrl: temporaryMediaUrl.value})
            console.log({useTemporaryMediaUrl: useTemporaryMediaUrl.value})
        }

        const drop = (event) => {
            event.preventDefault();
            mediaInputRef.value.files = event.dataTransfer.files;
            onMediaChange(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        }

        const uploadField = reactive(useField("email", "email"));

        return {
            uploadForm,
            uploadField,
            mediaInputRef,
            temporaryMediaUrl,
            useTemporaryMediaUrl,
            useUploadProgress,
            useIsUploading,
            useIsMediaProcessing,
            useIsUploadComplete,
            account,
            onMediaChange,
            drop,
            pinFile,
            openWalletModal,
        }
    }
};
</script>

<style scoped>
    .dropzone {
        height: 470px;
        width: 100%;
        border-radius: 10px;
        border: 2px dashed rgba(142, 152, 160, 0.3);
    }
    .media-preview-container {
        border-radius: 10px;
        border: 2px dashed rgba(142, 152, 160, 0.2);
        margin-bottom: 28px;
        width: 125px;
        height: 125px;
        overflow: hidden;
    }
    .media-preview {
        max-width: 100%;
        max-height: 100%;
    }
</style>

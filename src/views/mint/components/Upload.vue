<template>
  <div class="faqs">
    <container class="section-featured-auctions py-12">
        <div class="flex w-full items-center justify-center text-center" id="app">
            <div class="bg-gray-100 border border-gray-300 dropzone flex-center" @dragover="dragover" @dragleave="dragleave" @drop="drop">
                <input ref="mediaInputRef" type="file" id="profileAvatarUpload" class="hidden" @change="onMediaChange" accept="image/png,image/jpg,image/gif,video/mp4">
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
    </container>
  </div>
</template>

<script>

import { ref, reactive, computed } from "vue";
import { useField, useForm } from "vee-validate";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
    name: "Mint",
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
            onMediaChange,
            drop,
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

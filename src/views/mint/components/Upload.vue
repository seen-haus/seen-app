<template>
  <div class="faqs">
    <container class="section-featured-auctions py-12">
        <div class="flex w-full items-center justify-center text-center" id="app">
            <div class="bg-gray-100 border border-gray-300" @dragover="dragover" @dragleave="dragleave" @drop="drop">
                <input ref="mediaInputRef" type="file" id="profileAvatarUpload" class="hidden" @change="onMediaChange" accept="image/png,image/jpg,image/gif,video/mp4">
                <label for="assetsFieldHandle" class="block cursor-pointer">
                <div>
                    Explain to our users they can drop files in here 
                    or <span class="underline">click here</span> to upload their files
                </div>
                </label>
                <ul class="mt-4" v-if="mediaInputRef?.value?.files?.length" v-cloak>
                    <li class="text-sm p-1" v-for="file in mediaInputRef.value.files" :key="file">
                        ${ file.name }<button class="ml-2" type="button" @click="remove(filelist.indexOf(file))" title="Remove file">remove</button>
                    </li>
                </ul>
            </div>
        </div>
        <media-loader
            :key="useTemporaryMediaUrl"
            v-if="useTemporaryMediaUrl"
            :src="useTemporaryMediaUrl"
            aspectRatio="100%"
            muted
            loop
            autoplay
        />
        <button class="text-sm mb-8" @click="openUploadWindow"><i class="fas fa-pencil-alt"></i> Change Avatar</button>
        
    </container>
  </div>
</template>

<script>

import { ref, reactive, computed } from "vue";
import { useField, useForm } from "vee-validate";

import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

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
</style>

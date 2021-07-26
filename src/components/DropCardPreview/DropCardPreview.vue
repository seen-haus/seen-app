<template>
    <div class="auto-margins drop-card-preview-container">
        <div class="drop-card-media-container flex-center placeholder-light-grey">
            <img v-if="!data.mediaUrl" src="@/assets/icons/media-icon.svg" style="opacity: 0.6" alt="Media Icon">
            <media-loader
                :key="data.mediaUrl"
                v-if="data.mediaUrl"
                :src="data.mediaUrl"
                ignoreAspectRatioPadding
                muted
                loop
                autoplay
                maxWidthAndHeight
            />
        </div>
        <div class="drop-card-title mt-4 mb-4">
            <div class="title-placeholder placeholder-light-grey"></div>
        </div>
        <div class="flex-align-center mt-4 mb-4">
            <div v-if="!creatorAccount" class="artist-pic-placeholder mr-2 placeholder-light-grey"></div>
            <div class="artist-avatar mr-2" :style="{ backgroundImage: `url(${creatorProfilePicture})` }">
                <identicon :size="34" :address="creatorAccount" v-if="!creatorProfilePicture"/>
            </div>
            <div v-if="!creatorUsername" class="artist-name-placeholder placeholder-light-grey"></div>
            <sub-title
                v-if="creatorUsername"
                class="text-black hidden lg:flex mb-1 mt-2"
                text-align="center"
                font-size="15px"
            >
                @{{creatorUsername}}
            </sub-title>
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import Identicon from "@/components/Identicon/Identicon"

export default {
    name: "DropCardPreview",
    props: {
        mediaUrl: String,
        creatorUsername: String,
        creatorProfilePicture: String,
        creatorAccount: String,
    },
    methods: {

    },
    components: {
        SubTitle,
        LightTypography,
        MediaLoader,
        Identicon,
    },
    setup(props) {
        
        const data = reactive({
            mediaUrl: false,
        })

        watchEffect(() => {
            console.log({data})
            if(props.mediaUrl) {
                data.mediaUrl = props.mediaUrl;
            }
        })

        return {
            data
        }

    }
};
</script>

<style lang="scss" scoped>
    .drop-card-preview-container {
        height: 514px;
        width: 384px;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        border-radius: 10px;
        padding: 14px;
    }
    .drop-card-media-container {
        width: 356px;
        height: 356px;
        border-radius: 6px;
    }
    .title-placeholder {
        width: 215px;
        height: 24px;
        border-radius: 10px;
    }
    .drop-card-artist {
        display: flex;
    }
    .artist-pic-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 32px;
    }
    .artist-name-placeholder {
        width: 100px;
        height: 24px;
        border-radius: 10px;
    }
    .artist-avatar {
        width: 34px;
        height: 34px;
        border-radius: 2rem;
        background-size: cover;
    }
</style>

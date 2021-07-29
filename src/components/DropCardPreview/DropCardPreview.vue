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
            <div class="tangibility-container">
                <tag v-if="data.tangibility === 'nft-physical' || data.tangibility === 'nft-digital'" class="bg-black mr-1 text-white">NFT</tag>
                <tag v-if="data.tangibility === 'nft-physical'" class="bg-black mr-1 text-white">PHYSICAL</tag>
            </div>
            <div class="tag-container">
                <tag :value="tagItem" v-for="(tagItem, index) in data.tags" :key="`inline-tag-${tagItem}-${index}`" class="bg-black mr-1 text-white">{{tagItem.toUpperCase()}}</tag>
            </div>
        </div>
        <div class="drop-card-title mt-4 mb-4">
            <div v-if="!titleText" class="title-placeholder-container mt-4">
                <div class="placeholder-light-grey title-placeholder"></div>
            </div>
            <sub-title
                v-if="titleText"
                class="text-black hidden lg:flex"
                text-align="left"
                font-size="24px"
            >
                {{titleText}}
            </sub-title>
        </div>
        <div class="flex-align-center mb-4">
            <div v-if="!data.creatorAccount" class="artist-pic-placeholder mr-2 placeholder-light-grey"></div>
            <div v-if="data.creatorAccount" class="artist-avatar mr-2" :style="{ backgroundImage: `url(${data.creatorProfilePicture})` }">
                <identicon :size="34" :address="data.creatorAccount" v-if="!data.creatorProfilePicture && data.creatorAccount"/>
            </div>
            <div v-if="!data.creatorUsername && !data.creatorAccount" class="artist-name-placeholder placeholder-light-grey"></div>
            <sub-title
                v-if="data.creatorUsername || data.creatorAccount"
                class="text-black hidden lg:flex mb-1"
                text-align="center"
                font-size="15px"
                style="margin-top: 10px;"
            >
                {{(data.creatorUsername && `@${data.creatorUsername}`) || shortenAddress(data.creatorAccount)}}
            </sub-title>
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";

import Tag from "@/components/PillsAndTags/Tag.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import Identicon from "@/components/Identicon/Identicon";
import { shortenAddress } from "@/services/utils/index"

export default {
    name: "DropCardPreview",
    props: {
        mediaUrl: String,
        creatorUsername: String,
        creatorProfilePicture: String,
        creatorAccount: String,
        titleText: String,
        tags: Array,
        tangibility: String,
    },
    methods: {

    },
    components: {
        SubTitle,
        LightTypography,
        MediaLoader,
        Identicon,
        Tag,
    },
    setup(props) {
        
        const data = reactive({
            mediaUrl: false,
            titleText: false,
            creatorAccount: props.creatorAccount,
            creatorUsername: props.creatorUsername,
            creatorProfilePicture: props.creatorProfilePicture,
            tags: props.tags || [],
            tangibility: props.tangibility || "",
        })

        watchEffect(() => {
            if(props.mediaUrl) {
                data.mediaUrl = props.mediaUrl;
            } else {
                data.mediaUrl = false;
            }
            if(props.titleText) {
                data.titleText = props.titleText;
            } else {
                data.titleText = false;
            }
        })

        watchEffect(() => {
            data.creatorAccount = props.creatorAccount;
            data.creatorUsername = props.creatorUsername;
            data.creatorProfilePicture = props.creatorProfilePicture;
            data.tags = props.tags;
            data.tangibility = props.tangibility;
        })

        return {
            data,
            shortenAddress,
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
        position: relative;
    }
    .title-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
    .title-placeholder-container {
        width: 215px;
        height: 30px;
        padding-bottom: 6px;
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
    .tangibility-container {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
    }
    .tag-container {
        position: absolute;
        bottom: 10px;
        left: 10px;
        display: flex;
    }
</style>

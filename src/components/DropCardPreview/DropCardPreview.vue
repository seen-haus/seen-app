<template>
    <div 
        class="drop-card-container-border" 
        :class="{
            'auto-margins': autoMargins,
            'creation-step-sticky': sticky
        }"
    >
        <div class="drop-card-preview-container">
            <div class="drop-card-inner-padding-top">
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
                        <tag v-if="data.tangibility === 'nft-digital'" class="bg-black mr-1 text-white">NFT</tag>
                        <tag v-if="data.tangibility === 'nft-physical'" class="bg-black mr-1 text-white">NFT + PHYSICAL</tag>
                    </div>
                    <div class="tag-container">
                        <tag :value="tagItem" v-for="(tagItem, index) in data.tags" :key="`inline-tag-${tagItem}-${index}`" class="bg-black mr-1 text-white">{{tagItem.toUpperCase()}}</tag>
                    </div>
                </div>
                <div class="drop-card-title mt-3 mb-3">
                    <div v-if="!titleText" class="title-placeholder-container mt-4">
                        <div class="placeholder-light-grey text-placeholder"></div>
                    </div>
                    <sub-title
                        v-if="titleText"
                        class="text-black hidden lg:flex"
                        text-align="left"
                        font-size="24px"
                        line-height="30px"
                        :overflowEllipsis="true"
                    >
                        {{data.titleText}}
                    </sub-title>
                </div>
                <div class="flex-align-center">
                    <div v-if="!data.creatorAccount" class="artist-pic-placeholder mr-2 placeholder-light-grey"></div>
                    <div v-if="data.creatorAccount" class="artist-avatar mr-2" :style="{ backgroundImage: `url(${data.creatorProfilePicture})` }">
                        <identicon :size="34" :address="data.creatorAccount" v-if="!data.creatorProfilePicture && data.creatorAccount"/>
                    </div>
                    <div v-if="!data.creatorUsername && !data.creatorAccount" class="artist-name-placeholder placeholder-light-grey"></div>
                    <sub-title
                        v-if="data.creatorUsername || data.creatorAccount"
                        class="text-black hidden lg:flex mb-1 mt-1"
                        text-align="center"
                        font-size="15px"
                    >
                        {{(data.creatorUsername && `@${data.creatorUsername}`) || shortenAddress(data.creatorAccount)}}
                    </sub-title>
                </div>
            </div>
            <div class="divider-line mt-3 mb-3"/>
            <div class="drop-card-inner-padding-bottom flex">
                <div>
                    <div v-if="!data.startTime" class="mr-6">
                        <div class="timer-helper-placeholder-container">
                            <div class="placeholder-light-grey text-placeholder"></div>
                        </div>
                        <div class="timer-placeholder-container">
                            <div class="placeholder-light-grey text-placeholder"/>
                        </div>
                    </div>
                    <div class="mr-6" v-if="data.timerState !== TIMER_STATE.DONE && (data.startTime > new Date().getTime())">
                        <progress-timer
                            v-if="data.startTime"
                            ref="timerRef"
                            :listingType="listingType"
                            :startDate="data.startTime"
                            @onTimerStateChange="updateTimerState"
                        />
                    </div>
                </div>
                <div>
                    <div v-if="!data.priceType" class="price-helper-placeholder-container">
                        <div class="placeholder-light-grey text-placeholder"></div>
                    </div>
                    <light-typography 
                        v-if="data.priceType"
                        textAlign="left"
                        fontSize="14px"
                        fontWeight="700"
                        lineHeight="16px"
                        paddingBottom="6px"
                        :upperCase="true"
                    >
                        {{data.priceType}}
                    </light-typography>
                    <div v-if="!data.price" class="price-placeholder-container">
                        <div class="placeholder-light-grey text-placeholder"/>
                    </div>
                    <div v-if="data.price" class="flex">
                        <img src="@/assets/icons/ethereum-icon.svg"  class="mr-2" alt="Ethereum logo">
                        <sub-title
                            class="text-black hidden lg:flex"
                            text-align="left"
                            font-size="24px"
                            line-height="30px"
                            :overflowEllipsis="true"
                        >
                            {{formatCrypto(data.price, "ETH")}}
                        </sub-title>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { reactive, watchEffect } from "vue";

import Tag from "@/components/PillsAndTags/Tag.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import Identicon from "@/components/Identicon/Identicon";
import ProgressTimer from "@/components/Progress/v3/ProgressTimer";

import { shortenAddress } from "@/services/utils/index";

import useExchangeRate from "@/hooks/useExchangeRate.js";
import { TIMER_STATE } from "@/hooks/v3/useTimer.js";

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
        price: String,
        priceType: String,
        listingType: String,
        startTime: String,
        sticky: Boolean,
        autoMargins: Boolean,
    },
    methods: {
        updateTimerState(state) {
            this.data.timerState = state;
        }
    },
    components: {
        SubTitle,
        LightTypography,
        MediaLoader,
        Identicon,
        Tag,
        ProgressTimer,
    },
    setup(props) {

        const { formatCrypto } = useExchangeRate();
        
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
            data.titleText = props.titleText;
            data.creatorAccount = props.creatorAccount;
            data.creatorUsername = props.creatorUsername;
            data.creatorProfilePicture = props.creatorProfilePicture;
            data.tags = props.tags;
            data.tangibility = props.tangibility;
            data.price = props.price;
            data.priceType = props.priceType;
            data.startTime = props.startTime;
            data.listingType = props.listingType;
            data.timerState = TIMER_STATE.WAITING;
        })

        return {
            data,
            shortenAddress,
            formatCrypto,
            TIMER_STATE,
        }

    }
};
</script>

<style lang="scss" scoped>
    .drop-card-container-border {
        // This class is just here for if we ever want to add a border that can support gradients
        height: 514px;
        width: 338px;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        border-radius: 10px;
    }
    .drop-card-preview-container {
        height: 514px;
        width: 338px;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        border-radius: 10px;
    }
    .creation-step-sticky {
        position: sticky;
        top: 20px;
    }
    .drop-card-inner-padding-top {
        padding: 14px;
        padding-bottom: 0px;
    }
    .drop-card-inner-padding-bottom {
        padding: 14px;
        padding-top: 0px;
    }
    .drop-card-media-container {
        width: 310px;
        height: 310px;
        border-radius: 6px;
        position: relative;
    }
    .text-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 15px;
    }
    .title-placeholder-container {
        width: 215px;
        height: 30px;
        padding-bottom: 6px;
    }
    .price-helper-placeholder-container {
        width: 90px;
        height: 22px;
        padding-bottom: 6px;
    }
    .price-placeholder-container {
        width: 90px;
        height: 28px;
    }
    .timer-helper-placeholder-container {
        width: 120px;
        height: 22px;
        padding-bottom: 6px;
    }
    .timer-placeholder-container {
        width: 120px;
        height: 28px;
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
    .divider-line {
        width: 100%;
        height: 2px;
        background-color: #DFE4E9;
    }
</style>

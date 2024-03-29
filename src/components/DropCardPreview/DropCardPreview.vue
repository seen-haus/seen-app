<template>
    <div 
        class="drop-card-container-border" 
        :class="{
            'auto-margins': autoMargins,
            'creation-step-sticky': sticky,
            'drop-card-container-border-dark-mode': darkMode,
        }"
    >
        <div class="drop-card-preview-container"
            :class="{
                'drop-card-preview-container-dark-mode': darkMode,
            }"
        >
            <div class="drop-card-inner-padding-top">
                <div class="drop-card-media-container flex-center bg-gray-100">
                    <img v-if="!data.mediaUrl && !disableMediaPlaceholder" src="@/assets/icons/media-icon.svg" style="opacity: 0.6" alt="Media Icon">
                    <media-loader
                        :key="data.mediaUrl"
                        v-if="data.mediaUrl"
                        :src="data.mediaUrl"
                        ignoreAspectRatioPadding
                        muted
                        loop
                        autoplay
                        maxWidthAndHeight
                        fillHeight
                    />
                    <div class="tangibility-container">
                        <tag v-if="data.tangibility === 'nft-digital'" class="bg-black mr-1 text-white">NFT</tag>
                        <tag v-if="data.tangibility === 'nft-physical'" class="bg-black mr-1 text-white">NFT + PHYSICAL</tag>
                    </div>
                    <div class="tag-container">
                        <tag :value="tagItem" v-for="(tagItem, index) in data.tags" :key="`inline-tag-${tagItem}-${index}`" class="bg-black mr-1 text-white">{{tagItem.toUpperCase()}}</tag>
                    </div>
                    <div class="status-container">
                        <live-indicator v-if="liveStatus" :status="liveStatus" class="text-white ml-auto dark"/>
                    </div>
                </div>
                <div class="drop-card-middle">
                    <div class="drop-card-title mt-3 mb-3">
                        <div v-if="!titleText" class="title-placeholder-container mt-4">
                            <div class="placeholder-light-grey text-placeholder"></div>
                        </div>
                        <sub-title
                            v-if="titleText"
                            class="text-black hidden lg:flex"
                            :class="{
                                'text-white': darkMode
                            }"
                            text-align="left"
                            font-size="24px"
                            line-height="30px"
                            :overflowEllipsis="true"
                        >
                            {{data.titleText}}
                        </sub-title>
                    </div>
                    <div class="flex">
                        <user-or-artist-badge
                            :creatorAccount="data.creatorAccount"
                            :creatorUsername="data.creatorUsername"
                            :creatorSlug="data.creatorSlug"
                            :creatorProfilePicture="data.creatorProfilePicture"
                            :creatorType="data.creatorType"
                            :disableLinkGrow="true"
                        />
                    </div>
                </div>
            </div>
            <div v-if="(listingType !== 'sale') && (data.timerState !== TIMER_STATE.IN_PROGRESS) && (collectableState !== COLLECTABLE_STATE.AWAITING_RESERVE)" class="divider-line-inactive mt-3"/>
            <div v-if="(listingType !== 'sale') && (collectableState === COLLECTABLE_STATE.AWAITING_RESERVE)" class="divider-line-awaiting-reserve bg-progress-bar-green-vibrant mt-3"/>
            <div 
                v-if="(listingType !== 'sale') && ((data.timerState === TIMER_STATE.IN_PROGRESS) || (collectableState === COLLECTABLE_STATE.IN_PROGRESS)) && (collectableState !== COLLECTABLE_STATE.AWAITING_RESERVE)"
                class="divider-line-active mt-3"
                :class="{
                    'bg-progress-bar-green-vibrant': ((data.endTime - new Date().setMilliseconds(0)) > 900000),
                    'bg-progress-bar-vibrant': ((data.endTime - new Date().setMilliseconds(0)) <= 900000)
                }"
            >
                <div class="bg-black mini-progress-bar" :style="`width:${progress*100}%`"/>
            </div>
            <div v-if="listingType === 'sale'">
                <div v-if="
                        data.startTime > new Date().getTime()
                        || collectableState === COLLECTABLE_STATE.OUT_OF_STOCK 
                        || collectableState === COLLECTABLE_STATE.CLOSED
                        || collectableState === COLLECTABLE_STATE.DONE
                    "
                    class="divider-line-inactive mt-3"
                />
                <div v-if="
                        (data.startTime < new Date().getTime())
                        && collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK
                        && collectableState !== COLLECTABLE_STATE.CLOSED
                        && collectableState !== COLLECTABLE_STATE.DONE
                    " class="divider-line-active bg-progress-bar-green-vibrant mt-3">
                    <div class="bg-black mini-progress-bar" :style="`width:${100-(progress*100)}%`"/>
                </div>
            </div>
            <div 
                class="drop-card-inner-padding-bottom flex pt-3"
                :class="
                    ((data.timerState === TIMER_STATE.IN_PROGRESS || collectableState === COLLECTABLE_STATE.IN_PROGRESS) || (listingType == 'sale' && data.startTime && (data.startTime < new Date().getTime())))
                    && collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK
                    && collectableState !== COLLECTABLE_STATE.CLOSED
                    && collectableState !== COLLECTABLE_STATE.DONE
                    && 'bg-black'"
            >
                <div>
                    <div v-if="!data.startTime || (listingType === 'sale' && !itemsOf && !isOpenEdition)" class="mr-6">
                        <div class="timer-helper-placeholder-container">
                            <div class="placeholder-light-grey text-placeholder"></div>
                        </div>
                        <div class="timer-placeholder-container">
                            <div class="placeholder-light-grey text-placeholder"/>
                        </div>
                    </div>
                    
                    <div class="mr-6" v-if="collectableState !== COLLECTABLE_STATE.DONE && !isOpenEdition && ((data.startTime > new Date().getTime()) || (data.endTime > new Date().getTime() || (listingType === 'sale' && (listingType === 'sale' && itemsOf))))">
                        <progress-timer
                            v-if="data.startTime && (listingType !== 'sale' || (data.startTime > new Date().getTime()))"
                            ref="timerRef"
                            :whiteText="(data.timerState === TIMER_STATE.IN_PROGRESS && collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK) || darkMode"
                            :listingType="listingType"
                            :startDate="data.startTime"
                            :endDate="data.endTime"
                            @onProgress="updateProgress"
                            @onTimerStateChange="updateTimerState"
                        />
                        <div v-if="listingType === 'sale' && data.startTime && (data.startTime < new Date().getTime())">
                            <light-typography 
                                textAlign="left"
                                fontSize="14px"
                                fontWeight="700"
                                lineHeight="16px"
                                paddingBottom="6px"
                                :upperCase="true"
                            >
                                EDITIONS LEFT
                            </light-typography>
                            <sub-title
                                class="lg:flex"
                                :class="
                                    collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK
                                    && collectableState !== COLLECTABLE_STATE.CLOSED
                                    && 'text-white'
                                "
                                text-align="left"
                                fontSize="24px"
                                line-height="30px"
                                :overflowEllipsis="true"
                            >
                                {{items}} of {{itemsOf}}
                            </sub-title>
                        </div>
                    </div>
                    <div class="mr-6" v-if="listingType === 'sale' && isOpenEdition">
                        <progress-timer
                            v-if="data.startTime && (listingType !== 'sale' || (data.startTime > new Date().getTime()))"
                            ref="timerRef"
                            :whiteText="data.timerState === TIMER_STATE.IN_PROGRESS"
                            :listingType="listingType"
                            :startDate="data.startTime"
                            :endDate="data.endTime"
                            @onProgress="updateProgress"
                            @onTimerStateChange="updateTimerState"
                        />
                        <div v-if="listingType === 'sale' && data.startTime && (data.startTime < new Date().getTime())">
                            <light-typography 
                                textAlign="left"
                                fontSize="14px"
                                fontWeight="700"
                                lineHeight="16px"
                                paddingBottom="6px"
                                :upperCase="true"
                            >
                                EDITIONS SOLD
                            </light-typography>
                            <sub-title
                                class="lg:flex"
                                :class="
                                    collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK
                                    && collectableState !== COLLECTABLE_STATE.CLOSED
                                    && collectableState !== COLLECTABLE_STATE.DONE
                                    && 'text-white'
                                "
                                text-align="left"
                                fontSize="24px"
                                line-height="30px"
                                :overflowEllipsis="true"
                            >
                                {{items}}
                            </sub-title>
                        </div>
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
                    <div v-if="data.price" class="flex-align-center">
                        <img v-if="!data.customPaymentTokenSymbol" src="@/assets/icons/ethereum-icon.svg"  class="mr-2" alt="Ethereum logo">
                        <img v-if="data.customPaymentTokenSymbol === 'PRO'" src="@/assets/icons/propy.png"  class="mr-2 payment-token-logo" alt="Propy logo">
                        <img v-if="data.customPaymentTokenSymbol === 'USDC'" src="@/assets/icons/usdc.svg"  class="mr-2 payment-token-logo" alt="USDC logo">
                        <sub-title
                            class="text-black hidden lg:flex"
                            :class="{
                                'text-white': (
                                    (data.timerState === TIMER_STATE.IN_PROGRESS || (listingType == 'sale' && (data.startTime < new Date().getTime())))
                                    && collectableState !== COLLECTABLE_STATE.OUT_OF_STOCK
                                    && collectableState !== COLLECTABLE_STATE.CLOSED
                                    && collectableState !== COLLECTABLE_STATE.DONE
                                ) || darkMode,
                            }"
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
import ProgressTimer from "@/components/Progress/v3/ProgressTimer";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";

import { shortenAddress } from "@/services/utils/index";

import useDarkMode from '@/hooks/useDarkMode';
import useExchangeRate from "@/hooks/useExchangeRate.js";
import { TIMER_STATE } from "@/hooks/v3/useTimer.js";
import {
    COLLECTABLE_STATE,
} from "@/constants/Collectables.js";

export default {
    name: "DropCardPreview",
    props: {
        mediaUrl: String,
        creatorUsername: {
            type: [String, Boolean]
        },
        creatorProfilePicture: {
            type: [String, Boolean]
        },
        creatorAccount: String,
        creatorSlug: String,
        creatorType: String,
        titleText: String,
        tags: Array,
        tangibility: String,
        price: {
            type: [Number, Boolean]
        },
        priceType: String,
        listingType: String,
        startTime: {
            type: [String, Number]
        },
        endTime: {
            type: [String, Number]
        },
        sticky: Boolean,
        autoMargins: Boolean,
        updateProgress: Function,
        progress: {
            type: [Number, Boolean]
        },
        items: {
            type: [Number]
        },
        itemsOf: {
            type: [Number]
        },
        isOpenEdition: {
            type: [Boolean],
            default: false
        },
        collectableState: String,
        timerState: [String, null],
        liveStatus: String,
        disableMediaPlaceholder: [Boolean, null],
        customPaymentTokenSymbol: {
            type: [String, Boolean]
        },
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
        UserOrArtistBadge,
        Tag,
        ProgressTimer,
        LiveIndicator,
    },
    setup(props) {

        const { formatCrypto } = useExchangeRate();

        const { darkMode } = useDarkMode();
        
        const data = reactive({
            mediaUrl: false,
            titleText: false,
            creatorAccount: props.creatorAccount,
            creatorUsername: props.creatorUsername,
            creatorProfilePicture: props.creatorProfilePicture,
            creatorType: props.creatorType,
            creatorSlug: props.creatorSlug,
            tags: props.tags || [],
            tangibility: props.tangibility || "",
            timerState: props.timerState || false,
            customPaymentTokenSymbol: props.customPaymentTokenSymbol || false,
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
            data.creatorType = props.creatorType;
            data.creatorSlug = props.creatorSlug;
            data.creatorUsername = props.creatorUsername;
            data.creatorProfilePicture = props.creatorProfilePicture;
            data.tags = props.tags;
            data.tangibility = props.tangibility;
            data.price = props.price;
            data.priceType = props.priceType;
            data.startTime = props.startTime;
            data.endTime = props.endTime;
            data.listingType = props.listingType;
            data.customPaymentTokenSymbol = props.customPaymentTokenSymbol;
            if(!data.timerState) {
                data.timerState = TIMER_STATE.WAITING;
            }
            if(props.timerState) {
                data.timerState = props.timerState;
            }
        })

        return {
            data,
            shortenAddress,
            formatCrypto,
            darkMode,
            TIMER_STATE,
            COLLECTABLE_STATE,
        }

    }
};
</script>

<style lang="scss" scoped>
    .drop-card-container-border {
        // This class is just here for if we ever want to add a border that can support gradients
        max-width: 100%;
        height: 504px;
        width: 326px;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
        border-radius: 10px;
        position: relative;
        transition: all 0.2s ease-out;
        &:hover {
            box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
            transform: translateY(-2px);
        }
        &:active {
            box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.3);
            transform: translateY(2px);
        }
    }
    .drop-card-container-border-dark-mode {
        background: #222222!important;
    }
    .drop-card-preview-container {
        max-width: 100%;
        height: 504px;
        width: 326px;
        background: #FFFFFF;
        border-radius: 10px;
        overflow: hidden;
    }
    .drop-card-preview-container-dark-mode {
        background: #222222!important;
    }
    .creation-step-sticky {
        position: sticky;
        top: 20px;
    }
    .drop-card-inner-padding-top {
        max-width: 100%;
        padding-bottom: 0px;
    }
    .drop-card-middle {
        padding-left: 14px;
        padding-right: 14px;
    }
    .drop-card-inner-padding-bottom {
        padding: 14px;
    }
    .drop-card-media-container {
        max-width: 100%;
        width: 326px;
        height: 326px;
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
    .status-container {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
    }
    .divider-line-inactive {
        width: 100%;
        height: 2px;
        background-color: #DFE4E9;
    }
    .divider-line-awaiting-reserve {
        width: 100%;
        height: 3px;
    }
    .divider-line-active {
        height: 3px;
    }
    .mini-progress-bar {
        height: 100%;
        float: right;
        transition: all 0.2s ease-out;
    }
    .payment-token-logo {
        max-height: 20px;
    }
</style>

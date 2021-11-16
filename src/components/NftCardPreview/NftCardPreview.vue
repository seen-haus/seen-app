<template>
    <div 
        class="drop-card-container-border" 
        :class="{
          'auto-margins': autoMargins,
        }"
        @click="fetchAndLoadDataIntoSecondaryListingProcess"
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
            </div>
        </div>
    </div>
</template>

<script>

import { ref, reactive, watchEffect } from "vue";
import axios from "axios";

import Tag from "@/components/PillsAndTags/Tag.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import ProgressTimer from "@/components/Progress/v3/ProgressTimer";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";

import { shortenAddress } from "@/services/utils/index";

import {useStore} from "vuex";

import useExchangeRate from "@/hooks/useExchangeRate.js";

import uriToHttp from "@/services/utils/uriToHttp";
import uriToHash from "@/services/utils/uriToHash";

import { useV3NftContractNetworkReactive } from "@/hooks/useContract";

export default {
    name: "DropCardPreview",
    props: {
      autoMargins: Boolean,
      mediaUrl: String,
      titleText: String,
      tags: Array,
      tangibility: String,
      tokenId: Number,
      tokenAddress: String,
      setStep: Function,
      setMediaIpfsHash: Function,
      setTempMediaUrl: Function,
      setPropertyData: Function,
      setTangibilityData: Function,
      setTitleData: Function,
      setDescriptionData: Function,
      setTagData: Function,
      setRightsData: Function,
      setUnitData: Function,
      setPreparedMetaData: Function,
      setMetaDataIpfsHashData: Function,
      setNftTokenIdData: Function,
      setNftTokenAddressData: Function,
      setSecondaryRoyaltyFeeData: Function,
      setNftConsignmentIdData: Function,
      setMarketType: Function,
      setSecondaryBalance: Function,
      balance: Number,
    },
    components: {
        SubTitle,
        MediaLoader,
        // UserOrArtistBadge,
        Tag,
    },
    setup(props) {
        
        const data = reactive({
            mediaUrl: false,
            titleText: false,
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
            data.tags = props.tags;
            data.tangibility = props.tangibility;
        })

        const store = useStore();

        const processData = reactive({
          creatorAccount: false,
          creatorProfilePicture: false,
          creatorUsername: false,
        })

        const seenHausV3NFTContract = ref({});

        watchEffect(async () => {
            let contract = await useV3NftContractNetworkReactive();
            seenHausV3NFTContract.value = contract.state;
        })

        watchEffect(() => {
            // If the logic here is changed (i.e. how it calculates the creator username/image)
            // Make sure to check if anything needs change in ProcessRecoveryCard.vue
            let userStoreData = store.getters['user/user'];
            if(userStoreData) {
                if(userStoreData?.username?.length > 0) {
                  processData.creatorUsername = userStoreData.username;
                } else {
                  processData.creatorUsername = false;
                }
                if(userStoreData?.image?.length > 0) {
                  processData.creatorProfilePicture = userStoreData.image;
                } else {
                  processData.creatorProfilePicture = false;
                }
            } else {
              processData.creatorProfilePicture = false;
              processData.creatorUsername = false;
            }
        })

        const fetchAndLoadDataIntoSecondaryListingProcess = async () => {

          let {
            setStep,
            setTempMediaUrl,
            setMediaIpfsHash,
            setPropertyData,
            setTangibilityData,
            setTitleData,
            setDescriptionData,
            setTagData,
            setRightsData,
            setPreparedMetaData,
            setMetaDataIpfsHashData,
            setNftTokenIdData,
            setNftTokenAddressData,
            setSecondaryRoyaltyFeeData,
            setMarketType,
            setUnitData,
            setSecondaryBalance,
          } = props;

          if(seenHausV3NFTContract.value.contract) {
            let tokenInfo = await seenHausV3NFTContract.value.contract.getTokenInfo(props.tokenId)
            // Safe to assume that [2] (the seen IPFS gateway) should work here as this component is only for SEEN.HAUS NFTs
            // If this component becomes used for more than NFTs that have their media on the SEEN.HAUS IPFS gateway
            // Then don't rely on uriToHttp(tokenInfo.uri)[2] or uriToHttp(data.image)[2] working
            let ipfsMetaDataUrl = uriToHttp(tokenInfo.uri)[2];
            axios.get(ipfsMetaDataUrl).then(response => {
              let data = response.data;

              setTempMediaUrl(uriToHttp(data.image)[2]);
              setMediaIpfsHash(uriToHash(data.image));
              setPropertyData(data.attributes);
              setTangibilityData(data.tangibility);
              setTitleData(data.name);
              setDescriptionData(data.description);
              setTagData(data.tags);
              setRightsData(data.rights);
              setPreparedMetaData(response.data);
              setMetaDataIpfsHashData(uriToHash(tokenInfo.uri));
              setNftTokenIdData(Number(props.tokenId));
              setNftTokenAddressData(props.tokenAddress);
              setSecondaryRoyaltyFeeData(tokenInfo.royaltyPercentage);
              setUnitData(props.balance);
              setSecondaryBalance(props.balance);
              setMarketType('secondary');

              setStep(3);
            })
          }
        }

        return {
            data,
            fetchAndLoadDataIntoSecondaryListingProcess,
        }

    }
};
</script>

<style lang="scss" scoped>
    .drop-card-container-border {
        // This class is just here for if we ever want to add a border that can support gradients
        height: 265px;
        width: 228px;
        background: #FFFFFF;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
        border-radius: 10px;
        position: relative;
        transition: all 0.2s ease-out;
        cursor: pointer;
        &:hover {
            box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
            transform: translateY(-2px);
        }
        &:active {
            box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.3);
            transform: translateY(2px);
        }
    }
    .drop-card-preview-container {
        height: 265px;
        width: 228px;
        background: #FFFFFF;
        border-radius: 10px;
        overflow: hidden;
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
    }
    .drop-card-media-container {
        width: 200px;
        height: 200px;
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
</style>

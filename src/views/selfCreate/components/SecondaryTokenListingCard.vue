<template>
  <div class="clickable">
    <drop-card-preview
      v-if="processData.hasInitialised"
      @click="recoverListingProcess"
      :autoMargins="true"
      :listingType="processData.listingType"
      :startTime="null"
      :priceType="false"
      :price="false"
      :units="processData.units"
      :tangibility="processData.tangibility"
      :tags="processData.tags"
      :titleText="processData.titleText"
      :creatorAccount="processData.creatorAccount"
      :creatorProfilePicture="processData.creatorProfilePicture"
      :creatorUsername="processData.creatorUsername"
      :mediaUrl="processData.mediaUrl"
    />
  </div>
</template>

<script>

import { reactive, watchEffect, ref } from "vue";
import {useStore} from "vuex";
import axios from "axios";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import uriToHttp from "@/services/utils/uriToHttp";
import uriToHash from "@/services/utils/uriToHash";

import { useV3NftContractNetworkReactive } from "@/hooks/useContract";

export default {
    name: "ProcessRecoveryCard",
    props: {
      tokenId: Number,
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
    },
    methods: {
      recoverListingProcess() {
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
          setUnitData,
          setPreparedMetaData,
          setMetaDataIpfsHashData,
          setNftTokenIdData,
          setNftTokenAddressData,
          setSecondaryRoyaltyFeeData,
          setNftConsignmentIdData,
        } = this;

        let {
          units,
          tangibility,
          tags,
          titleText,
          mediaUrl,
          mediaIpfsHash,
          propertyData,
          description,
          rights,
          metaDataPrepared,
          metaDataHash,
          tokenId,
          tokenAddress,
          royaltyFee,
          consignmentId,
        } = this.processData;

        console.log({tokenAddress})

        setTempMediaUrl(mediaUrl);
        setMediaIpfsHash(mediaIpfsHash);
        setPropertyData(propertyData);
        setTangibilityData(tangibility);
        setTitleData(titleText);
        setDescriptionData(description);
        setTagData(tags);
        setRightsData(rights);
        setUnitData(units);
        setPreparedMetaData(metaDataPrepared);
        setMetaDataIpfsHashData(metaDataHash);
        setNftTokenIdData(tokenId);
        setNftTokenAddressData(tokenAddress);
        setSecondaryRoyaltyFeeData(royaltyFee);
        setNftConsignmentIdData(consignmentId);

        setStep(3);
      }
    },
    components: {
      SubTitle,
      LightTypography,
      DropCardPreview,
    },
    setup(props) {

        const store = useStore();

        const processData = reactive({
          listingType: false,
          units: false,
          tangibility: false,
          tags: false,
          titleText: false,
          creatorAccount: false,
          creatorProfilePicture: false,
          creatorUsername: false,
          mediaUrl: false,
          propertyData: false,
          description: false,
          rights: false,
          metaDataPrepared: false,
          metaDataHash: false,
          tokenId: false,
          tokenAddress: false,
          royaltyFee: false,
          consignmentId: false,
          hasInitialised: false,
        })

        const seenHausV3NFTContract = ref({});

        watchEffect(async () => {
            let contract = await useV3NftContractNetworkReactive();
            seenHausV3NFTContract.value = contract.state;
        })

        watchEffect(async () => {
            processData.mediaUrl = false;
            processData.hasInitialised = false;
            const { tokenId, tokenAddress } = props;
            if(seenHausV3NFTContract.value.contract) {
              // Check that current user has access to NFT minting & selling
              let tokenInfo = await seenHausV3NFTContract.value.contract.getTokenInfo(tokenId)
              // Safe to assume that [2] (the seen IPFS gateway) should work here as this component is only for SEEN.HAUS NFTs
              // If this component becomes used for more than NFTs that have their media on the SEEN.HAUS IPFS gateway
              // Then don't rely on uriToHttp(tokenInfo.uri)[2] or uriToHttp(data.image)[2] working
              let ipfsMetaDataUrl = uriToHttp(tokenInfo.uri)[2];
              axios.get(ipfsMetaDataUrl).then(response => {
                let data = response.data;
                processData.hasInitialised = true;
                processData.mediaUrl = uriToHttp(data.image)[2];
                processData.mediaIpfsHash = uriToHash(data.image);
                processData.tags = data.tags;
                processData.titleText = data.name;
                processData.tangibility = data.tangibility;
                processData.propertyData = data.attributes;
                processData.description = data.description;
                processData.rights = data.rights;
                // processData.units = Number(consignment.supply); TODO
                processData.metaDataPrepared = response.data;
                processData.metaDataHash = uriToHash(tokenInfo.uri);
                processData.tokenId = Number(tokenId);
                processData.tokenAddress = tokenAddress;
                processData.consignmentId = false;
                processData.royaltyFee = tokenInfo.royaltyPercentage;
                // processData.creatorAccount = consignment.seller; TODO
              })
            }
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

        return {
          processData
        }
    }
};
</script>

<style lang="scss" scoped>
  .initiation-selection-option {
    border-radius: 10px;
    border: 1px solid rgba(142, 152, 160, 0.3);
  }
</style>

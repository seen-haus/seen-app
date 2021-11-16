<template>
    <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
      <div class="initiation-selection-option bg-background-gray flex-center">
        <label class="block cursor-pointer flex-center-column mt-12 mb-12">
            <div class="flex-center opacity-0-6 mb-6">
                <img src="@/assets/icons/upload-icon.svg" style="width: 64px;height: 64px" alt="Upload">
            </div>
            <sub-title
                class="text-black hidden lg:flex pb-5"
                text-align="center"
            >
              Create New
            </sub-title>
            <light-typography
              text-align="center"
              font-size="15px"
              font-weight="400"
              margin-bottom="5px"
              max-width="250px"
            >
              Mint and list a new NFT onto the SEEN.HAUS primary market
            </light-typography>
            <button v-if="isMinter" :disabled="invalid" @click="createNew" :class="'primary'" class="button mt-4 w-full">
              CREATE NEW
            </button>
            <button v-if="!isMinter" :disabled="invalid" @click="requestAccess" :class="'primary'" class="button mt-4 w-full">
              REQUEST ACCESS
            </button>
        </label>
      </div>
      <div class="initiation-selection-option bg-background-gray flex-center">
        <label class="block cursor-pointer flex-center-column mt-12 mb-12">
            <div class="flex-center opacity-0-6 mb-6">
                <img src="@/assets/icons/store-icon.svg" style="width: 64px;height: 64px" alt="Upload">
            </div>
            <sub-title
                class="text-black hidden lg:flex pb-5"
                text-align="center"
            >
              List Existing
            </sub-title>
            <light-typography
              text-align="center"
              font-size="15px"
              font-weight="400"
              margin-bottom="5px"
              max-width="250px"
            >
              List an existing NFT on the SEEN.HAUS secondary market
            </light-typography>
            <button :disabled="invalid || (listOfCollectables.length === 0)" @click="showExistingNftsModal" :class="listOfCollectables.length > 0 ? 'primary' : 'disabled'" class="button mt-4 w-full">
              <span v-if="isLoadingListOfCollectables"><i class="fas fa-spinner fa-spin mr-2"></i> Loading</span>
              <span v-if="!isLoadingListOfCollectables && (listOfCollectables.length > 0)">LIST EXISTING</span>
              <span v-if="!isLoadingListOfCollectables && (listOfCollectables.length === 0)">NO OWNED SEEN.HAUS NFTs</span>
            </button>
        </label>
      </div>
    </div>
    <div v-if="recoveryList?.length > 0">
      <unfenced-title
        class="text-black hidden lg:flex pt-12"
        color="fence-dark"
        text-align="left"
      >Listing Process Recovery</unfenced-title>
      <light-typography
        textAlign="left"
        class="pb-6"
      >
        NFTs that you have minted but haven't listed with a market handler such as a sale or auction.
      </light-typography>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
        <process-recovery-card
          v-for="recoveryItem in recoveryList"
          :key="recoveryItem?.args?.consignment?.id"
          :consignment="recoveryItem?.args?.consignment"
          :setStep="setStep"
          :setMediaIpfsHash="setMediaIpfsHash"
          :setTempMediaUrl="setTempMediaUrl"
          :setPropertyData="setPropertyData"
          :setTangibilityData="setTangibilityData"
          :setTitleData="setTitleData"
          :setDescriptionData="setDescriptionData"
          :setTagData="setTagData"
          :setRightsData="setRightsData"
          :setUnitData="setUnitData"
          :setPreparedMetaData="setPreparedMetaData"
          :setMetaDataIpfsHashData="setMetaDataIpfsHashData"
          :setNftTokenIdData="setNftTokenIdData"
          :setNftTokenAddressData="setNftTokenAddressData"
          :setSecondaryRoyaltyFeeData="setSecondaryRoyaltyFeeData"
          :setNftConsignmentIdData="setNftConsignmentIdData"
          :setMarketType="setMarketType"
        />
      </div>
    </div>
    <pre>{{JSON.stringify(listOfCollectables, null, 4)}}</pre>
    <secondary-list-existing-modal
      :listOfCollectables="listOfCollectables"
      :setStep="setStep"
      :setMediaIpfsHash="setMediaIpfsHash"
      :setTempMediaUrl="setTempMediaUrl"
      :setPropertyData="setPropertyData"
      :setTangibilityData="setTangibilityData"
      :setTitleData="setTitleData"
      :setDescriptionData="setDescriptionData"
      :setTagData="setTagData"
      :setRightsData="setRightsData"
      :setUnitData="setUnitData"
      :setPreparedMetaData="setPreparedMetaData"
      :setMetaDataIpfsHashData="setMetaDataIpfsHashData"
      :setNftTokenIdData="setNftTokenIdData"
      :setNftTokenAddressData="setNftTokenAddressData"
      :setSecondaryRoyaltyFeeData="setSecondaryRoyaltyFeeData"
      :setNftConsignmentIdData="setNftConsignmentIdData"
      :setMarketType="setMarketType"
      :setSecondaryBalance="setSecondaryBalance"
    />
</template>

<script>

import { watchEffect, computed } from "vue";

import UnfencedTitle from "@/components/UnfencedTitle.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import ProcessRecoveryCard from "./ProcessRecoveryCard.vue";
import SecondaryListExistingModal from "./SecondaryListExistingModal.vue";

import useWeb3 from "@/connectors/hooks";
import useConsignmentRecoveryList from "@/hooks/v3/useConsignmentRecoveryList";
import useUsersCollectionWithPaginationV3 from "@/hooks/v3/useUsersCollectionWithPaginationV3.js";

import emitter from "@/services/utils/emitter";

export default {
    name: "Initiation",
    props: {
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
      setShowAccessRequestForm: Function,
      isMinter: Boolean,
      isSeller: Boolean,
    },
    methods: {

    },
    components: {
      SubTitle,
      LightTypography,
      UnfencedTitle,
      ProcessRecoveryCard,
      SecondaryListExistingModal,
    },
    setup(props) {
      const { account, chainId } = useWeb3();

      const [recoveryList, fetchRecoveryList] = useConsignmentRecoveryList();

      watchEffect(async () => {
        if(account?.value) {
          // Fetch a recovery list for this account
          await fetchRecoveryList(account?.value);
          console.log({recoveryList})
        }
      })

      const collection = useUsersCollectionWithPaginationV3()
      watchEffect(() => {
        if (account?.value && chainId.value) {
          collection.setAddress(account?.value);
          collection.setChainId(Number(chainId.value));
          collection.load();
        }
      })

      const listOfCollectables = computed(
        () => collection.listOfCollectables.value
      );

      const isLoadingListOfCollectables = computed(
        () => collection.loading.value
      )

      const showExistingNftsModal = () => {
        emitter.emit("openSecondaryListExistingModal");
      };

      const createNew = () => {
        props.setMarketType('primary');
        props.setStep(1);
      }

      const requestAccess = () => {
       props.setShowAccessRequestForm(true);
      }

      return {
        createNew,
        recoveryList,
        requestAccess,
        listOfCollectables,
        showExistingNftsModal,
        isLoadingListOfCollectables,
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

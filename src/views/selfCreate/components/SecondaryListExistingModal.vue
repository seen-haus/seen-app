<template>
  <Dialog header="Your SEEN.HAUS NFTs" :class="darkMode && 'dark-mode-surface-darkened'" v-model:visible="displayModal" :style="{maxWidth: '64rem', width: '100%'}" :modal="true" :closable="true">
    <div>
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <nft-card-preview
          v-for="collectable in listOfCollectables"
          :key="`${collectable.data.token_address}:${collectable.data.token_id}`"
          :autoMargins="true"
          :mediaUrl="collectable.data.openSeaPreviewImage?.length > 0 ? collectable.data.openSeaPreviewImage : collectable.data.image"
          :title="collectable.data.title"
          :titleText="collectable.data.title"
          :tags="collectable.data.tags"
          :tokenId="collectable.data.token_id"
          :balance="collectable.data.balance"
          :tokenAddress="collectable.data.token_address"
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
      </div>
    </div>
  </Dialog>
</template>

<script>
import {ref, reactive, watchEffect} from "vue";
import Dialog from 'primevue/dialog';

import NftCardPreview from "@/components/NftCardPreview/NftCardPreview.vue";

import useDarkMode from "@/hooks/useDarkMode";
import SubTitle from "@/components/SubTitle.vue";
import emitter from "@/services/utils/emitter";

export default {
  name: "SecondaryListExistingModal",
  components: {
    Dialog,
    SubTitle,
    NftCardPreview,
  },
  props: {
    listOfCollectables: Array,
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
  },
  methods: {
    saveProperties() {
      this.setProperties(this.propertySlots);
      emitter.emit("closeNftMintPropertiesModal");
    },
  },
  setup(props) {
    const { darkMode } = useDarkMode();

    const displayModal = ref(false);
    emitter.on('openSecondaryListExistingModal', payload => {
      displayModal.value = true;
    });

    emitter.on('closeSecondaryListExistingModal', payload => {
      displayModal.value = false;
    });

    return {
      displayModal,
      darkMode,
    }

  }
};
</script>

<style lang="scss" scoped>

.white {
  color: white;
}

.infobox {
  background-color: #d8d8d8;
}

.filler {
  height: 310px;
}

.p-dialog-content {
  overflow: auto;
  padding-bottom: 1rem!important;
  max-height: 575px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.property-input-container {
  flex-grow: 0;
  position: relative;
}

.property-input-type-container {
  width: calc(50% - 27px);
}

.property-input-value-container {
  width: calc(50% + 9px);
}

.property-input {
  width: 100%;
}

.length-indicator {
  position: absolute;
  right: 0px;
  top: -14px;
  font-size: 14px;
}

.remove-icon-container {
  width: 40px;
}

.input-container {
  width: calc(100% - 45px);
}

.add-save-button {
  width: calc(50% - 10px);
}
</style>

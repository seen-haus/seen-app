<template>
  <button class="button outline w-full mb-6" @click="loadIPFSData()">
    View On-Chain Data<i class="fas fa-link mr-2 text-sm icon-right text-gray-500"></i>
  </button>
  <Dialog header="On-Chain Data Viewer" v-model:visible="displayModal" :style="{maxWidth: '48rem', width: '100%'}" :modal="true" :closable="true">
    <div class="mb-3">
      <div class="rounded-container-reduced-vertical-padding border rounded-20px p-4 grid grid-flow-col gap-4">
        <div>
          <i class="text-gray-500 fas fa-info-circle mx-auto my-auto fa-2x py-2"></i>
        </div>
        <div class="col-span-3">
          <p class="text-xs text-gray-500">
            This window shows the NFT's data as it is stored on the Ethereum Blockchain and IPFS.<br/>Media may load slowly due to being retreived from IPFS.
          </p>
        </div>
      </div>
    </div>
    <div>
      <div class="flex flex-wrap -mx-2 wrapper">
        <div class="my-2 px-2 w-full wrapper lg:w-1/2 xl:w-1/2">
          <p v-if="ipfsData?.value?.name" class="text-xl font-title font-bold mb-4">
            {{ ipfsData.value.name }}
          </p>
          <p v-else-if="isLoading.value" class="text-xl font-title font-bold mb-4">Loading...</p>
          <p v-else class="text-xl font-title font-bold mb-4">NFT Data not available</p>

          <span v-if="ipfsData?.value?.description">
            <p class="text-sm text-gray-500">{{ ipfsData.value.description }}</p>
            <p v-if="ipfsData?.value?.attributes" class="text-md font-title font-bold mt-4 mb-2">Properties</p>
            <div v-if="ipfsData?.value?.attributes" class="grid grid-cols-2 gap-2 text-center">
              <span
                class="flex-center border rounded-md overflow-hidden bg-background-gray p-1"
                v-for="attribute in ipfsData.value.attributes"
                :key="attribute"
              >
                <div>
                  <p class="text-sm text-gray-800">{{ attribute.trait_type }}</p>
                  <p class="text-xs text-gray-500">{{ attribute.value }}</p>
                </div>
              </span>
            </div>
          </span>
          <span v-else-if="isLoading.value">
              <p class="text-md text-gray-500">Loading...</p>
          </span>
          <span v-else>
            <p class="text-md text-gray-500">
              The data for this NFT is currently not available.<br>
              This could be due to the following reasons:<br><br>
              - The NFT hasn't been minted yet. If the NFT will be launched in the future this is most likely the case.<br><br>
              - The IPFS datasource can't be reached
            </p>
          </span>
          <div v-if="isLoading.value" class="filler"></div>
        </div>
        <div class="py-5 px-2 w-full lg:w-1/2 xl:w-1/2" v-if="ipfsData?.value?.image">
          <media-loader
              :src="ipfsData.value.image"
              aspectRatio="100%"
              class="overflow-hidden rounded-20px flex-1"
              muted
              loop
              autoplay
          />
        </div>
        <div class="w-full">
          <img class="nft-data-signature mt-4 mb-8" src="@/assets/images/signature.png"/>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import emitter from "@/services/utils/emitter";
import {ref, computed, watchEffect, reactive, watch} from "vue";
import {useSeenNFTContract} from "@/hooks/useContract";
import useIPFS from "@/hooks/useIPFS";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import useSigner from "@/hooks/useSigner";


export default {
  name: "NftData",
  components: {
    Dialog,
    MediaLoader,
  },
  props: {
    collectable: Object
  },
  setup(props) {
    const displayModal = ref(false);
    emitter.on('openNftDataModal', payload => {
      displayModal.value = true;
    });
    const openModal = () => {
      emitter.emit("openNftDataModal");
    };

    const collectableData = ref(props.collectable);
    const hash = ref(null);
    let ipfs = null;
    const ipfsData = ref(null);
    const isLoading = ref(null);
    const contract = collectableData?.value?.nft_contract_address ?
        useSeenNFTContract(collectableData.value.nft_contract_address) : null;


    const loadIPFSData = async () => {
      if (contract) {
        hash.value = await contract.uri(collectableData.value.nft_token_id);
        ipfs = useIPFS(hash.value);
        ipfs.load();
        ipfsData.value = ipfs.item;
        isLoading.value = ipfs.loading;
      }
      else {
        ipfsData.value = null;
        isLoading.value = false;
      }
      openModal();
    };


    return {
      contract,
      ipfsData,
      loadIPFSData,
      openModal,
      displayModal,
      isLoading,
    }


  }
};
</script>

<style lang="scss">

.white {
  color: white;
}

.infobox {
  background-color: #d8d8d8;
}

.wrapper {
  max-height: 450px;
}

.filler {
  height: 310px;
}

.p-dialog-content {
  overflow: auto;
}

.nft-data-signature {
  width: 120px;
  margin-left: auto;
  margin-right: auto;
}
</style>

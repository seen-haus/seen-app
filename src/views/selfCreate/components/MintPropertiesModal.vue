<template>
  <Dialog header="On-chain Properties" :class="darkMode && 'dark-mode-surface-darkened'" v-model:visible="displayModal" :style="{maxWidth: '48rem', width: '100%'}" :modal="true" :closable="true">
    <div>
      <div class="flex flex-wrap -mx-2 wrapper">
        <sub-title
            class="hidden lg:flex mb-1 mt-2"
            :class="darkMode ? 'dark-mode-text-washed' : 'light-mode-text-washed'"
            text-align="left"
            font-size="14px"
        >
            Properties are attached via IPFS to the on-chain metadata of your NFT
        </sub-title>
      </div>
      <div v-if="propertySlots && propertySlots.length > 0" class="flex flex-wrap -mx-2 wrapper mt-3">
        <div class="remove-icon-container"/>
        <div class="input-container flex-space-between">
          <div class="property-input">
            Type
          </div>
          <div class="property-input">
            Value
          </div>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2 wrapper" v-for="(propertySlot, index) in propertySlots" :key="`property-slot-${index}`">
        <div class="remove-icon-container flex-center-vertical">
          <img src="@/assets/icons/remove-icon.svg" class="clickable mt-2" @click="removePropertySlot(index)" alt="Remove Property">
        </div>
        <div class="input-container flex-space-between">
          <input
              type="text"
              id="title"
              class="outlined-input mt-2 property-input"
              placeholder=""
              :class="error && 'invalid-outline'"
              v-model="propertySlot.trait_type"
          />
          <input
              type="text"
              id="title"
              class="outlined-input mt-2 property-input"
              placeholder=""
              :class="error && 'invalid-outline'"
              v-model="propertySlot.value"
          />
        </div>
      </div>
      <div class="flex flex-wrap -mx-2 wrapper">
        <button class="button primary mt-6 mr-6" @click="addPropertySlot">
          Add Another Property
        </button>
      </div>
      <div class="flex flex-wrap -mx-2 wrapper">
        <button class="button w-full primary mt-6" @click="saveProperties">
          Save Properties
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import {ref, computed, reactive} from "vue";
import {useStore} from "vuex";

import Dialog from 'primevue/dialog';

import SubTitle from "@/components/SubTitle.vue";

import emitter from "@/services/utils/emitter";

export default {
  name: "MintPropertiesModal",
  components: {
    Dialog,
    SubTitle,
  },
  props: {
    properties: Array,
    setProperties: Function,
  },
  methods: {
    removePropertySlot(indexForRemoval) {
      this.propertySlots.splice(indexForRemoval, 1);
    },
    addPropertySlot() {
      this.propertySlots.push({
        trait_type: "",
        value: "",
        error: false,
      });
      console.log({'this.propertySlots': this.propertySlots})
    },
    saveProperties() {
      this.setProperties(this.propertySlots);
      emitter.emit("closeNftMintPropertiesModal");
    },
  },
  setup(props) {

    const store = useStore();
    const darkMode = computed(() => store.getters['application/darkMode']);

    const displayModal = ref(false);
    emitter.on('openNftMintPropertiesModal', payload => {
      displayModal.value = true;
    });

    emitter.on('closeNftMintPropertiesModal', payload => {
      displayModal.value = false;
    });

    console.log({'props.properties': props.properties})

    const propertySlots = reactive(
      props.properties.map((item) => {
        return {
          trait_type: item.trait_type,
          value: item.value,
          error: false,
        }
      })
    )

    return {
      displayModal,
      darkMode,
      propertySlots,
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

.property-input {
  width: calc(50% - 10px);
  flex-grow: 0;
}

.remove-icon-container {
  width: 45px;
}

.input-container {
  width: calc(100% - 45px);
}
</style>

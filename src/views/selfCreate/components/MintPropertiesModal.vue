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
      <div class="flex flex-wrap -mx-2 wrapper mt-4" v-for="(propertySlot, index) in propertySlots" :key="`property-slot-${index}`">
        <div class="remove-icon-container flex-center-vertical">
          <img src="@/assets/icons/remove-icon.svg" class="clickable mt-2" @click="removePropertySlot(index)" alt="Remove Property">
        </div>
        <div class="input-container flex-space-between">
          <div class="property-input-container property-input-type-container">
            <label 
              class="length-indicator"
              :class="propertySlot.trait_type?.length > maxLengths.propertyType ? 'error-text' : 'light-mode-text-washed'"
            >
                {{propertySlot.trait_type ? propertySlot.trait_type?.length : 0}} / {{maxLengths.propertyType}}
            </label>
            <input
                type="text"
                id="title"
                class="outlined-input mt-2 property-input"
                placeholder=""
                :class="propertySlot.trait_type_error && 'invalid-outline'"
                v-model="propertySlot.trait_type"
            />
          </div>
          <div class="property-input-container property-input-value-container">
            <label 
              class="length-indicator"
              :class="propertySlot.value?.length > maxLengths.propertyValue ? 'error-text' : 'light-mode-text-washed'"
            >
                {{propertySlot.value ? propertySlot.value?.length : 0}} / {{maxLengths.propertyValue}}
            </label>
            <input
                type="text"
                id="title"
                class="outlined-input mt-2 property-input"
                placeholder=""
                :class="propertySlot.value_error && 'invalid-outline'"
                v-model="propertySlot.value"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2 wrapper">
        <div class="remove-icon-container flex-center-vertical">
          
        </div>
      </div>
      <div class="flex flex-wrap justify-between -mx-2 wrapper">
        <button class="button primary mt-6 add-save-button" @click="addPropertySlot">
          Add {{propertySlots && propertySlots.length > 0 ? 'Another' : 'A'}} Property
        </button>
        <button :class="(data.containsError || data.containsTypeWithoutValue || data.containsValueWithoutType) ? 'disabled' : 'primary'" class="button mt-6 add-save-button" @click="saveProperties">
          Save Properties
        </button>
      </div>
    </div>
  </Dialog>
</template>

<script>
import {ref, reactive, watchEffect} from "vue";
import Dialog from 'primevue/dialog';

import useDarkMode from "@/hooks/useDarkMode";
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
    const { darkMode } = useDarkMode();

    const displayModal = ref(false);
    emitter.on('openNftMintPropertiesModal', payload => {
      displayModal.value = true;
    });

    emitter.on('closeNftMintPropertiesModal', payload => {
      displayModal.value = false;
    });

    console.log({'props.properties': props.properties})

    let maxLengths = {
        propertyType: 30,
        propertyValue: 30,
    }

    const propertySlots = reactive(
      props.properties.map((item) => {
        return {
          trait_type: item.trait_type,
          trait_type_error: false,
          value: item.value,
          value_error: false,
        }
      })
    )

    const data = reactive({
      containsError: false,
      containsTypeWithoutValue: false,
      containsValueWithoutType: false,
    })

    watchEffect(() => {
      let containsError = false;
      let containsTypeWithoutValue = false;
      let containsValueWithoutType = false;
      for(let propertySlot of propertySlots) {
        if(propertySlot.trait_type.length > maxLengths.propertyType) {
          propertySlot.trait_type_error = true;
          containsError = true;
        } else {
          propertySlot.trait_type_error = false;
        }
        if(propertySlot.value.length > maxLengths.propertyValue) {
          containsError = true;
          propertySlot.value_error = true;
        } else {
          propertySlot.value_error = false;
        }
        if(propertySlot.trait_type.length > 0 && !propertySlot.value) {
          containsTypeWithoutValue = true;
        }
        if(propertySlot.value.length > 0 && !propertySlot.trait_type) {
          containsValueWithoutType = true;
        }
      }
      data.containsError = containsError
      data.containsTypeWithoutValue = containsTypeWithoutValue;
      data.containsValueWithoutType = containsValueWithoutType;
    })

    return {
      displayModal,
      darkMode,
      propertySlots,
      data,
      maxLengths,
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

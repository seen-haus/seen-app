<template>
  <div>
    <option-item v-for="(optionItem, key) in options"
                 :header="optionItem.name"
                 :key="key"
                 :icon="require('./../../assets/icons/' + optionItem.iconName)"
                 :active="connector && connector.name === optionItem.name"
                 @click="handleClick(optionItem)"/>
    <div class="p-4 border text cursor-pointer" @click="handleDisconnect" v-if="connector && connector.name">
      <button>Disconnect</button>
    </div>
  </div>
</template>

<script>
import {SUPPORTED_WALLETS} from "@/connectors/constants";
import useWeb3 from "@/connectors/hooks";
import OptionItem from "@/components/WalletModal/OptionItem";

export default {
  name: "OptionsView",
  components: {OptionItem},
  emits: ['changeView'],
  setup(props, {emit}) {
    const {activate, connector, deactivate} = useWeb3();
    const handleClick = (selectedOption) => {
      console.log(selectedOption)
      if (selectedOption.href) {
        window.location = selectedOption.href;
        return;
      }
      activate(selectedOption.connector)
      emit('changeView', 'pending');

    }
    const handleDisconnect = () => {
      deactivate();
    }
    return {
      options: Object.keys(SUPPORTED_WALLETS).map(key => SUPPORTED_WALLETS[key]),
      handleClick,
      handleDisconnect,
      connector
    }
  }
}
</script>

<style scoped>

</style>

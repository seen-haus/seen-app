<template>
  <div>
    <div class="flex items-center justify-between p-4 mb-4  bg-red-50" v-if="error">
      <div>
        {{ error }}
      </div>
      <button @click="tryAgain">Try Again</button>
    </div>
    <div class="p-4 flex items-center justify-between border hover:border-red mb-4 cursor-pointer" v-if="!error">
      Initializing...
    </div>
    <option-item
        :header="selectedOption.name"
        :subheader="selectedOption.description"
        :key="selectedOption.name"
        :icon="require('./../../assets/icons/' + selectedOption.iconName)"
        v-if="selectedOption"
    />
  </div>
</template>

<script>

import useWeb3 from "@/connectors/hooks";
import OptionItem from "@/components/WalletModal/OptionItem";
import {SUPPORTED_WALLETS} from "@/connectors/constants";
import {computed, watchEffect} from "vue";

export default {
  name: "PendingView",
  components: {OptionItem},
  emits: [''],
  setup(props, {emit}) {
    const {error, connector, activate, connecting, account} = useWeb3()
    watchEffect(() => {
      if (!connecting.value) {
        console.log("change VIEW")
        emit('changeView', account.value ? 'account' : 'options')
      }
    })
    const selectedOption = computed(() => {
      return (Object.keys(SUPPORTED_WALLETS)
          .map((key) => {
            console.log(SUPPORTED_WALLETS[key].connector.name, connecting.value.name, SUPPORTED_WALLETS[key].connector.name === connecting.value.name)
            if (connecting.value &&
                SUPPORTED_WALLETS[key].connector.name === connecting.value.name) {
              console.log(true)
              return SUPPORTED_WALLETS[key];
            }
          }).filter(x=>x))[0]
    });

    const tryAgain = () => {
      activate(connecting.value)
    }

    return {
      connector,
      error,
      selectedOption,
      tryAgain,
    }
  }
}
</script>

<style scoped>

</style>

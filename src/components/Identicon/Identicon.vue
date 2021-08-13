<template>
  <div ref="root"></div>
</template>

<script>
import useWeb3 from "@/connectors/hooks"
import Jazzicon from 'jazzicon'
import {ref, watchEffect, computed} from 'vue'

export default {
  name: "Identicon",
  props: {
    size: {
      type: Number,
      default: 20,
    },
    address: {
      type: String,
      default: null,
    }
  },
  setup(props) {
    const {account} = useWeb3()
    const size = ref(props.size);
    const currentAddress = computed(() => props.address);

    const root = ref(null)
    watchEffect(() => {
      if (root.value) {
        let accStr;
        if (account.value && !currentAddress.value) {
          accStr = account.value;
        } else if (currentAddress.value) {
          accStr = currentAddress.value;
        }
        var child = root.value.firstElementChild; 
        while (child) {
            root.value.removeChild(child);
            child = root.value.firstElementChild;
        }
        console.log({'root.value': root.value, accStr})
        if(accStr) {
          root.value.appendChild(Jazzicon(size.value, parseInt(accStr.slice(2, 10), 16)));
        } else {
          root.value = null;
        }
      } else {
        root.value = null
      }
    },
    {
      flush: 'post'
    })

    return {
      root
    }
  }
}
</script>

<style scoped>

</style>

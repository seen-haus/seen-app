<template>
  <div ref="root"></div>
</template>

<script>
import useWeb3 from "@/connectors/hooks"
import Jazzicon from 'jazzicon'
import {ref, watchEffect} from 'vue'

export default {
  name: "Identicon",
  setup(props) {
    const {account} = useWeb3()
    const size = props.size ? props.size : 16
    const root = ref(null)
    watchEffect(() => {
          if ( root.value && account.value) {
            root.value.innerHtml = ''
            root.value.appendChild(Jazzicon(size, parseInt(account.value.slice(2, 10), 16)));
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

<template>
  <nav id="menu" class="min-h-screen bg-blue-300 slideout-menu">
    menu
  </nav>
</template>

<script>
import {useStore} from "vuex";
import {watchEffect, onMounted, ref, computed} from "vue";
import Slideout from "slideout";

export default {
  name: "MobileMenu",
  setup() {
    const store = useStore()
    let slideout = ref(null)
    let isOpen = computed(() => {
      return store.getters['application/mobileMenu']
    })

    watchEffect(() => {
      if (!slideout.value) {
        return
      }
      if (isOpen.value && slideout.value) {
        slideout.value.open()
      }
      if (!isOpen.value && slideout.value) {
        slideout.value.close()
      }
    }, {
      flush: 'post'
    })

    onMounted(() => {
      slideout.value = new Slideout({
        panel: document.getElementById('main'),
        menu: document.getElementById('menu'),
        padding: 256,
        tolerance: 70,
        touch: false,
      })
    })

  },
}
</script>

<style scoped>

</style>

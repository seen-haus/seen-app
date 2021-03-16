<template>
  <transition name="fade">
    <div class="fixed h-screen inset-x-0 top-0 z-50 overflow-x-auto modal" v-if="visible">
      <div class="relative w-full  min-h-screen px-4 flex items-center justify-center">
        <div
            class="bg-white dark:bg-gray-800 md:max-w-md md:mx-auto z-40 my-4 mx-4 relative modal-inner rounded-lg">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {watchEffect} from "vue"

export default {
  name: "Modal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    watchEffect(() => {
      if (props.visible) {
        document.body.classList.add('modal--open');
      } else {
        document.body.classList.remove('modal--open');
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.modal {
  background: rgba(14, 12, 13, 0.5);
}

.modal-inner {
  min-width: 100%;
  @screen md {
    min-width: 600px;
  }
}
</style>

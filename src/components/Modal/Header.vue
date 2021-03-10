<template>
  <header class="relative p-4 flex justify-between items-center border-b">
    <div class="flex items-center">
      <button  @click="$emit('back')" class="mr-4" v-if="hasBackButton">Back</button>
      <slot></slot>
    </div>
    <button class="cursor-pointer text-lg" @click="onDismiss">
      <i class="fas fa-times"></i>
    </button>
  </header>
</template>

<script>
export default {
  name: "Header",
  emits: ['back'],
  props: {
    hasBackButton: {
      type: Boolean,
      default: false
    }
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  },
  mounted() {
    document.addEventListener("keydown", this.onKeyPress);
  },
  methods: {
    onDismiss() {
      this.$store.dispatch('application/closeModal')
    },
    onKeyPress(evt) {
      if (evt.key === "Escape") {
        this.onDismiss();
      }
    }
  }
}
</script>

<style scoped>

</style>

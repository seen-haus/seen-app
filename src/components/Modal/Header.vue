<template>
  <header class="relative p-4 border-b" :class="getHeaderWrapperClasses">
    <div class="flex w-full justify-center">
      <div class="font-bold text-4xl mt-5">
        <slot></slot>
      </div>
    </div>
    <button class="absolute right-4 top-4 cursor-pointer text-lg" @click="onDismiss">
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
    },
    isProfilePage: {
      type: Boolean,
      default: false
    },
    additionalDismissFunctionality: {
      type: Function,
      default: null
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
      if(this.additionalDismissFunctionality) {
        this.additionalDismissFunctionality()
      }
    },
    onKeyPress(evt) {
      if (evt.key === "Escape") {
        this.onDismiss();
      }
    }
  },
  computed: {
    getHeaderWrapperClasses: function () {
      return this.isProfilePage ? 'h-40 bg-background-gray' : '';
    }
  }
}
</script>

<style scoped>

</style>
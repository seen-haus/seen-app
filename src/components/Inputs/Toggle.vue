<template>
  <div
    class="flex justify-center items-center cursor-pointer"
    @click="this.$emit('onChange', !value)"
  >
    <div class="toggle">
      <i v-if="value" class="fas fa-toggle-on mr-2 text-3xl"></i>
      <i
        v-if="!value"
        class="fas fa-toggle-off mr-2 text-3xl text-gray-300"
      ></i>
    </div>
    <div class="slot"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: "Toggle",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
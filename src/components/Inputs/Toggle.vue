<template>
  <div
    class="flex justify-center items-center cursor-pointer"
    @click="onChange"
  >
    <div class="toggle mr-2" :class="{ on: value }">
      <div class="knob"></div>
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
  setup(props, ctx) {
    const onChange = () => {
      ctx.emit("onChange", !props.value);
    };

    return {
      onChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  @apply bg-gray-300 rounded-full overflow-hidden flex justify-start;

  height: 20px;
  width: 40px;

  .knob {
    @apply bg-white rounded-full;

    height: 18px;
    width: 18px;
    margin: 1px;
    box-shadow: 0 4px 10px 0 #00000026, 0 1px 3px 0 #00000033;
    background-image: linear-gradient(to top, #e3e3e3, #ffffff);
  }

  &.on {
    @apply bg-primary justify-end;

    .knob {
    }
  }
}
</style>
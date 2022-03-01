<template>
  <div class="title flex items-center fence-wrap"
    :style="{
      ...(alignment === 'center' && {'justify-content': 'center'}),
      'width': width ? width : '100%',
    }"
  >
    <div
        class="title-text font-title lg:flex-shrink-0 font-bold"
        :class="unshrinkable ? 'flex-shrink-0' : 'flex-shrink'"
        :style="{
          'max-width': maxWidth ? maxWidth : '100%',
          'width': hideBars ? '100%' : 'auto',
          'text-align': alignment,
          'font-size': fontSize ? fontSize : '48px',
          ...(titleMonospace && {'font-family': 'monospace'})
        }"
    >
      <slot> Title</slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "UnfencedTitle",
  props: {
    textAlign: String, // left, center, right
    color: String, //
    unshrinkable: Boolean,
    titleMonospace: Boolean,
    fontSize: String,
    width: String,
    maxWidth: String,
  },
  computed: {
    alignment: function () {
      return this.textAlign || "center";
    },
  },
};
</script>


<style lang="scss" scoped>
.title-small {
  .title-text {
    max-width: 80%;
    margin-top: -6px;
    font-size: 36px;
  }
}

.title-text {
  max-width: 80%;
  font-size: 36px;
  margin-top: -6px;
  @screen md {
    font-size: 46px;
  }
}

</style>

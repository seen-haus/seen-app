<template>
  <div class="title flex items-center fence-wrap" >

    <div
        class="title-text font-title lg:flex-shrink-0"
        :class="unshrinkable ? 'flex-shrink-0' : 'flex-shrink'"
        :style="{
          'max-width': '100%',
          'width': '100%',
          'text-align': alignment,
          'font-size': fontSize ? fontSize : '36px',
          'font-weight': fontWeight ? fontWeight : '500',
          ...(alignment === 'center' && {'justify-content': 'center'}),
          ...(titleMonospace && {'font-family': 'monospace'}),
          ...(lineHeight && {'line-height': lineHeight}),
          ...(upperCase && {'text-transform': 'uppercase'}),
          ...(overflowEllipsis && {
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap',
          })
        }"
    >
      <slot> Title</slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "CommonTitle",
  props: {
    textAlign: String, // left, center, right
    unshrinkable: Boolean,
    titleMonospace: Boolean,
    fontSize: String,
    fontWeight: Number,
    lineHeight: String,
    overflowEllipsis: Boolean,
    upperCase: Boolean,
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
    font-size: 36px;
  }
}

.title-text {
  max-width: 80%;
  font-size: 36px;
  @screen md {
    font-size: 46px;
  }
}

</style>

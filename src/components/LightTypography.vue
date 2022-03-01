<template>
  <div class="title items-center" >

    <div
        class="title-text font-title lg:flex-shrink-0 flex-shrink"
        :style="{
          'max-width': maxWidth ? maxWidth : '100%',
          'width': '100%',
          'text-align': alignment,
          'font-size': fontSize ? fontSize : '16px',
          'font-weight': fontWeight ? fontWeight : '400',
          'margin-bottom': marginBottom ? marginBottom : '0px',
          ...(paddingBottom && {'padding-bottom': paddingBottom}),
          ...(upperCase && {'text-transform': 'uppercase'}),
          ...(lineHeight && {'line-height': lineHeight}),
          ...(titleMonospace && {'font-family': 'monospace'})
        }"
    >
      <slot> Title</slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "LightTypography",
  props: {
    textAlign: String, // left, center, right
    monospace: Boolean,
    fontSize: String,
    fontWeight: Number,
    lineHeight: String,
    marginBottom: String,
    paddingBottom: String,
    upperCase: Boolean,
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
    font-size: 36px;
  }
}

.title-text {
 @apply text-light-grey;
  max-width: 80%;
  font-size: 36px;
  @screen md {
    font-size: 46px;
  }
}

</style>

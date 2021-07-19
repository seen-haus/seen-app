<template>
  <div class="title flex items-center fence-wrap" >

    <div
        class="title-text font-title lg:flex-shrink-0 flex-shrink"
        :style="{
          'max-width': '100%',
          'width': '100%',
          'text-align': alignment,
          'font-size': fontSize ? fontSize : '16px',
          'font-weight': fontWeight ? fontWeight : '400',
          'margin-bottom': marginBottom ? marginBottom : '0px',
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
    fontSize: Number,
    fontWeight: Number,
    marginBottom: Number,
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
 @apply text-light-grey;
  max-width: 80%;
  font-size: 36px;
  margin-top: -6px;
  @screen md {
    font-size: 46px;
  }
}

</style>

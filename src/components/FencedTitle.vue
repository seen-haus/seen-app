<template>
  <div class="title flex items-center">
    <div
      v-if="showLeft"
      class="fence flex-shrink mr-6"
      :class="{ 'fence-left': closed, ...colorClass }"
    ></div>

    <div class="title-text text-center font-title flex-shrink lg:flex-shrink-0 font-bold">
      <slot> Title </slot>
    </div>

    <div
      v-if="showRight"
      class="fence flex-shrink ml-6"
      :class="{ 'fence-right': closed, ...colorClass }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "FencedTitle",
  props: {
    textAlign: String, // left, center, right
    closed: Boolean, // Are fences closed at the ends
    color: String, // 
  },
  computed: {
    alignment: function () {
      return this.textAlign || "center";
    },
    showLeft: function () {
      return this.alignment === "center" || this.alignment === "right";
    },
    showRight: function () {
      return this.alignment === "center" || this.alignment === "left";
    },
    colorClass: function () {
      if (this.color == null) return {};
      return { [this.color]: true };
    },
  },
};
</script>


<style lang="scss" scoped>
.title-text {
  max-width: 80%;
  font-size: 46px;
  margin-top: -6px;
}
.fence {
  width: 100%;
  height: 25px;
  padding: 5px 0;
  border-top: 5px solid;
  border-bottom: 5px solid;
  border-color: theme("colors.fence-light") !important;

  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 5px;
    background: theme("colors.fence-light") !important;
  }

  &.fence-dark {
    border-color: theme("colors.fence-dark") !important;

    &::before {
      background: theme("colors.fence-dark") !important;
    }
  }

  &.fence-gray {
    border-color: theme("colors.fence-gray") !important;

    &::before {
      background: theme("colors.fence-gray") !important;
    }
  }

  &.fence-left {
    border-left: 5px solid;
  }

  &.fence-right {
    border-right: 5px solid;
  }
}
</style>
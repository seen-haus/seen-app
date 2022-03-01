<template>
  <div class="title flex items-center fence-wrap" :class="darkMode && 'dark-mode-text'">
    <div
        v-if="showLeft"
        class="fence flex-shrink mr-6"
        :class="{
          'fence-left': closed, ...colorClass,
          ...(titleMonospace && {'font-family': 'monospace'})
        }"
    ></div>

    <div
        class="title-text text-center font-title lg:flex-shrink-0 font-bold"
        :class="unshrinkable ? 'flex-shrink-0' : 'flex-shrink'"
        :style="{ 
          'max-width': hideBars ? '100%' : '80%',
          'width': hideBars ? '100%' : 'auto',
          ...(titleMonospace && {'font-family': 'monospace'})
        }"
    >
      <slot> Title</slot>
    </div>

    <div
        v-if="showRight"
        class="fence flex-shrink ml-6"
        :class="{ 
          'fence-right': closed, ...colorClass,
          ...(titleMonospace && {'font-family': 'monospace'})
        }"
    ></div>
  </div>
</template>

<script>
import useDarkMode from '@/hooks/useDarkMode';

export default {
  name: "FencedTitle",
  props: {
    hideBars: Boolean,
    textAlign: String, // left, center, right
    closed: Boolean, // Are fences closed at the ends
    color: String, //
    unshrinkable: Boolean,
    titleMonospace: Boolean,
  },
  computed: {
    alignment: function () {
      return this.textAlign || "center";
    },
    showLeft: function () {
      if (this.hideBars) return false;
      return this.alignment === "center" || this.alignment === "right";
    },
    showRight: function () {
      if (this.hideBars) return false;
      return this.alignment === "center" || this.alignment === "left";
    },
    colorClass: function () {
      if (this.color == null) return {};
      return {[this.color]: true};
    },
  },
  setup() {
    const { darkMode } = useDarkMode();

    return {
      darkMode,
    }
  }
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

.fence-wrap {
  .title-text {
    max-width: 100% !important;
    width: 100% !important;
    text-align: center;
  }

  .fence {
    display: none !important;
  }

  @screen lg {
    .title-text {
      max-width: inherit !important;
      width: auto !important;
    }

    .fence {
      display: block !important;
    }
  }
}
</style>

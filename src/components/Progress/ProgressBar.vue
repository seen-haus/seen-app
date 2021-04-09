<template>
  <div class="progress-bar rounded-full overflow-hidden">
    <div
      class="progress h-full rounded-full rounded-tr-none rounded-br-none"
      :class="progressColor"
      :style="{ width: progressPercent }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    progress: {
      type: Number,
      default: 0.5,
    }, // from 0.0 to 1.0
    colorClass: {
      type: String,
      default: "bg-primary",
    }, // Actual css class
    inversed: {
      type: Boolean,
    }
  },
  computed: {
    progressPercent: function () {
      if (this.inversed) return (100 - this.progress * 100) + "%";
      return this.progress * 100 + "%";
    },
    progressColor: function () {
      return this.colorClass;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  min-height: 2px;
}
</style>

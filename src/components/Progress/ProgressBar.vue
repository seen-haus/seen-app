<template>
  <div class="progress-bar rounded-full">
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
    progress: Number, // from 0.0 to 1.0
    colorClass: String, // Actual css class
  },
  computed: {
    progressPercent: function () {
      return (this.progress || 0.5) * 100 + "%";
    },
    progressColor: function () {
      return this.colorClass || "bg-primary";
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  min-height: 2px;
}
</style>

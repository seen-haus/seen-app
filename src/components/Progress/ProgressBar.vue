<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: progressPercent }"></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    progress: Number,
  },
  computed: {
    progressPercent: function () {
      return (this.progress || 0.5) * 100 + "%";
    },
  },
};
</script>

<style lang="scss" scoped>
  .progress-bar {
    @apply rounded-full;
    min-height: 1px;

    .progress {
      @apply h-full rounded-full;
      background: #34ca98;
      border-top-right-radius: 0; 
      border-bottom-right-radius: 0; 
    }
  }
</style>

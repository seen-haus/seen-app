<template>
  <div
    class="progress-bar rounded-full overflow-hidden"
    :style="{display: 'flex', justifyContent: 'space-between', position: 'relative'}"
  >
    <div
      class="progress h-full rounded-full rounded-tr-none rounded-br-none"
      :style="{ width: progressPercent, zIndex: 10, transition: 'all 0.2s ease-out' }"
    ></div>
    <div
      class="progress h-full rounded-tr-none rounded-br-none"
      :style="{ width: inverseProgressPercent, zIndex: 10, transition: 'all 0.2s ease-out' }"
      :class="backgroundColor"
    ></div>
    <div
      class="progress h-full"
      :style="{width: '100%', position: 'absolute'}"
      :class="progressColor">
    </div>
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
    },
    endDate: {
      type: String,
      default: null,
    },
    progressBackgroundColor: {
      type: String,
      default: "bg-gray-300",
    }
  },
  computed: {
    progressPercent: function () {
      if (this.inversed) return (100 - this.progress * 100) + "%";
      return this.progress * 100 + "%";
    },
    inverseProgressPercent: function () {
      if (this.inversed) return 100 - (100 - this.progress * 100) + "%";
      return (100 - this.progress * 100) + "%";
    },
    isInversed: function () {
      return this.inversed;
    },
    progressColor: function () {
      if(
        !isNaN(this.progress)
        && this.endDate
        && (Math.floor((new Date(this.endDate) - new Date()) / 1000) <= 900 && Math.floor((new Date(this.endDate) - new Date()) / 1000) > 0)
        && this.inversed
      ) {
        // When less than 15 minutes
        return 'bg-progress-bar-vibrant';
      }
      return this.colorClass;
    },
    backgroundColor: function () {
      return this.progressBackgroundColor;
    }
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  min-height: 2px;
}
</style>

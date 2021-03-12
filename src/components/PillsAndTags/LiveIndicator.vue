<template>
  <div class="live-indicator flex items-center font-medium text-xs">
    <div
      class="indicator-icon w-2.5 h-2.5 rounded-full mr-2"
      :class="{
        'bg-primary': indicatorStatus === 'LIVE',
        'bg-gray-500': indicatorStatus === 'ENDED',
        'bg-accent': indicatorStatus === 'COMMING SOON',
      }"
    ></div>
    <div class="font-bold"><slot></slot></div>
  </div>
</template>


<script>
export default {
  name: "LiveIndicator",
  props: {
    status: String,
  },
  computed: {
    indicatorStatus: function () {
      switch (this.status) {
        case "live":
          return "LIVE";
        case "ended":
          return "ENDED";
        case "comming soon":
          return "COMMING SOON";
        default:
          return "CUSTOM";
      }
    },
  },
};
</script>
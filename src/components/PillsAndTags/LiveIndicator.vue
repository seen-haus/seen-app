<template>
  <div
    class="live-indicator flex items-center font-medium text-10px rounded py-0.5 px-2"
  >
    <div
      class="indicator-icon w-2.5 h-2.5 rounded-full mr-2"
      :class="{
        'bg-primary blink': indicatorStatus === 'LIVE',
        'bg-gray-500':
          indicatorStatus === 'ENDED' ||
          indicatorStatus === 'CLOSED' ||
          indicatorStatus === 'SOLD OUT',
        'bg-dark-blue': indicatorStatus === 'NEXT PHASE' || indicatorStatus === 'AWAITING RESERVE BID',
        'bg-accent': indicatorStatus === 'COMING SOON',
      }"
    ></div>
    <div class="font-bold" :class="darkMode && 'dark-mode-text'">
      <slot>{{ indicatorStatusOverride ? indicatorStatusOverride : indicatorStatus }}</slot>
    </div>
  </div>
</template>

<script>
import useDarkMode from '@/hooks/useDarkMode';

export default {
  name: "LiveIndicator",
  props: {
    status: { type: String, default: "live" },
    statusOverride: { type: String, default: "" },
  },
  computed: {
    indicatorStatus: function () {
      switch (this.status) {
        case "live":
          return "LIVE";
        case "ended":
          return "ENDED";
        case "sold out":
          return "SOLD OUT";
        case "coming soon":
          return "COMING SOON";
        case "closed":
          return "CLOSED";
        case "next phase":
          return "NEXT PHASE";
        case "reserved":
          return "RESERVED";
        case "awaiting-reserve-bid":
          return "AWAITING RESERVE BID";
        default:
          return "CUSTOM";
      }
    },
    indicatorStatusOverride: function () {
      if(this.statusOverride?.length > 0) {
        return this.statusOverride;
      }
      return false;
    }
  },
  setup() {
    const { darkMode } = useDarkMode();

    return {
      darkMode,
    }
  }
};
</script>


<style lang="scss">
.live-indicator.dark {
  background: rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(0, 0, 0, 1);
  }
}
.live-indicator.light {
  background: rgba(100, 100, 100, 0.15);
}
.blink {
  animation: blink 2s both 0s infinite;
}
@keyframes blink {
  0% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.25;
  }
}
</style>
<template>
  <div>
    <span class="text-gray-400 mr-2">{{ labelText }}</span
    ><span class="font-semibold">{{value}}</span>
  </div>
</template>


<script>
import useTimer from "@/hooks/useTimer.js";
import { computed, watch } from 'vue';

export default {
  name: "ProgressTimer",
  props: {
    label: {
      type: String,
      default: "Ends in:",
    },
    startDate: {
      type: String,
      default: "2021-03-14T02:00:00.000Z",
    },
    endDate: {
      type: String,
      default: "2021-03-16T10:00:00.000Z",
    },
  },
  // TODO timer logic
  setup(props, ctx) {
    const { startTimer, endTimer, addSeconds, percentage, value } = useTimer();

    const labelText = computed(() => {
      return value.value === 'Comming soon' || value.value === 'Auction ended' ? '' : props.label;
    });

    watch(percentage, () => ctx.emit('onProgress', percentage.value));

    startTimer({
      startDate: props.startDate,
      endDate: props.endDate,
    });

    return {
      percentage,
      value,
      endTimer,
      addSeconds,
      labelText
    }
  },
};
</script>
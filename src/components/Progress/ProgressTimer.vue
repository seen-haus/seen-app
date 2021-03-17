<template>
  <div>
    <span v-if="label != null" class="text-gray-400 mr-2">{{ labelText }}</span
    ><span class="font-semibold">{{value}}</span>
  </div>
</template>


<script>
import useTimer, {TIMER_STATE} from "@/hooks/useTimer.js";
import { computed, watch, ref } from 'vue';

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
    const timerState = ref(TIMER_STATE.WAITING);
    const { startTimer, endTimer, addSeconds, percentage, value } = useTimer(timerStateChange);

    watch(percentage, () => ctx.emit('onProgress', percentage.value));
    watch(timerState, () => ctx.emit('onTimerStateChange', timerState.value));

    const labelText = computed(() => {
      if (timerState.value === TIMER_STATE.WAITING) {
        return 'Launching in: ';
      }
      if (timerState.value === TIMER_STATE.IN_PROGRESS) {
        return 'Ends in: ' || props.label;
      }
      if (timerState.value === TIMER_STATE.DONE) {
        return '';
      }

      return ''
    });

    function timerStateChange(state) {
      timerState.value = state;
    }

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
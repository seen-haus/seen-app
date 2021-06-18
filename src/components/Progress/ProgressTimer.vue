<template>
  <div>
    <span v-if="label != null" class="text-gray-400 mr-2">{{ labelText }}</span
    ><span class="font-semibold">{{ value }}</span>
  </div>
</template>


<script>
import useTimer, {TIMER_STATE} from "@/hooks/useTimer.js";
import {computed, watch, ref, toRefs} from 'vue';

export default {
  name: "ProgressTimer",
  props: {
    isAuction: {
      type: Boolean,
      default: true
    },
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
    overrideStartsInLabel: {
      type: String,
      default: "",
    },
    overrideEndsInLabel: {
      type: String,
      default: "",
    }
  },
  // TODO timer logic
  setup(props, ctx) {
    const timerState = ref(TIMER_STATE.WAITING);
    const {startTimer, endTimer, addSeconds, percentage, value, ended} = useTimer(timerStateChange);

    watch(percentage, () => ctx.emit('onProgress', percentage.value));
    watch(timerState, () => ctx.emit('onTimerStateChange', timerState.value));
    watch([toRefs(props).endDate, toRefs(props).startDate], (v, p) => {
      if (v[0] !== p[0] || v[1] !== p[1]) {
        let diffEnd = new Date(v[0]).getTime() - new Date(p[0]).getTime();
        let diffStart = new Date(v[1]).getTime() - new Date(p[1]).getTime();
        addSeconds((diffEnd) / 1000, diffStart / 1000);
        // Hack if server timestamp isn't up to date
        if (ended.value && new Date() < new Date(p[0])) {
          setTimeout(() => {
            if (ended.value && new Date() < new Date(p[0])) {
              startTimer({
                startDate: props.startDate,
                endDate: props.endDate,
              });
            }
          }, 4000)
        }
      }
    });

    const labelText = computed(() => {
      if (timerState.value === TIMER_STATE.WAITING) {
        if(props.overrideStartsInLabel) {
          return props.overrideStartsInLabel;
        }
        return props.isAuction ? 'Auction starts in: ' : 'Sale starts in: ';
      }
      if (timerState.value === TIMER_STATE.IN_PROGRESS) {
        if(props.overrideEndsInLabel) {
          return props.overrideEndsInLabel;
        }
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

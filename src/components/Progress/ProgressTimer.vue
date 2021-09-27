<template>
  <div>
    <span v-if="label != null" class="text-gray-400 mr-2">{{ labelText }}</span
    ><span class="font-semibold">{{ value }}</span>
  </div>
</template>


<script>
import useTimer, {TIMER_STATE} from "@/hooks/useTimer.js";
import {computed, watch, watchEffect, ref, toRefs} from 'vue';

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
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    overrideStartsInLabel: {
      type: String,
      default: "",
    },
    overrideEndsInLabel: {
      type: String,
      default: "",
    },
    isAwaitingReserve: {
      type: Boolean,
      default: false,
    }
  },
  // TODO timer logic
  setup(props, ctx) {
    const timerState = ref(TIMER_STATE.WAITING);
    const {startTimer, endTimer, addSeconds, percentage, value, ended} = useTimer(timerStateChange);

    watch(percentage, () => ctx.emit('onProgress', percentage.value));
    watch(timerState, () => ctx.emit('onTimerStateChange', timerState.value));
    watch([toRefs(props).endDate, toRefs(props).startDate, toRefs(props).isAwaitingReserve], (v, p) => {
      if (v[0] !== p[0] || v[1] !== p[1]) {
        let diffEnd = new Date(v[0]).getTime() - new Date(p[0]).getTime();
        let diffStart = new Date(v[1]).getTime() - new Date(p[1]).getTime();
        addSeconds((diffEnd) / 1000, diffStart / 1000, v[2]);
        // Hack if server timestamp isn't up to date
        if (ended.value && new Date() < new Date(p[0])) {
          setTimeout(() => {
            if (ended.value && new Date() < new Date(p[0])) {
              startTimer({
                startDate: props.startDate,
                endDate: props.endDate,
                isAwaitingReserve: v[2],
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
        return props.isAuction ? 'Bidding opens in: ' : 'Sale starts in: ';
      }
      if (timerState.value === TIMER_STATE.IN_PROGRESS) {
        if(props.overrideEndsInLabel) {
          return props.overrideEndsInLabel;
        }
        return `${props.isAuction ? 'Auction' : 'Sale'} ends in: ` || props.label;
      }
      if (timerState.value === TIMER_STATE.DONE) {
        return '';
      }

      return ''
    });

    function timerStateChange(state) {
      timerState.value = state;
    }


    watchEffect(() => {
      startTimer({
        startDate: props.startDate,
        endDate: props.endDate,
        isAwaitingReserve: props.isAwaitingReserve,
      });
    })

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

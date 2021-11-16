<template>
  <div>
    <light-typography 
        v-if="label != null"
        textAlign="left"
        fontSize="14px"
        fontWeight="700"
        lineHeight="16px"
        paddingBottom="6px"
        :upperCase="true"
    >
        {{ labelText }}
    </light-typography>
    <sub-title
        class="text-black hidden lg:flex"
        :class="whiteText && 'text-white'"
        text-align="left"
        fontSize="24px"
        line-height="30px"
        :overflowEllipsis="true"
    >
        {{ value }}
    </sub-title>
  </div>
</template>


<script>
import {computed, watch, watchEffect, ref, toRefs} from 'vue';

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import useTimer, {TIMER_STATE} from "@/hooks/v3/useTimer.js";

export default {
  name: "ProgressTimer",
  props: {
    listingType: {
      type: String,
      default: null
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
    },
    whiteText: {
      type: Boolean,
      default: false,
    }
  },
  components: {
      SubTitle,
      LightTypography,
  },
  // TODO timer logic
  setup(props, ctx) {
    const timerState = ref(TIMER_STATE.WAITING);
    const {startTimer, endTimer, addSeconds, percentage, value, ended} = useTimer(timerStateChange);

    watch(percentage, () => ctx.emit('onProgress', percentage.value));
    watch(timerState, () => ctx.emit('onTimerStateChange', timerState.value));
    // watch([toRefs(props).endDate, toRefs(props).startDate, toRefs(props).isAwaitingReserve], (v, p) => {
    //   if (v[0] !== p[0] || v[1] !== p[1]) {
    //     let diffEnd = new Date(v[0]).getTime() - new Date(p[0]).getTime();
    //     let diffStart = new Date(v[1]).getTime() - new Date(p[1]).getTime();
    //     addSeconds((diffEnd) / 1000, diffStart / 1000, v[2]);
    //     // Hack if server timestamp isn't up to date
    //     if (ended.value && new Date() < new Date(p[0])) {
    //       setTimeout(() => {
    //         if (ended.value && new Date() < new Date(p[0])) {
    //           startTimer({
    //             startDate: props.startDate,
    //             endDate: props.endDate,
    //             isAwaitingReserve: v[2],
    //           });
    //         }
    //       }, 4000)
    //     }
    //   }
    // });

    const labelText = computed(() => {
      if (timerState.value === TIMER_STATE.WAITING) {
        if(props.overrideStartsInLabel) {
          return props.overrideStartsInLabel;
        }
        if(props.listingType === 'auction') {
            return 'Bidding opens in';
        } else if (props.listingType === 'sale') {
            return 'Sale opens in';
        } else {
            return 'Bidding opens in';
        }
      }
      if (timerState.value === TIMER_STATE.IN_PROGRESS) {
        if(props.overrideEndsInLabel) {
          return props.overrideEndsInLabel;
        }
        if(props.listingType === 'auction') {
            return 'Auction ends in';
        } else if (props.listingType === 'sale') {
            return 'Sale ends in';
        } else {
            return 'Bidding ends in';
        }
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

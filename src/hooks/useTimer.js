import {reactive, computed, onUnmounted, watch, ref} from 'vue';

let globalTimer = null;
let globalTimerListeners = [];

function globalTimerTick() {
    globalTimerListeners.forEach(callbackfn => callbackfn(Date.now()));
}

function addListener(listener) {
    globalTimerListeners.push(listener);
    if (globalTimerListeners.length === 1) {
        globalTimer = setInterval(globalTimerTick, 1000);
    }
}

function removeListener(listener) {
    globalTimerListeners = globalTimerListeners.filter(i => i != listener);
    if (globalTimerListeners.length === 0) {
        clearInterval(globalTimer);
    }
}

export const TIMER_STATE = Object.freeze({
    WAITING: 'WAITING',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
});

export default function useTimer(callback) {
    const timerState = ref(TIMER_STATE.WAITING);
    const ended = ref(false);
    const state = reactive({
        startDate: null,
        endDate: null,
        isAwaitingReserve: false,
        value: '',
        percentage: 0.0,
        callback: callback,
    });

    const percentage = computed(() => {
        return state.percentage;
    });
    const value = computed(() => state.value);

    function subscribe() {
        ended.value = false
        addListener(tick);
    }

    function unsubscribe() {
        ended.value = true
        removeListener(tick);
    }

    watch(timerState, (newValue, oldValue) => {
        if (newValue.state === oldValue) return;

        if (state.callback != null) state.callback(newValue);
    });

    function tick(now) {
        // Needs recalculation every tick because of ability to add more time
        let duration;
        let progress;
        let progressLeft;

        if (now < state.startDate) {
            duration = state.startDate - now;
            progress = 0.0;
            progressLeft = duration;
        } else if (state.endDate != null) {
            duration = state.endDate - state.startDate;
            progress = now - state.startDate;
            progressLeft = state.endDate - now;
        } else {
            progress = now - state.startDate;
            duration = progress;
            progressLeft = progress;
        }

        if((Math.floor(progressLeft / 1000) <= 900) && (now > state.startDate)) {
            duration = 900 * 1000
            progressLeft = state.endDate - now;
            progress = duration - progressLeft;
        }
        
        state.percentage = +(progress / duration).toFixed(2);
        if (progressLeft <= 0 || (state.isAwaitingReserve && new Date().getTime() > state.startDate)) {
            timerState.value = TIMER_STATE.DONE;
            if(state.isAwaitingReserve) { // || !state.endDate maybe
                state.value = 'Awaiting Reserve Bid';
            } else {
                state.value = 'Auction Ended';
            }
            endTimer();
        } else if(progressLeft > 10000000000) {
            timerState.value = TIMER_STATE.DONE;
            state.value = 'Loading...'; // In case there is an issue fetching times (rather than show a very incorrect time)
            endTimer();
        } else {
            timerState.value = (now < state.startDate)
                ? TIMER_STATE.WAITING
                : TIMER_STATE.IN_PROGRESS;
            state.value = formatter(progressLeft);
        }
    }

    function startTimer(options) {
        unsubscribe();
        const {
            startDate,
            endDate = null,
            isAwaitingReserve = false,
        } = options;

        const now = Date.now();
        const start = !startDate ? null : new Date(startDate).getTime();
        const end = !endDate ? null : new Date(endDate).getTime();

        // const now = Date.now();
        // const start = Date.now() + 3000;
        // const end = Date.now() + 14000;

        if (end && now > end) {
            unsubscribe();
            timerState.value = TIMER_STATE.DONE;
            state.percentage = 1.0;
            state.value = 'Auction ended';
            return;
        }

        if (now < start || isAwaitingReserve) {
            timerState.value = TIMER_STATE.WAITING;
        } else {
            timerState.value = TIMER_STATE.IN_PROGRESS;
        }

        state.value = 'Loading...';
        state.startDate = start;
        state.endDate = end;
        state.isAwaitingReserve = isAwaitingReserve;

        unsubscribe();
        subscribe();
    }

    function addSeconds(endSeconds, startSeconds = 0, isAwaitingReserve = false) {
        let old = state.endDate;
        console.log("OLD", old)
        if(!old) {
            console.log(state)
        }
        let newEndDate = state.endDate + (endSeconds * 1000);
        let newStartDate = state.startDate + (startSeconds * 1000);
        if(newEndDate && newStartDate) {
            if(state.endDate !== newEndDate || state.startDate !== newStartDate) {
                startTimer({startDate: newStartDate, endDate: newEndDate, isAwaitingReserve});
            }
        }
    }

    function endTimer() {
        unsubscribe();
    }

    onUnmounted(() => {
        unsubscribe();
    });

    // Formatter
    function formatter(time) {
        const total = 0 | (time / 1000);
        let seconds = Math.floor((total) % 60);
        let minutes = Math.floor((total / 60) % 60);
        const hours = Math.floor((total / (60 * 60)) % 24);
        const days = Math.floor(total / (60 * 60 * 24));

        if(seconds < 10) {
            seconds = `0${seconds}`
        }

        if(minutes < 10) {
            minutes = `0${minutes}`
        }

        if (days > 0 || hours > 24) {
            return `${days}d ${hours}h ${minutes}m`;
        } else {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
    }

    return {
        startTimer,
        endTimer,
        addSeconds,
        percentage,
        value,
        ended,
    };
}

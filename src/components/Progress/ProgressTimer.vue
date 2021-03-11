<template>
    <div class="progress-timer flex flex-col">
        <progress-bar :progress="0.34" class="bg-white bg-opacity-10 h-3"/>
        <div class="text-gray-400 time-left text-sm pt-3.5">Ends in: <span class="text-white font-semibold text-base">19h 53m</span></div>
    </div>
</template>


<script>
import ProgressBar from './ProgressBar.vue';

export default {
    name: 'ProgressTimer',
    props: {
        endDate: Date,
    },
    components: {
        ProgressBar
    }
    // TODO timer logic
}
</script>
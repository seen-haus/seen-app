<template>
    <div>
      <span class="text-gray-400 mr-2">{{label}}</span
      ><span class="font-semibold">19h 53m</span>
    </div>
</template>


<script>

export default {
  name: "ProgressTimer",
  props: {
    label: {
      type: String,
      default: 'Ends in:'
    },
    endDate: Date,
  },
  // TODO timer logic
};
</script>
<template>
    <div>
      <span class="text-gray-400">Ends in: </span
      ><span class="font-semibold">19h 53m</span>
    </div>
</template>


<script>

export default {
  name: "ProgressTimer",
  props: {
    endDate: Date,
  },
  // TODO timer logic
};
</script>
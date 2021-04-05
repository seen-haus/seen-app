<template>
  <div class="not-found-wrapper flex justify-center items-center h-full flex-col">
    <p class="text-4xl mb-4 font-bold">We're sorry</p>
    <p class="font-lg">Content you're looking for, could not be found</p>
  </div>
</template>
<script>

export default {
  name: "NotFound",
};
</script>
<style scoped>
  .not-found-wrapper {
    min-height: 15rem;
  }
</style>
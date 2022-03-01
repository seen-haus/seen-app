<template>
  <div class="container mx-auto px-6 md:px-8">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Container"
}
</script>

<style>
@screen xl {
  .container {
    max-width: 1171px;
  }
}
</style>

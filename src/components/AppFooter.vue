<template>
  <div class="bg-black py-4 text-white pt-8 lg:pt-16 pb-6 lg:pb-4">
    <container>
      footer
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container";

export default {
  name: 'AppFooter',
  components: {Container},
}
</script>

<style lang="scss" scoped>
.footer-logo {
  margin-left: -32px;
  @screen md {
    margin-left: 0px;
  }
}
</style>

<template>
  <div class="profile">
    <container>
       <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Your collection</fenced-title
      >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
        <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card />
      </div>
    </container>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "Profile",
  components: { FencedTitle, Container, ProductCard },
}
</script>

<style scoped>

</style>

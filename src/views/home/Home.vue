<template>
  <div>
    <hero-auction />

    <container class="section-featured-auctions">
      <div class="flex items-center py-24 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 lg:hidden self-stretch"
          color="fence-light"
          textAlign="center"
          :closed="true"
          >Featured Auctions</fenced-title
        >
        <fenced-title
          class="flex-grow mr-0 mb-6 lg:mb-0 lg:mr-6 hidden lg:flex"
          color="fence-light"
          textAlign="left"
          :closed="true"
          >Featured Auctions</fenced-title
        >
        <button class="button dark flex-shrink-0">
          View All Auctions <i class="fas fa-arrow-right ml-3 icon-right"></i>
        </button>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import HeroAuction from "./components/HeroAuction.vue";

export default {
  name: "Home",
  components: { HeroAuction, Container, FencedTitle },
};
</script>

<style scoped lang="scss">
</style>

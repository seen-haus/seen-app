<template>
  <div class="faqs">
    <container class="section-featured-auctions pb-12">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >FAQs</fenced-title
        >
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        You got questions? We got the answers.
      </div>


      <div class="faq-list py-14">
        <collapsible-tile class="mx-auto mb-6" v-for="item in 8" :key="item"/>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import CollapsibleTile from "./components/CollapsibleTile.vue";

export default {
  name: "Faqs",
  components: {
    Container,
    FencedTitle,
    CollapsibleTile
  },
};
</script>

<style scoped>
</style>

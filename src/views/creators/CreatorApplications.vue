<template>
  <div class="faqs">
    <container class="section-featured-auctions">
      <div class="flex items-center pt-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Creator Applications</fenced-title
        >
      </div>
      <div class="flex-center">
        <div>
          <img src="@/assets/images/paint-3d.png" class="creator-application-image mb-6" alt="Creator Application Icon">
          <a href="https://hrrbhng6xw2.typeform.com/to/qRjFeDbt" class="w-full" target="_blank" rel="noopener noreferrer">
            <button class="w-full cursor-pointer primary button mt-3 md:mt-0 mb-3">
              V3 Self-Minting Whitelist Application
            </button>
          </a>
          <a href="https://hrrbhng6xw2.typeform.com/to/YSfvT4dc" class="w-full" target="_blank" rel="noopener noreferrer">
            <button class="w-full cursor-pointer primary button mt-3 md:mt-0 mb-3">
              Physical Drop Application
            </button>
          </a>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";
import { useStore } from "vuex";

import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";

export default {
  name: "Faqs",
  components: {
    Container,
    FencedTitle,
  },
  setup() {
    const { meta } = useMeta({
      title: "Creator Applications",
    });

    const store = useStore();

    // Disable dark mode until dark mode is supported across website
    store.dispatch("application/setDarkMode", false);
  }
};
</script>

<style scoped>
  .creator-application-image {
    max-width: 200px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
</style>

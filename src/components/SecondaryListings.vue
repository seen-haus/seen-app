<template>
  <div class="grid grid-cols-1 gap-5" :class="{'lg:grid-cols-1': secondaryMarketListings.length === 1, 'lg:grid-cols-2': secondaryMarketListings.length === 2, 'md:grid-cols-2 xl:grid-cols-3': secondaryMarketListings.length > 2}">
    <div v-for="(secondaryMarketListing) in secondaryMarketListings" :key="secondaryMarketListing.id">
      <secondary-listing-list-item :collectable="secondaryMarketListing" />
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watchEffect, computed} from "vue";

import SecondaryListingListItem from "@/components/SecondaryListingListItem.vue";

export default {
  name: "SecondaryListings",
  components: {
    SecondaryListingListItem
  },
  props: {
    secondaryMarketListings: Array,
  },
};
</script>

<style lang="scss" scoped>
.dark-mode-border {
  border: 1px solid #ffffff66;
}
</style>

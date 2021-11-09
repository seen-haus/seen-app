<template>
  <div v-for="secondaryMarketListing in secondaryMarketListings" :key="secondaryMarketListing.id">
    <secondary-listing-list-item :collectable="secondaryMarketListing" />
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

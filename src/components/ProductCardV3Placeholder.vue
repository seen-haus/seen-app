<template>
  <drop-card-preview
    class="clickable"
    :autoMargins="true"
    :listingType="listingType"
    :startTime="getStartsAt"
    :endTime="getEndsAt"
    :priceType="priceType"
    :price="price"
    :units="false"
    :tangibility="tangibility"
    :tags="tags"
    :titleText="title"
    :creatorAccount="creatorAccount"
    :creatorProfilePicture="creatorProfilePicture"
    :creatorUsername="creatorUsername"
    :creatorType="creatorType"
    :creatorSlug="creatorSlug"
    :mediaUrl="firstMedia"
    :updateProgress="updateProgress"
    :progress="progress"
    :items="items"
    :itemsOf="itemsOf"
    :collectableState="collectableState"
    :liveStatus="liveStatus"
    :disableMediaPlaceholder="true"
  />
</template>

<script>

import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

export default {
  name: "ProductCardV3Placeholder",
  components: {
    DropCardPreview,
  },
}
</script>

<style scoped>

</style>

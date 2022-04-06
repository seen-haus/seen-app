<template>
  <Collectable slug="secret" :overrideMedia="gallerySortedMedia" />
</template>

<script>

import Collectable from "@/views/collectable/Collectable.vue";

export default {
  name: "secret",
  components: {
    Collectable,
  },
  setup() {

    const gallerySortedMedia = Array.from(Array(100).keys(), item => { return { url: `https://seenhaus.mypinata.cloud/ipfs/QmSRYP8qtVgG7DsojrcBPpMFDkiMFQj3FyuCwW3zsnY9aq/${item + 1}_lowres.jpg`, type: 'image/png', hiRes: `https://seenhaus.mypinata.cloud/ipfs/QmV84RbvJJagKdDSaRekcBx7qS13ZH7xBVTxpZrtPJJctL/${item + 1}.jpg`} })

    return {
      gallerySortedMedia
    }
  },
};
</script>

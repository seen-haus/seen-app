<template>
  <div v-if="tagType === 'nft'" class="tag bg-tag-nft mr-1">NFT</div>
  <div v-if="tagType === 'tangible'" class="tag bg-tag-tangible mr-1">TANGIBLE</div>
</template>


<style lang="scss" scoped>
// Tags
.tag {
  @apply p-1 text-white text-xs rounded-2sm;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
}
</style>


<script>
export default {
  name: 'Tag',
  props: {
    type: String
  },
  computed: {
    tagType: function() {
      switch(this.type) {
        case 'nft': return 'nft';
        case 'tangible': return 'tangible';
        default: return 'nft';
      }
    }
  }
}
</script>
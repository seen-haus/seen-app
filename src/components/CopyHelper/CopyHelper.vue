<template>
  <span @click="handleClick">
      <span class="cursor-pointer" v-if="isCopied"> <i class="fas fa-check"></i> Copied</span>
      <span class="cursor-pointer" v-else> <i class="fas fa-copy"></i> {{ text ? text : toCopy }}</span>
  </span>
</template>

<script>
import useCopyClipboard from "@/hooks/useCopyClipboard";

export default {
  name: "CopyHelper",
  props: {
    toCopy: {
      type: String
    },
    text: {
      type: [String, null],
      default: null,
    }
  },
  setup(props) {
    const {isCopied, staticCopy} = useCopyClipboard()
    const handleClick = () => {
      staticCopy(props.toCopy)
    }
    return {
      staticCopy,
      isCopied,
      handleClick
    }
  }
}
</script>

<style scoped>

</style>

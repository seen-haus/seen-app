<template>
  <span @click="handleClick">
      <span class="cursor-pointer" v-if="isCopied"> <i class="fas fa-check" v-if="!isIconSuffix"></i> Copied <i class="fas fa-check" v-if="isIconSuffix"></i></span>
      <span class="cursor-pointer" v-else> <i class="fas fa-copy" v-if="!isIconSuffix"></i> {{ text ? text : toCopy }} <i class="fas fa-copy" v-if="isIconSuffix"></i></span>
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
    },
    isIconSuffix: {
      type: Boolean,
      default: false,
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

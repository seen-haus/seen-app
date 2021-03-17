<template>
  <div
    class="icon rounded-full relative"
    :style="{
      backgroundImage: 'url(' + url + ')',
      width: size + 'px',
      height: size + 'px',
    }"
  >
    <slot></slot>
  </div>
</template>
<script>

import IconService from "@/services/utils/icon.service.js";

export default {
  name: "Icon",
  props: {
    size: {
      type: Number,
      default: 16,
    },
    walletAddress: {
      type: String,
      default: "",
    },
  },
  computed: {
    wallet() {
      return this.walletAddress;
    },
    url() {
      let props;
      switch (this.size) {
        case 80:
          props = {
            size: 8,
            scale: 10,
          };
          break;
        case 40:
          props = {
            size: 8,
            scale: 5,
          };
          break;
        default:
          props = {
            size: 8,
            scale: 2,
          };
      }
      return IconService.create(
        {
          seed: this.wallet,
          ...props,
        },
        4
      ).toDataURL();
    },
  },
};
</script>
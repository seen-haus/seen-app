<template>
  <div class="price flex flex-col items-start">
    <div :class="extensionSize">
      <span class="font-bold mr-1.5" :class="numberSize">{{ price }}</span
      >{{ type
      }}<span v-if="numberOfBids != null" class="text-gray-400 ml-2"
        >({{ numberOfBids }} bids)</span
      >
    </div>
    <div class="text-gray-400" :class="fiatSize">$2,442.55</div>
  </div>
</template>

<script>
export default {
  name: "PriceDisplay",
  props: {
    size: {
      type: String, // xs, sm , md, lg
      default: "sm",
    },
    price: {
      type: Number,
      default: 2.06,
    },
    type: {
      type: String,
      default: "ETH",
    },
    numberOfBids: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    numberSize: function () {
      if (this.size === "xs") return "text-xl";
      if (this.size === "sm") return "text-2.5xl";
      if (this.size === "md") return "text-3xl";
      if (this.size === "lg") return "text-4xl";

      return "text-3xl";
    },
    extensionSize: function () {
      if (this.size === "xs") return "text-sm";
      if (this.size === "sm") return "text-sm";
      if (this.size === "md") return "text-base";
      if (this.size === "lg") return "text-base";

      return "text-3xl";
    },
    fiatSize: function () {
      if (this.size === "xs") return "text-xs";
      if (this.size === "sm") return "text-xs";
      if (this.size === "md") return "text-sm";
      if (this.size === "lg") return "text-sm";

      return "text-xs";
    },
  },
};
</script>
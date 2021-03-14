<template>
  <div class="price flex flex-col items-start">
    <div class="text-sm">
      <span class="font-bold mr-1.5" :class="numberSize">{{price}}</span>{{type}}
    </div>
    <div class="text-gray-400" :class="fiatSize">$2,442.55</div>
  </div>
</template>

<script>
export default {
  name: "PriceDisplay",
  props: {
    size: {
      value: String, // xs, sm , md, lg
      default: 'sm'
    },
    price: {
      value: Number,
      default: 2.06
    },
    type: {
      value: String,
      default: 'ETH'
    }
  },
  computed: {
    numberSize: function() {
      if (this.size === 'xs') return 'text-xl';
      if (this.size === 'sm') return 'text-2.5xl';
      if (this.size === 'md') return 'text-3xl';
      if (this.size === 'lg') return 'text-4xl';

      return 'text-3xl';
    },
    fiatSize: function() {
      if (this.size === 'xs') return 'text-xs';
      if (this.size === 'sm') return 'text-xs';
      if (this.size === 'md') return 'text-sm';
      if (this.size === 'lg') return 'text-sm';

      return 'text-xs';
    },
  }
};
</script>
<template>
  <div class="price flex flex-col items-start">
    <div :class="extensionSize">
      <span class="font-bold mr-1.5" :class="numberSize">{{ price }}</span
      >{{ type
      }}<span 
          v-if="numberOfBids != null"
          class="ml-2"
          :class="darkMode ? 'dark-mode-text-washed' : 'text-gray-400'"
        >
          ({{ numberOfBids }} {{ numberOfBids === 1 ? 'bid' : 'bids' }})
        </span>
    </div>
    <div :class="fiatSize">{{ formattedPrice }}</div>
  </div>
</template>

<script>
import {computed} from 'vue'
import useDarkMode from '@/hooks/useDarkMode';
import useExchangeRate from '@/hooks/useExchangeRate.js';

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
    priceUSD: {
      type: [Number, String],
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
      let textColor = this.darkMode ? 'dark-mode-text' : 'light-mode-text';

      if (this.size === "xs") return ["text-xl", textColor].join(" ");
      if (this.size === "sm") return ["text-2xl", textColor].join(" ");
      if (this.size === "md") return ["text-3xl", textColor].join(" ");
      if (this.size === "lg") return ["text-4xl", textColor].join(" ");

      return ["text-3xl", textColor].join(" ");
    },
    extensionSize: function () {
      let textColor = this.darkMode ? 'dark-mode-text' : 'light-mode-text';

      if (this.size === "xs") return ["text-sm", textColor].join(" ");
      if (this.size === "sm") return ["text-sm", textColor].join(" ");
      if (this.size === "md") return ["text-base", textColor].join(" ");
      if (this.size === "lg") return ["text-base", textColor].join(" ");

      return ["text-3xl", textColor].join(" ");
    },
    fiatSize: function () {
      let textColor = this.darkMode ? 'dark-mode-text-washed' : 'text-gray-400';

      if (this.size === "xs") return ["text-xs", textColor].join(" ");
      if (this.size === "sm") return ["text-xs", textColor].join(" ");
      if (this.size === "md") return ["text-sm", textColor].join(" ");
      if (this.size === "lg") return ["text-sm", textColor].join(" ");

      return ["text-xs", textColor].join(" ");
    },
  },
setup(props) {
    const { darkMode } = useDarkMode();

    const { formatCurrency, convertEthToUSDAndFormat } = useExchangeRate();
    const formattedPrice = computed(() => {
      return props.priceUSD ? formatCurrency(props.priceUSD) : convertEthToUSDAndFormat(props.price);
    })

    return {
      formattedPrice,
      darkMode,
    };
  }
};
</script>

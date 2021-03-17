<template>
  <div class="list-of-buyers rounded-container">
    <template v-for="(buyer, index) in list" :key="buyer.id">
      <div class="list-tile flex items-center py-6">
        <icon :size="40" :wallet-address="buyer.wallet_address" class="mr-4" />

        <div class="flex flex-col flex-grow">
          <div class="address text-gray-500 tracking-widest">
            {{ shortenAddress(buyer.wallet_address) }}
          </div>
          <div class="time text-xs text-gray-400">{{ daysAgo(buyer.updated_at) }}</div>
        </div>

        <price-display
          size="xs"
          class="items-end"
          :price="buyer.value"
          :priceUSD="buyer.value_in_usd"
        />
      </div>

      <div
        v-if="index != 4"
        class="divider h-0 border-t-2 border-gray-200"
      ></div>
    </template>

    <button class="button outline w-full mt-6" @click="onLoadMore">
      Load More
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { shortenAddress, getDaysAgo } from "@/services/utils/index";

import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import Icon from "@/components/Common/Icon.vue";

export default {
  name: "ListOfBuyers",
  components: { PriceDisplay },
  props: {
    list: Array,
    onLoadMore: Function,
  },
  setup(props) {
    console.log(props.list);

    function daysAgo(updated_at) {
      if (updated_at) {
        return getDaysAgo(updated_at);
      }

      return 'An unspecified time ago';
    }

    return {
      shortenAddress,
      Icon,
      daysAgo,
    };
  },
};
</script>
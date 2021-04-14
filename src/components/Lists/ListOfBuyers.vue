<template>
  <div class="list-of-buyers rounded-container">
    <template v-if="list.length === 0">
      <div class="text-center text-gray-400">
        No buyers yet! Be the first!
      </div>
    </template>
    <template v-else>
      <template
          v-for="(buyer, index) in reversedList.slice(0, showCount)"
          :key="buyer.id"
      >
        <div class="list-tile flex items-center py-6 cursor-pointer"
             @click="$router.push({name: 'profileWithAddress', params: {userAddress: buyer.wallet_address}})">
          <icon
              :size="40"
              :wallet-address="buyer.wallet_address"
              class="mr-4 hidden sm:block"
          />

          <div class="flex flex-col flex-grow">
            <div class="address text-gray-500 tracking-widest">
              {{ shortenAddress(buyer.wallet_address) }}
            </div>
            <div class="time text-xs text-gray-400">
              {{ daysAgo(buyer.updated_at) }}
            </div>
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

      <button class="button outline w-full mt-6" @click="onLoadMore" v-if="showButton">
        Load More
      </button>
    </template>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import {shortenAddress, getDaysAgo} from "@/services/utils/index";

import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import Icon from "@/components/Common/Icon.vue";

export default {
  name: "ListOfBuyers",
  components: {PriceDisplay, Icon},
  props: {
    list: Array,
  },
  setup(props) {
    const reversedList = computed(() => [...props.list].reverse());
    const showCount = ref(3);
    const showButton = computed(() => showCount.value < props.list.length);

    function daysAgo(updated_at) {
      if (updated_at) {
        return getDaysAgo(updated_at);
      }

      return "An unspecified time ago";
    }

    function onLoadMore() {
      showCount.value = showCount.value + 3;
    }

    return {
      shortenAddress,
      daysAgo,
      onLoadMore,
      showCount,
      showButton,
      reversedList,
    };
  },
};
</script>

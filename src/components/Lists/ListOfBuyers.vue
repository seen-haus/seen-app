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
          <icon v-if="!buyer.image"
              :size="40"
              :wallet-address="buyer.wallet_address"
              class="mr-4 hidden sm:block"
          />

          <div class="profile-avatar buyer-profile-photo mr-2" :style="{ backgroundImage: `url(${buyer?.image})` }"></div>

          <div class="flex flex-col flex-grow">
            <div class="address text-gray-500 tracking-widest">
              {{ buyer.username ? buyer.username : shortenAddress(buyer.wallet_address) }}
            </div>
            <div class="time text-xs text-gray-400">
              {{ format(buyer.created_at) }}
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
import {computed, ref, toRefs, watch} from "vue";
import { UserService } from "@/services/apiService"
import {shortenAddress, getDaysAgo} from "@/services/utils/index";
import {format} from 'timeago.js';
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import Icon from "@/components/Common/Icon.vue";

export default {
  name: "ListOfBuyers",
  components: {PriceDisplay, Icon},
  props: {
    list: Array,
  },
  setup(props) {
    const {list: inputList} = toRefs(props);
    const extendedUserData = ref({});
    const reversedList = computed(() => [...props.list]
      .reverse()
      .map(v => {
        const ud = extendedUserData.value[v.wallet_address.toLowerCase()];
        return {...v, username: ud && ud.username, image: ud && ud.image}
      })
    );
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

    function getExtendedUserData(newList) {
      if (!newList && newList.length === 0) return;

      const payload = {
        walletAddresses: newList.map(v => v.wallet_address)
      };

      UserService.getExtendedUserData(payload).then(res => {
        extendedUserData.value = res.data.reduce((p, v) => {
          p[v.walletAddress.toLowerCase()] = {username: v.username, image: v.image};
          return p;
        }, {});
      }).catch(e => {
        console.error(e);
      });
    }

    watch(inputList, getExtendedUserData);
    getExtendedUserData(props.list);

    return {
      shortenAddress,
      daysAgo,
      onLoadMore,
      showCount,
      showButton,
      reversedList,
      format,
    };
  },
};
</script>

<style scoped lang="scss">
  .buyer-profile-photo {
    width: 40px;
    height: 40px;
    border-radius: 2rem;
  }
</style>
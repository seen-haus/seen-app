<template>
  <div class="profile">
    <container class="relative">
      <div class="avatar">
        <div class="bg-background-gray rounded-full w-full h-full flex justify-center items-center">
          <img src="@/assets/icons/avatar.svg" class="h-16 cursor-pointer" alt="SEEN">
        </div>
      </div>
      <div class="mt-4 mb-12 flex justify-start flex-wrap">
        <p class="font-bold text-3xl mr-4">John Smith</p>
        <div class="wallet-address-badge flex justify-between items-center">
          <i class="fas fa-volleyball-ball text-lg mr-2"></i>
          <p class="flex flex-grow text-lg">{{cropWithExtension('0xc22eeC83Bc0e9e36cca76ac32feb2a828Ff609CF3A', 18)}}</p>
          <i class="far fa-copy text-grey-9 cursor-pointer"></i>
        </div>
      </div>
      <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Your collection</fenced-title
      >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
        <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card />
        <product-card />
      </div>
    </container>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import ProductCard from "@/components/ProductCard.vue";

export default {
  name: "Profile",
  components: { FencedTitle, Container, ProductCard },
  methods: {
    cropWithExtension: function(text, maxCharacters) {
      const txtLength = text.length; // Length of the incoming text
      const txtLengthHalf = maxCharacters ? Math.round(maxCharacters / 2) : Math.round(txtLength / 2); // set max txtHalfLength
      return text.substring(0, (txtLengthHalf -1)).trim() + '...' + text.substring((txtLength - txtLengthHalf) + 2, txtLength).trim(); //Return the string
    },
  }
}
</script>

<style scoped lang="scss">
.avatar {
  @apply w-30 h-30 p-1 rounded-full -mt-15 bg-white inline-flex justify-center items-center;
  border: solid 1px #e6e6e6;
}
.wallet-address-badge {
  @apply pr-3.5 py-1 pl-2 rounded-3xl w-66 font-address;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.15);
}
</style>

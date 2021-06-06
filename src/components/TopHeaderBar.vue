<template>
  <div class="py-2.5 bg-black text-white">
    <container>
      <div class="flex justify-center md:justify-between flex-wrap">
        <div class="flex align-center py-1">
          <a
            href="https://app.sushi.com/swap?outputCurrency=0xca3fe04c7ee111f0bbb02c328c699226acf9fd33"
            target="_blank"
            class="btn-exchange"
          >
            <img
              src="@/assets/icons/icon--seen-green.svg"
              class="cursor-pointer mr-2"
              alt="SEEN"
            />
            <span class="hidden md:block mr-1">Seen: </span>
            <p v-if="!seen"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{ formatCurrency(seen) }}</p>
          </a>
          <a
            class="btn-exchange"
          >
            <img
              src="@/assets/icons/icon--ethereum.svg"
              class="cursor-pointer mr-2"
              alt="SEEN"
            />
            <span class="hidden md:block mr-1">Ethereum: </span>
            <p v-if="!ethereum"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{ formatCurrency(ethereum) }}</p>
          </a>
          <a
            class="btn-exchange"
          >
            <img
              src="@/assets/icons/icon--bitcoin.svg"
              class="cursor-pointer mr-2"
              alt="SEEN"
            />
            <span class="hidden md:block mr-1">Bitcoin: </span>
            <p v-if="!bitcoin"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{ formatCurrency(bitcoin) }}</p>
          </a>
        </div>

        <div class="flex align-center py-1">
          <a href="https://discord.com/invite/dad8J4f" target="_blank" class="btn-social">
              <i class="fab fa-discord mr-2 text-lg"></i>
          </a>

          <a href="https://t.me/seenhaus" target="_blank" class="btn-social">
              <i class="fab fa-telegram mr-2 text-lg"></i>
          </a>

          <a href="https://open.spotify.com/show/4b9DLCFMYKy1LTESYshCPZ" target="_blank" class="btn-social">
              <i class="fab fa-spotify mr-2 text-lg"></i>
          </a>
          <a href="https://seen-haus.medium.com/" target="_blank" class="btn-social">
              <i class="fab fa-medium mr-2 text-lg"></i>
          </a>
          <a href="https://twitter.com/seen_haus" target="_blank" class="btn-social">
              <i class="fab fa-twitter mr-2 text-lg"></i>
          </a>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container";
import useExchangeRate from "@/hooks/useExchangeRate.js";

export default {
  name: "TopHeaderBar",
  components: { Container },
  setup() {
    const { formatCurrency, seen, ethereum, bitcoin } = useExchangeRate();
    return { formatCurrency, seen, ethereum, bitcoin };
  },
};
</script>

<style scoped lang="scss">
.btn-exchange {
  @apply mr-8 text-sm inline-flex text-topbar items-center;
  &:last-child {
    @apply mr-0;
  }
}
.btn-social {
  @apply mr-5 text-sm inline-flex text-topbar items-center;
  &:last-child {
    @apply mr-0;
  }
}
.fab {
  color: #fff;
  opacity: 60%;
  transition-duration: 0.2s;
}
.fab:hover {
  color: #34ca98;
  opacity: 100%;
}
</style>

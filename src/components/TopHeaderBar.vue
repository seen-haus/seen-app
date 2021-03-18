<template>
  <div class="py-2.5 bg-black text-white">
    <container>
      <div class="flex justify-between flex-wrap">
         <div class="flex align-center py-1">
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Seen: </span>
            <p v-if="!seen"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{formatCurrency(seen)}}</p>
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--ethereum.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Ethereum: </span>
            <p v-if="!ethereum"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{formatCurrency(ethereum)}}</p>
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--bitcoin.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Bitcoin: </span>
            <p v-if="!bitcoin"><i class="fas fa-spinner fa-spin"></i></p>
            <p v-else>{{formatCurrency(bitcoin)}}</p>
          </a>
        </div>

        <div class="flex align-center py-1">
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <i class="fas fa-question-circle mr-2 text-lg"></i>
            Help
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <i class="fas fa-palette mr-2 text-lg"></i>
            Spotlight
          </a>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container";
import useExchangeRate from '@/hooks/useExchangeRate.js'

export default {
  name: 'TopHeaderBar',
  components: {Container},
  setup() {
    const { formatCurrency, seen, ethereum, bitcoin } = useExchangeRate();
    return { formatCurrency, seen, ethereum, bitcoin };
  }
}
</script>

<style scoped lang="scss">
  .btn-exchange {
    @apply mr-8 text-sm inline-flex text-topbar items-center;
    &:last-child {
      @apply mr-0;
    }
  }
</style>

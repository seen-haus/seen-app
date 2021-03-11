<template>
  <div class="py-3.5 bg-black text-white">
    <container>
      <div class="flex justify-between">
         <div class="flex align-center">
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Seen: </span> $403
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--ethereum.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Ethereum: </span> $1,403.54
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--bitcoin.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Bitcoin: </span> $51,403.54
          </a>
        </div>

        <div class="flex align-center">
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Seen: </span> $403
          </a>
          <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
            target="_blank"
            class="btn-exchange">
            <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="SEEN">
            <span class="hidden md:block mr-1">Seen: </span> $403
          </a>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container";

export default {
  name: 'TopHeaderBar',
  components: {Container},
}
</script>

<style scoped lang="scss">
  .btn-exchange {
    @apply block mr-8 md:mr-8 flex text-sm inline-flex items-center;
  }
</style>

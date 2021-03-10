<template>
  <div class="py-2 bg-black text-white">
    <container>
      <a href="https://app.sushi.com/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
         target="_blank"
         class="block mr-8 md:mr-20 flex text-sm ">
        <img src="@/assets/icons/icon--seen-green.svg" class="cursor-pointer mr-2" alt="SEEN">
        <span class="hidden md:block mr-1">Seen: </span> $403
      </a>
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

<style scoped>

</style>

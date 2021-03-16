<template>
  <nav>
    <router-link :to="{ name: 'spaaaaace'}" v-slot="{isActive}" class="routing-link mr-12">
      <img :src="'./assets/icons/icon--spacenft' + (isActive ? '-green' : '') + '.svg'" class="cursor-pointer mr-1 inline-flex" alt="SEEN"><span class="opacity-50 font-bold py-0.5 hover:text-black" :class="{'active': isActive}">Space NFT</span>
    </router-link>
    <router-link :to="{ name: 'auctions'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:text-black" :class="{'active': isActive}">Auctions</span>
    </router-link>
    <router-link :to="{ name: 'editions'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:text-black" :class="{'active': isActive}">Editions</span>
    </router-link>
    <router-link :to="{ name: 'artists'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:text-black" :class="{'active': isActive}">Artists</span>
    </router-link>
    <router-link :to="{ name: 'leaderboard'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:text-black" :class="{'active': isActive}">Leaderboard</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "DesktopMenu"
}
</script>

<style scoped lang="scss">

</style>
 

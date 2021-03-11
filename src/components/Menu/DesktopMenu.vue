<template>
  <nav>
    <router-link :to="{ name: 'auctions'}" v-slot="{isActive}" class="mr-12">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Auctions</span>
    </router-link>
    <router-link :to="{ name: 'editions'}" v-slot="{isActive}" class="mr-12">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Editions</span>
    </router-link>
    <router-link :to="{ name: 'artists'}" v-slot="{isActive}" class="mr-12">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Artists</span>
    </router-link>
    <router-link :to="{ name: 'leaderboard'}" v-slot="{isActive}" class="mr-12">
      <span class="opacity-50 font-bold py-0.5" :class="{'active': isActive}">Leaderboard</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "DesktopMenu"
}
</script>

<style scoped lang="scss">
  .active {
    @apply opacity-100 border-b-2;
    border-color: #34ca98;
  }
</style>

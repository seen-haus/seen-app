<template>
  <nav>
    <router-link :to="{ name: 'auctions'}">
      Auctions
    </router-link>
    <router-link :to="{ name: 'editions'}">
      Editions
    </router-link>
    <router-link :to="{ name: 'artists'}">
      Artists
    </router-link>
    <router-link :to="{ name: 'leaderboard'}">
      Leaderboard
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "DesktopMenu"
}
</script>

<style scoped>

</style>

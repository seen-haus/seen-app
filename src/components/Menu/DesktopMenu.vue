<template>
  <nav>
    <!-- <router-link :to="{ name: 'spaaaaace'}" v-slot="{isActive}" class="routing-link mr-12">
      <img src="@/assets/icons/icon--spacenft.svg" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-1 inline-flex" alt="SEEN">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Space NFT</span>
    </router-link> -->
    <router-link :to="{ name: 'drops'}" v-slot="{isActive}" class="routing-link mr-12">
      <img src="@/assets/icons/icon-fire.svg" :class="isActive ? 'active-green-icon' : ''" class="cursor-pointer mr-2 inline-flex icon-fire" alt="SEEN">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Drops</span>
    </router-link>
    <router-link :to="{ name: 'artists'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Artists</span>
    </router-link>
    <router-link :to="{ name: 'collectors'}" v-slot="{isActive}" class="routing-link mr-12">
      <span class="opacity-50 font-bold py-0.5 hover:opacity-100" :class="{'active': isActive}">Collectors</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "DesktopMenu"
}
</script>

<style scoped lang="scss">
  .routing-link:hover {
    img {
      filter: brightness(0) saturate(100%);
    }
  }

  .icon-fire {
    height: 22px;
    filter: brightness(0) saturate(100%) opacity(0.4);
  }
</style>
 

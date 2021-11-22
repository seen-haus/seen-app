<template>
  <div class="icon-square rounded-xl flex-center">
    <img :style="{'width': '45px'}" :src="require(`../assets/icons/${icon}`)"/>
  </div>
</template>

<script>
export default {
  name: "IconSquare",
  props: {
    icon: String, // file name of icon, must be in the src/assets/icons folder
  },
};
</script>


<style lang="scss" scoped>
  .icon-square {
   background-color: black;
   width: 75px;
   height: 75px;
  }
</style>

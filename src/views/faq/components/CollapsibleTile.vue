<template>
  <div
    class="collapsible-tile max-w-2xl border rounded-lg bg-background-gray" @click="toggleCollapse"
  >
    <div class="title flex align-center p-6 cursor-pointer">
      <div class="text-2xl font-title font-bold flex-1">What is seen.haus?</div>
      <i class="fas text-2xl ml-2" :class="[this.collapsed ? 'fa-angle-down' : 'fa-angle-up']"></i>
    </div>
    <div class="body text-gray-600 p-6 pt-0" v-if="!collapsed" @click.stop>
      seen.haus is an innovative auction house of the future that’s merging the
      physical and digital worlds of art.<br><br> Each physical collectible sold through
      our platform is paired with a digital version that provides an exclusive
      record of ownership.<br><br> Please watch this video here for more clarity.
    </div>
  </div>
</template>


<script>
export default {
  name: "CollapsibleTile",
  data() {
    return {
      collapsed: true,
    };
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>
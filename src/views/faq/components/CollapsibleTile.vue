<template>
  <div
    class="collapsible-tile max-w-2xl border rounded-lg bg-background-gray" @click="toggleCollapse"
  >
    <div class="title flex align-center p-6 cursor-pointer">
      <div class="text-lg font-title font-bold flex-1">{{title}}</div>
      <i class="fas text-lg ml-2" :class="[this.collapsed ? 'fa-angle-down' : 'fa-angle-up']"></i>
    </div>
    <div class="line p-6 pt-0" v-if="!collapsed" @click.stop>
      <slot></slot>
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
  props: {
    title: String,
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style lang="scss">

.line {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}
</style>
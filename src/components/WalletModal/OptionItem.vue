<template>
  <div class="p-4 flex items-center justify-between border hover:border-red mb-4 cursor-pointer">
    <div class="flex items-center">
      <div class="text-left">
        <div class="font-medium flex items-center"><span class="is-connected rounded-full mr-2 block" v-if="active"></span>{{ header }}</div>
        <div class="text-sm" v-if="subheader">
          {{ subheader }}
        </div>
      </div>
    </div>
    <img :src="icon" alt="Icon" class="mr-4 w-8 h-auto"/>
  </div>
</template>
<script>


export default {
  name: "OptionItem",
  props: {
    header: {type: String, nullable: true},
    icon: {type: String, nullable: true},
    link: {type: [String, null], nullable: true},
    active: {type: [Boolean, null], nullable: true},
    subheader: {type: [String, null], nullable: true},
  },
  created() {
    console.log("CREATED", this.header)
  }
}
</script>

<style scoped>
.is-connected {
  width: 6px;
  height: 6px;
  background-color: green;
}
</style>

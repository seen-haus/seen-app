<template>
    <span class="title-text font-title text-4xl font-bold">Highlights</span>
    <ul>
      <li v-for="item in highlights" :key="item"><i :class="item.icon ? item.icon : 'fas fa-circle'"></i>{{item.text}}</li>
    </ul>
</template>

<script>
    export default {
        name: "Highlights",
        props: {
            highlights: Object
        }
    }
</script>

<style scoped>
ul {
  columns: 2;
  -webkit-columns: 2;
  -moz-columns: 2;
}
i {
    padding: 10px;
}
</style>
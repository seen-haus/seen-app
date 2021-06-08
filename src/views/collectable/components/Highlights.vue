<template>
    <span class="title-text font-title text-4xl font-bold">Highlights</span>
    <ul>
      <li v-for="item in highlights" :key="item"><i :class="item.icon ? item.icon : 'fas fa-circle'"></i><span v-html="item.text"></span></li>
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
  margin: 30px 0 0;

}
i {
    padding: 10px;
}

li {
  display: block;
  clear: both;
  border-bottom: 1px dotted #ccc;
  padding: 0 0 15px;
  margin: 0 0 15px;
}

.fa-circle {
  float: left;
  font-size: 5px;
}
</style>
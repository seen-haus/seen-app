<template>
    <div class="rounded-lg">
        <span class="title-text font-title text-4xl font-bold flex items-center justify-center">Partners & Press</span>
        <div class="h-48 flex flex-wrap content-start flex items-center justify-center">
            <a v-for="item in partners" :key="item" :href="item.url">
                <img :src="item.image" class="h-16 mx-auto"/>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PartnersAndPress",
        props: {
            partners: Object
        }
    }
</script>

<style scoped>

</style>
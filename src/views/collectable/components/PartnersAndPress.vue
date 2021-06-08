<template>
    <div class="rounded-lg">
        <span class="title-text font-title text-4xl font-bold flex items-center justify-center">Partners & Press</span>
        <div class="content-start flex items-center justify-center overlay py-4">
            <a v-for="item in partners" :key="item" :href="item.url" target="_blank" class="p-4">
                <img :src="item.image" class=" h-6"/>
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
.overlay {
    filter: grayscale(100%);
    opacity: .3;
}
</style>
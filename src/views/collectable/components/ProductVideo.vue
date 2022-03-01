<template>
    <div class="video-container overflow-hidden justify-center">
              <div class="relative mx-auto max-w-full lg:max-w-screen-md">
                <media-loader
                  :src=src
                  aspectRatio="56.25%"
                  controls
                  class="overflow-hidden rounded-20px"
                />
              </div>
            </div>
</template>

<script>
    import MediaLoader from "@/components/Media/MediaLoader.vue";

    export default {
        name: "ProductVideo",
        components: {
            MediaLoader
        },
        props: {
            src: String
        }
    }
</script>

<style scoped>

</style>
<template>
  <div class="video-container overflow-hidden justify-center">
    <div class="relative mx-auto max-w-full lg:max-w-screen-md">
      <media-loader
        src="https://www.youtube.com/embed/1G5caDyf-kA?controls=0&modestbranding"
        aspectRatio="56.25%"
        controls
        class="overflow-hidden rounded-3xl"
      />
    </div>
  </div>
</template>


<script>
import MediaLoader from "@/components/Media/MediaLoader.vue";

export default {
  name: "HowToVideo",
  components: {
    MediaLoader,
  },
};
</script>

<style lang="scss" scoped>
.video-overlay {
  cursor: pointer;

  &:hover .play-button {
    transform: scale(1.2);
  }
}
</style>
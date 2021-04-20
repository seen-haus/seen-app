<template>
  <div class="video-container overflow-hidden justify-center">
    <div class="relative mx-auto max-w-full lg:max-w-screen-md">
      <media-loader
        :src="url"
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
  name: "InstructionalVideo",
  computed: {
    url() {
      return window.location.protocol + "//www.youtube.com/embed/1G5caDyf-kA?controls=0&modestbranding&origin=" + window.location.origin
    }
  },
  components: {
    MediaLoader,
  },
};
</script>

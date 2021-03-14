<template>
  <div
    class="video-loader overflow-hidden rounded-lg h-full w-full"
    :style="{
      'padding-bottom': aspectRatio,
    }"
  >
    <iframe
      ref="iframe"
      :src="url + '?controls=0&modestbranding'"
      frameborder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
      allowfullscreen
    ></iframe>

    <div class="overlay flex items-center justify-center">
      <div
        class="play-button w-22 h-22 rounded-full bg-primary flex items-center justify-center"
      >
        <i class="fas fa-play text-2xl text-white ml-1 scale"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoLoader",
  props: {
    url: {
      type: String,
      default: "https://www.youtube.com/embed/I6BcTbTDWHc",
    },
    aspectRatio: {
      type: String,
      default: "56.25%" /* 16:9 */, // padding-bottom: calc(var(--aspect-ratio, .5625) * 100%);
    },
  },
};
</script>


<style lang="scss">
.video-loader {
  position: relative;
  height: 0;

  iframe, .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .overlay {
    cursor: pointer;

    &:hover .play-button {
      transform: scale(1.2);
    }
  }
}
</style>




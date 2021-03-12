<template>
  <div class="video-container overflow-hidden rounded-lg relative flex justify-center">
    <div class="relative">
      <iframe
        width="750"
        height="420"
        src="https://www.youtube.com/embed/wLlovxa3VJ0?controls=0&modestbranding"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowfullscreen
        controls="0"
        class="max-w-full lg:max-w-screen-md overflow-hidden rounded-3xl"
      ></iframe>

      <div
        class="video-overlay absolute w-full h-full flex items-center justify-center top-0 left-0"
      >
        <div
          class="play-button w-22 h-22 rounded-full bg-primary flex items-center justify-center"
        >
          <i class="fas fa-play text-2xl text-white ml-1 scale"></i>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "HowToVideo",
};
</script>

<style lang="scss" scoped>
.video-overlay {
  cursor: pointer;

  &:hover .play-button{
    transform: scale(1.2);
  }
}
</style>

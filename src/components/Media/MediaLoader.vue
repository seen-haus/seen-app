<template>
  <div
    class="media-loader relative h-0"
    :style="{
      'padding-bottom': aspectRatio,
    }"
  >
    <template v-if="mediaType === 'youtube'">
      <iframe
        ref="videoRef"
        :src="
          src +
          '?controls=' +
          (controls ? '1' : '0') +
          '&autoplay=' +
          (autoplay ? '1' : '0') +
          '&modestbranding&enablejsapi=1'
        "
        frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope;"
        allowfullscreen
        class="video-player"
      ></iframe>

      <div
        class="video-overlay flex items-center justify-center"
        @click="togglePlay()"
      >
        <play-button v-if="controls && isPaused" />
      </div>
    </template>

    <template v-if="mediaType === 'video'">
      <video
        ref="videoRef"
        :src="src"
        :autoplay="autoplay"
        :muted="muted"
        :loop="loop"
      ></video>

      <div
        class="video-overlay flex items-center justify-center"
        @click="togglePlay()"
      >
        <play-button v-if="controls && isPaused" />
      </div>
    </template>

    <template v-if="mediaType === 'image'">
      <img class="image absolute w-full h-full" :src="src" alt="" />
    </template>
  </div>
</template>


<script>
import { computed, reactive, ref } from "vue";

import PlayButton from "./components/PlayButton.vue";

export default {
  name: "MediaLoader",
  props: {
    src: {
      type: String,
      default: "https://www.youtube.com/embed/I6BcTbTDWHc",
    },
    aspectRatio: {
      type: String,
      default: "56.25%" /* 16:9 */, // padding-bottom: calc(var(--aspect-ratio, .5625) * 100%);
    },
    controls: {
      type: Boolean,
      default: false,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  components: { PlayButton },
  setup(props) {
    const videoRef = ref(null);
    const state = reactive({
      paused: !props.autoplay,
    });

    const isPaused = computed(() => state.paused);
    const mediaType = computed(() => {
      if (props.src.includes("youtube.com")) return "youtube";
      if (props.src.includes(".mp4")) return "video";
      return "image";
    });

    function togglePlay() {
      if (mediaType.value === "image") return;
      if (!props.controls) return;

      if (state.paused) playVideo();
      else pauseVideo();

      state.paused = !state.paused;
    }

    function playVideo() {
      if (mediaType.value === "image") return;
      if (mediaType.value === "youtube") {
        videoRef.value.contentWindow.postMessage(
          '{"event":"command","func":"' + "playVideo" + '","args":""}',
          "*"
        );
      } else {
        videoRef.value.play();
      }
    }
    function pauseVideo() {
      if (mediaType.value === "image") return;
      if (mediaType.value === "youtube") {
        videoRef.value.contentWindow.postMessage(
          '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
          "*"
        );
      } else {
        videoRef.value.pause();
      }
    }

    return {
      videoRef,
      mediaType,
      isPaused,
      togglePlay,
      playVideo,
      pauseVideo,
    };
  },
};
</script>


<style lang="scss">
.media-loader {
  .video-player,
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-overlay {
    cursor: pointer;

    &:hover .play-button {
      transform: scale(1.2);
    }
  }
}
</style>
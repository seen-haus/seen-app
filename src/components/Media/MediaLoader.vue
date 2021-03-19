<template>
  <div
    class="media-loader relative h-0"
    :style="{
      'padding-bottom': aspectRatio,
    }"
  >
    <div
      class="absolute w-full h-full flex items-center justify-center bg-gray-100"
      :class="'loading-indicator ' + (isLoading ? 'is-loading' : '')"
    >
      <i class="fas fa-spinner fa-spin text-gray-400 text-3xl"></i>
    </div>

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
      <img
        ref="imageRef"
        class="image absolute w-full h-full"
        :src="src"
        alt=""
      />
    </template>
  </div>
</template>


<script>
import { computed, onMounted, reactive, ref, toRefs, watchEffect } from "vue";

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
    const { autoplay } = toRefs(props);
    const videoRef = ref(null);
    const imageRef = ref(null);

    const state = reactive({
      paused: !props.autoplay,
    });
    const isLoading = ref(true);

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
    watchEffect(() => {
      if (!videoRef.value) return;
      autoplay.value ? playVideo() : pauseVideo();
    });

    function onLoadedCallback() {
      if (mediaType.value === "video") {
        //Video should now be loaded but we can add a second check
        if (videoRef.value.readyState >= 3) {
          isLoading.value = false;
          videoRef.value.removeEventListener("loadeddata", onLoadedCallback);
        }
      }

      if (mediaType.value === "youtube") {
        // Need plugin
      }

      if (mediaType.value === "image") {
        isLoading.value = false;
        imageRef.value.removeEventListener("load", onLoadedCallback);
      }
    }

    onMounted(() => {
      if (mediaType.value === "video") {
        videoRef.value.addEventListener("loadeddata", onLoadedCallback);
      }
      if (mediaType.value === "youtube") {
        // Need plugin
        isLoading.value = false;
      }
      if (mediaType.value === "image") {
        imageRef.value.addEventListener("load", onLoadedCallback);
      }
    });

    return {
      videoRef,
      imageRef,
      isLoading,
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
  .loading-indicator {
    opacity: 0;
    visibility: 0;

    transition: all 250ms linear;

    &.is-loading {
      opacity: 1;
      visibility: 1;
    }
  }

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

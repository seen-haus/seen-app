<template>
  <div
    class="media-loader relative h-0"
    :style="{
      'padding-bottom': calculatedAspecRatio,
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
        v-if="isPaused"
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
        playsinline="playsinline"
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
        class="image absolute mx-auto h-full"
        :src="src"
        alt=""
      />
    </template>
  </div>
</template>


<script>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from "vue";

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
    let observer = null;
    const { autoplay } = toRefs(props);
    const videoRef = ref(null);
    const imageRef = ref(null);
    const overrideMediaType = ref(null);
    const calculatedAspecRatio = ref(props.aspectRatio);

    const state = reactive({
      paused: !props.autoplay,
    });
    const isLoading = ref(true);

    const isPaused = computed(() => state.paused);
    const mediaType = computed(() => {
      if (overrideMediaType.value) {
        return overrideMediaType.value;
      }
      if (props.src.includes("ipfs")) {
        setOverrideMediaType()
        return "video"
      }
      if (props.src.includes("blob:http://")) {
        setOverrideMediaType()
        return "video"
      }
      if (props.src.includes("youtube.com")) return "youtube";
      if (props.src.includes(".mp4")) return "video";
      return "image";
    });

    function togglePlay() {
      if (mediaType.value === "image") return;
      if (!props.controls) return;

      if (state.paused)  {
        playVideo();
      } else {
        pauseVideo();
      }
      // state.paused = !state.paused;
    }

    async function setOverrideMediaType() {
      const axios = require('axios');
        axios.get(props.src)
          .then(function (response) {
            if (response.headers['content-type'].includes('video')){
              overrideMediaType.value = "video"
            }
            else if (response.headers['content-type'].includes('image')) {
              overrideMediaType.value = "image"
            }
            else {
              console.log('Unknown Media Type');
              overrideMediaType.value = null;
            }
          })
          .catch(function (error) {
            console.log(error);
            overrideMediaType.value = null
          })
    }

    async function playVideo()  {
      if (mediaType.value === "image") return;
      if (mediaType.value === "youtube") {
        videoRef.value.contentWindow.postMessage(
          '{"event":"command","func":"' + "playVideo" + '","args":""}',
          "*"
        );
      } else {
        try {
          await videoRef.value.play();
        } catch (e) {
          // oops
        }
      }

      state.paused = false;
    }
    async function pauseVideo() {
      if (mediaType.value === "image") return;
      if (mediaType.value === "youtube") {
        videoRef.value.contentWindow.postMessage(
          '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
          "*"
        );
      } else {
        try {
          await videoRef.value.pause();
        } catch (e) {
          // oops
        }
      }

      state.paused = true;
    }
    watchEffect(() => {
      if (!videoRef.value) return;
      autoplay.value ? playVideo() : pauseVideo();
    });

    function onLoadedCallback() {
      if (mediaType.value === "video") {
        if (!videoRef.value) return;
        //Video should now be loaded but we can add a second check
        if (videoRef.value.readyState >= 3) {
          isLoading.value = false;
          videoRef.value.removeEventListener("loadeddata", onLoadedCallback);
          calculatedAspecRatio.value =
            (videoRef.value.videoHeight / videoRef.value.videoWidth) * 100 +
            "%";
        }
      }

      if (mediaType.value === "youtube") {
        // Need plugin
      }

      if (mediaType.value === "image") {
        isLoading.value = false;
        if (!imageRef.value) return;
        imageRef.value.removeEventListener("load", onLoadedCallback);
        calculatedAspecRatio.value =
          (imageRef.value.naturalHeight / imageRef.value.naturalWidth) * 100 +
          "%";
      }
    }

    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (state.paused && autoplay.value) {
            playVideo();
          }
        } else {
          if (!state.paused && autoplay.value) {
            pauseVideo();
          }
        }
      });
    }

    function createObserver() {
      if (window["IntersectionObserver"]) {
        if (mediaType.value === "video") {
          const options = {
            root: null,
            threshold: "0",
          };

          observer = new IntersectionObserver(handleIntersect, options);
          observer.observe(videoRef.value);
        }
      }
    }

    onMounted(() => {
      if (mediaType.value === "video") {
        videoRef.value.addEventListener("canplaythrough", onLoadedCallback);
        createObserver();
      }
      if (mediaType.value === "youtube") {
        // Need plugin
        isLoading.value = false;
      }
      if (mediaType.value === "image") {
        imageRef.value.addEventListener("load", onLoadedCallback);
      }
    });

    onBeforeUnmount(() => {
      if (observer != null) {
        if(videoRef.value) {
          observer.unobserve(videoRef.value);
        }
        observer = null;
      }
    });

    return {
      videoRef,
      imageRef,
      calculatedAspecRatio,
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

.image {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  text-align: center;
}
</style>

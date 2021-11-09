<template>
  <div
    class="media-loader relative"
    :class="!maxWidthAndHeight && 'h-0'"
    :style="{
      'padding-bottom': ignoreAspectRatioPadding ? '0px' : calculatedAspecRatio,
    }"
  >
    <div
      class="absolute w-full h-full flex items-center justify-center"
      :class="
        [ 
          'loading-indicator',
          (isLoading ? 'is-loading' : ''),
          (darkMode && !transparentBg && 'dark-mode-surface'),
          (!darkMode && !transparentBg && 'bg-gray-100'),
        ].join(' ')
      "
    >
      <i v-if="isLoading" class="fas fa-spinner fa-spin text-gray-400 text-3xl"></i>
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
      <div class="absolute-full-width-and-height">
        <video
          ref="videoRef"
          :src="src"
          :autoplay="autoplay"
          :muted="muted"
          playsinline="playsinline"
          :loop="loop"
          class="auto-horizontal-margins"
          :style="`max-height: 100%;`"
        ></video>

        <div
          class="video-overlay flex items-center justify-center"
          ref="videoOverlay"
          @click="togglePlay()"
        >
          <play-button v-if="controls && isPaused" />
        </div>
      </div>
    </template>

    <template v-if="mediaType === 'image'">
      <div class="absolute-full-width-and-height overflow-hidden">
        <img
          ref="imageRef"
          class="image absolute mx-auto h-full self-align-absolute-item max-width-none"
          :src="src"
          alt=""
          :style="`max-height: 100%;`"
        />
      </div>
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
import useDarkMode from '@/hooks/useDarkMode';

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
    maxWidthAndHeight: {
      type: Boolean,
      default: false,
    },
    ignoreAspectRatioPadding: {
      type: Boolean,
      default: false,
    },
    declaredMediaType: {
      type: [String, Boolean, null],
      default: false,
    },
    transparentBg: {
      type: [Boolean],
      default: false,
    }
  },
  components: { PlayButton },
  setup(props) {
    const { darkMode } = useDarkMode();    

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
      if(props.declaredMediaType) {
        return props.declaredMediaType;
      }
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
      console.log({mediaType: mediaType.value})
      isLoading.value = false;
      console.log({isLoading})
      if (mediaType.value === "video") {
        if (!videoRef.value) return;
        //Video should now be loaded but we can add a second check
        if (videoRef.value.readyState >= 3) {
          videoRef.value.removeEventListener("loadeddata", onLoadedCallback);
          // P.S. I did not create this aspect ratio logic
          // just added a max of 100% because it breaks when it goes above that
          // Haven't had a chance to work out why this is being done in the first place
          let useAspectRatio = 100;
          if(((videoRef.value.videoHeight / videoRef.value.videoWidth) * 100) <= 100) {
            useAspectRatio = (videoRef.value.videoHeight / videoRef.value.videoWidth) * 100;
          }
          calculatedAspecRatio.value = `${useAspectRatio}%`;
        }
      }

      if (mediaType.value === "youtube") {
        // Need plugin
      }

      if (mediaType.value === "image") {
        if (!imageRef.value) return;
        imageRef.value.removeEventListener("load", onLoadedCallback);
        // P.S. I did not create this aspect ratio logic
        // just added a max of 100% because it breaks when it goes above that
        // Haven't had a chance to work out why this is being done in the first place
        let useAspectRatio = 100;
        if(((imageRef.value.naturalHeight / imageRef.value.naturalWidth) * 100) <= 100) {
          useAspectRatio = (imageRef.value.naturalHeight / imageRef.value.naturalWidth) * 100;
        }
        calculatedAspecRatio.value = `${useAspectRatio}%`;
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
      console.log({mediaType: mediaType.value})
      if (mediaType.value === "video") {
        videoRef.value.addEventListener("canplay", onLoadedCallback);
        createObserver();
      }
      if (mediaType.value === "youtube") {
        // Need plugin
        isLoading.value = false;
      }
      if (mediaType.value === "image") {
        console.log({imageRef})
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
      darkMode,
    };
  },
};
</script>


<style lang="scss">
.media-loader {
  width: 100%;
  height: 100%;

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

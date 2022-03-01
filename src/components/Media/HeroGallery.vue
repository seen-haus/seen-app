<template>
  <div class="overflow-auto"
    :style="{
      ...(backgroundColor && {'background-color': backgroundColor}),
    }"
  >
    <div class="gallery relative text-white flex justify-center items-center mb-8"
      :style="{
        'margin-top': marginTop ? marginTop : '2rem',
        'margin-bottom': marginBottom ? marginBottom : '4rem',
      }"
      :class="mediaResources.length === 1 && 'solo-gallery'"
    >
        <swiper
          :breakpoints="breakpoints"
          :loop="mediaResources.length > 1 ? true : false"
          :height="600"
          :centeredSlides="true"
          :centeredSlidesBounds="true"
          :pagination="{ clickable: true, el: '.swiper-pagination' }"
          :navigation="{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}"
        >
          <swiper-slide v-for="mediaResource in mediaResources" :key="mediaResource.id"  v-slot="{ isActive }">
            <div class="relative">
              <media-loader
                @click="openModal(mediaResource.type, mediaResource.url)"
                ref="mediaRef"
                :src="mediaResource.url"
                aspectRatio="100%"
                :autoplay="isActive"
                :declaredMediaType="(mediaResource?.type?.indexOf('image') > -1) ? 'image' : false"
                :muted="true"
                :class="darkMode ? 'dark-mode-background dark-mode-slide' : 'light-mode-background light-mode-slide'"
                class="overflow-hidden rounded-lg flex-1 media-loader-active"
              />
              <p class="w-full text-grey-9 text-center mt-4 text-sm">{{(mediaResource.type === 'video' || mediaResource.type.includes("mp4") || mediaResource.type.includes("video")) && isActive ? 'Click to Expand' : '&nbsp;'}}</p>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-pagination" v-if="mediaResources.length > 1" :class="darkMode && 'swiper-pagination-dark-mode-active'"></div>
        <div class="swiper-button-prev" v-if="mediaResources.length > 1">
          <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
        </div>
        <div class="swiper-button-next" v-if="mediaResources.length > 1">
          <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
        </div>
      </div>
    </div>
</template>

<script>
  import {ref, watchEffect} from 'vue';
  import useDarkMode from '@/hooks/useDarkMode';
  import MediaLoader from "@/components/Media/MediaLoader.vue"

 // import Swiper core and required modules
  import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue';



  // install Swiper modules
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

  import GLightbox from 'glightbox';
  import 'glightbox/dist/css/glightbox.css';

export default {
  name: "HeroGallery",
  components: {
    MediaLoader,
    Swiper,
    SwiperSlide,
  },
  props: {
    mediaResources: Object,
    marginTop: [String, null],
    marginBottom: [String, null],
    backgroundColor: [String, null]
  },
  setup(props) {
    const { darkMode } = useDarkMode();
    const media = ref(props.mediaResources);
    const breakpoints = ref({});

    watchEffect(() => {
      breakpoints.value = {
        300: {
          slidesPerView: props.mediaResources.length === 1 ? 1 : 1,
          spaceBetween: props.mediaResources.length === 1 ? 0 : 20,
        },
        600: {
          slidesPerView: props.mediaResources.length === 1 ? 1 : 1,
          spaceBetween: props.mediaResources.length === 1 ? 0 : 50,
        },
        601: {
          slidesPerView: props.mediaResources.length === 1 ? 1 : 3,
          spaceBetween: props.mediaResources.length === 1 ? 0 : 50,
        },
        1440: {
          slidesPerView: props.mediaResources.length === 1 ? 1 : 3,
          spaceBetween: props.mediaResources.length === 1 ? 0 : 100,
        }
      }
    })

    const openModal = (type, url) => {
      const lightbox = GLightbox({
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
      });

      const elementIndex = media.value.findIndex(el => el.url === url);
      const reorderedMediaArray = media.value.slice(elementIndex).concat(media.value.slice(0, elementIndex));
      const lightBoxElements = [];

      reorderedMediaArray.forEach(m => {
        if (m.type === 'video' || m.type.includes("mp4") || m.type.includes("video")) {
          lightBoxElements.push({
              'href': m.url,
              'type': 'video',
              'source': 'local', //vimeo, youtube or local
          })
        } else {
          lightBoxElements.push({
              'href': m.url,
              'type': 'image', //vimeo, youtube or local
          });
        }
      });

      lightbox.setElements(lightBoxElements)

      lightbox.open();
    };
    return {
      darkMode,
      breakpoints,
      openModal,
    }
  }
};
</script>

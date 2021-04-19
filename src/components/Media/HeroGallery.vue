<template>
  <div class="gallery relative text-white flex justify-center items-center mb-8">
      <swiper
        :space-between="50"
        :breakpoints="breakpoints"
        :loop="true"
        :height="600"
        :centeredSlides="true"
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
              :muted="true"
              :loop="true"
              class="overflow-hidden rounded-lg flex-1 media-loader-active"
            />
            <p class="w-full text-grey-9 text-center mt-4 text-sm">{{mediaResource.type === 'video' || mediaResource.type.includes("mp4") || mediaResource.type.includes("video") ? 'Click to Expand' : '&nbsp;'}}</p>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev">
        <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
      </div>
      <div class="swiper-button-next">
        <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
      </div>
    </div>
</template>

<script>
  import {ref} from 'vue';
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
  },
  setup(props) {
    const media = ref(props.mediaResources);
    const breakpoints = {
      300: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 1,
        spaceBetween: 50,
      },
      601: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
      1440: {
        slidesPerView: 3,
        spaceBetween: 100,
      }
    };
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
    return { breakpoints, openModal }
  }
};
</script>

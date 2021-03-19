<template>
  <div class="gallery relative text-white flex justify-center items-center mb-8">
      <swiper
        :space-between="50"
        :breakpoints="breakpoints"
        :loop="true"
        :height="600"
        :pagination="{ clickable: true, el: '.swiper-pagination' }"
        :navigation="{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}"
      >
        <swiper-slide v-for="mediaResource in mediaResources" :key="mediaResource.id"  v-slot="{ isNext }">
          <div :class="'relative ' + (isNext ? 'active-slide' : '')">
            <media-loader
              @click="openModal(mediaResource.type, mediaResource.url)"
              ref="mediaRef"
              :src="mediaResource.url"
              aspectRatio="100%"
              :autoplay="isNext"
              :muted="true"
              class="overflow-hidden rounded-lg flex-1 media-loader-active"
            />
            <p class="w-full text-grey-9 text-center mt-4 text-sm">{{mediaResource.type === 'video' ? 'Click for Audio' : '&nbsp;'}}</p>
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
  setup() {
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
      if (type === 'video') {
          lightbox.setElements([{
              'href': url,
              'type': 'video',
              'source': 'local', //vimeo, youtube or local
          }])
      } else {
          lightbox.setElements([{
              'href': url,
              'type': 'image', //vimeo, youtube or local
          }]);
      }
      lightbox.open();
    };
    return { breakpoints, openModal }
  }
};
</script>

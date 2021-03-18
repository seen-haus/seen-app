<template>
  <div class="gallery relative text-white flex justify-center items-center mb-8">
      <swiper
        :space-between="50"
        @swiper="onSwiper"
        :breakpoints="breakpoints"
        :loop="true"
        :height="600"
        :pagination="{ clickable: true, el: '.swiper-pagination' }"
        :navigation="{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="mediaResource in mediaResources" :key="mediaResource.id"  v-slot="{ isNext }">
          <div :class="isNext ? 'active-slide' : ''">
            <media-loader
              ref="mediaRef"
              :src="mediaResource.url"
              aspectRatio="100%"
              class="overflow-hidden rounded-t-3xl flex-1 media-loader-active"
            />
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
  import { computed } from "vue";
  import MediaLoader from "@/components/Media/MediaLoader.vue"

 // import Swiper core and required modules
  import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue';

  // Import Swiper styles
  import 'swiper/swiper.scss';
  import 'swiper/components/navigation/navigation.scss';
  import 'swiper/components/pagination/pagination.scss';
  import 'swiper/components/scrollbar/scrollbar.scss';

  // install Swiper modules
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
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
    const mediaType = computed(() => {
      if (props.src.includes("youtube.com")) return "youtube";
      if (props.src.includes(".mp4")) return "video";
      return "image";
    });
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
    return { breakpoints }
  }
};
</script>

<style lang="scss">

.gallery {
  max-height: 650px;
  margin-bottom: 4rem;
  margin-top: 2rem;
  margin: 2rem auto 4rem auto;
  max-width: 1700px;
  position: relative;
  height: calc(100vw * 0.44 - 100px);
}

.swiper-pagination-bullet {
  width: 12px !important;
  height: 12px !important;
  margin: 0 8px 0 0 !important;
  background-color: #d8d8d8 !important;
  border-radius: 50%;
  outline: none !important;
  opacity: 1;
  &.swiper-pagination-bullet-active {
    background-color: #000000 !important;
  }
}

.swiper-slide {
  max-width: 450px;
  opacity: .5;
  transition: all .5s;
}
.swiper-slide-next {
  max-width: 600px;
  opacity: 1;
  transition: all .5s;
}

.swiper-button-next, .swiper-button-prev {
  width: 48px;
  height: 48px;
  padding: 18px 15px 18px 14px;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  border-radius: 50%;
  &:after {
    display: none;
  }
  &:focus {
    outline: none;
  }
}
.swiper-button-prev {
  transform: rotate(-180deg);
  left: calc(14% - 1.5rem);
}
.swiper-button-next {
  right: calc(14% - 1.5rem);
}
.swiper-pagination {
  bottom: -3rem;
}

@media screen and (max-width:600px) {
  .swiper-slide {
    width: 100% !important;
    max-width: 600px !important;
    opacity: 1 !important;
  }
}
@media screen and (min-width:601px){
  .swiper-slide {
    align-self: center;
    &.swiper-slide-active {
      width: 28% !important;
    }
    &.swiper-slide-next {
      width: calc(44% - 100px) !important;

      &+.swiper-slide {
        width: 28% !important;
      }
    }
  }
}

@media screen and (min-width:1450px){
  .swiper-slide {
    align-self: center;
    max-width: 500px;

    &.swiper-slide-active {
      width: 26% !important;
    }
    &.swiper-slide-next {
      width: calc(48% - 200px) !important;
      max-width: 700px;

      &+.swiper-slide {
        width: 26% !important;
      }
    }
  }
  .swiper-button-prev {
    left: calc(13% - 1.5rem);
  }
  .swiper-button-next {
    right: calc(13% - 1.5rem);
  }
}
</style>
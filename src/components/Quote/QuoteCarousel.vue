<template>
  <div class="quote-carousel-wrapper">
    <swiper
      :loop="true"
      :space-between="100"
      :pagination="{ clickable: true, el: '.swiper-pagination' }"
      :navigation="{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}"
    >
      <swiper-slide v-for="quote in quotes" :key="quote.text"  v-slot="{ isNext }">
        <div :class="'relative ' + (isNext ? 'active-slide' : '')">
          <quote />
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination w-full text-center mt-6"></div>
    <div class="swiper-button-prev rotate-180">
      <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
    </div>
    <div class="swiper-button-next">
      <img src="@/assets/icons/arrow-right.svg" class="cursor-pointer" alt="SEEN">
    </div>
  </div>
  
</template>

<script>
import Quote from '@/components/Quote/Quote.vue';
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
  components: {
    Quote,
    Swiper,
    SwiperSlide,
  },
  name: "QuoteCarousel",
  setup() {
    const quotes = [{text: '123'}, {text: '1234'}, {text: '12345'}, {text: '123456'}];
    return {quotes};
  }
};
</script>

<style lang="scss" scoped>
  .quote-carousel-wrapper {
    max-width: 48rem;
  }
  .swiper-button-next, .swiper-button-prev {
    top: 50%;
  }
  .swiper-button-next {
    right: -1.5rem;
  }
  .swiper-button-prev {
    left: -1.5rem;
}
</style>


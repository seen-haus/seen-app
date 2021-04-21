<template>
  <div class="quote-carousel-wrapper">
    <swiper
        :loop="true"
        :space-between="100"
        :pagination="{ clickable: true, el: '.swiper-pagination' }"
        :navigation="{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}"
    >
      <swiper-slide v-for="quote in quotes" :key="quote.text" v-slot="{ isNext }">
        <div :class="'relative ' + (isNext ? 'active-slide' : '')">
          <quote :text="quote.text" :author="quote.author" :title="quote.title" :avatar="quote.avatar"/>
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
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper';

// Import Swiper Vue.js components
import {Swiper, SwiperSlide} from 'swiper/vue';

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
    const quotes = [
      {
        text: 'SEEN HAUS is doing NFTs right. Physical art paired with a dope matching NFT, QR code on the back that directs to the Opensea page. This is the future.',
        author: 'Doublewordscore',
        title: 'Collector',
        avatar: 'https://assets.seen.haus/quotes/doublescore.jpg',
      },
        {
        text: 'The hoodies are soft and seriously supreme quality. The designs are dope and the print quality is immaculate. Love wearing it any chance I get.',
        author: 'Shillus Maximus',
        title: 'Collector',
       avatar: 'https://assets.seen.haus/quotes/sm.jpg',
      },
        {
        text: 'I am a huge fan of SEEN HAUS, They are a highly curated marketplace of artists with members that will benefit in the long term.',
        author: '1PENEMY',
        title: 'Visual Artist',
        avatar: 'https://assets.seen.haus/quotes/penemy.jpg',
      },
        {
        text: 'Working with SEEN is incredibly inspiring and exciting. The team is really supportive and brings the best out of each project.',
        author: 'Tim Gatenby',
        title: 'Visual Artist',
        avatar: 'https://assets.seen.haus/nft11/avatar1.jpg',
      },
    ];
    return {quotes};
  }
};
</script>

<style lang="scss" scoped>
.quote-carousel-wrapper {
  max-width: 48rem;
  width: 100%;
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


<template>
  <div class="hero-auction">
    <div class="container mx-auto px-6 md:px-8 py-15 flex flex-col lg:flex-row">
      <div class="media flex-1">
        <img class="image" src="http://placekitten.com/1000/1000" alt="" />
        <div class="tags">
          <div class="tag tag-nft mr-1">NFT</div>
          <div class="tag tag-tangible">TANGIBLE</div>
        </div>
        <i v-if="true" class="video-type-indicator fas fa-video"></i>
      </div>
      <div class="w-12"></div>
      <div class="description">
        <div class="title flex items-center">
          <div class="title-text">Breaking ETH</div>
          <div class="fence fence-dark fence-right flex-shrink"></div>
        </div>
        <div class="status">
          <UserBadge type="dark" class="mr-4"/>
          <div class="live-indicator">
            <div class="indicator-icon"></div> LIVE
          </div>
        </div>
        <div class="auction-action pt-14">
          <button class="button light">View Auction <i class="fas fa-arrow-right ml-3 icon-right"></i></button>
          <div class="price">
            <div class="crypto"><span>2.06</span>Ether</div>
            <div class="fiat">$2,442.55</div>
          </div>
        </div>
        <div class="timer pt-12">
          <ProgressTimer progress="0.2"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import UserBadge from '@/components/UserBadge.vue';
import ProgressTimer from '@/components/Progress/ProgressTimer.vue';

export default {
  name: "HeroAuction",
  components: {UserBadge, ProgressTimer,}
};
</script>


<style lang="scss" scoped>
.hero-auction {
  @apply border-solid border-gray-300;
  background-image: linear-gradient(66deg, #333333 2%, #000000 100%);

  .media {
    position: relative;
    @apply overflow-hidden rounded-3xl;

    .tags {
      @apply flex;
      position: absolute;
      top: 24px;
      left: 24px;
    }

    .video-type-indicator {
      @apply flex text-white;
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 24px;
    }
  }

  .description {
    @apply flex flex-1 flex-col justify-center;

    .title-text {
      @apply font-title mr-4 text-white flex-shrink-0 font-bold;
      max-width: 80%;
      font-size: 46px;
    }
  }

  .status {
    @apply flex justify-start items-center mt-2;


    .live-indicator {
      @apply flex items-center text-white font-medium text-xs;

      .indicator-icon {
        @apply w-2.5 h-2.5 bg-green-500 rounded-full mr-2;
      }
    }
  }

  .auction-action {
    @apply flex items-center;

    .button {
      @apply mr-7;
    }

    .price {
      @apply flex flex-col items-start;
      .crypto {
        @apply text-white text-sm;

        span {
          @apply font-bold mr-1.5;
          font-size: 27px;
        }
      }

      .fiat {
        @apply text-gray-400 text-sm;
      }
    }

    
  }
}
</style>
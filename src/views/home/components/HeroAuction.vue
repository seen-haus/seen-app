<template>
  <div class="hero-auction">
    <container class="py-15 flex flex-col lg:flex-row">
      <div class="media overflow-hidden rounded-3xl relative flex-1">
        <img class="image" src="http://placekitten.com/1000/1000" alt="" />

        <div class="tags flex absolute top-6 left-6">
          <tag type="nft" />
          <tag type="tangible" />
        </div>

        <i v-if="true" class="video-type-indicator fas fa-video"></i>
      </div>
      <div class="w-12"></div>

      <div class="description flex flex-1 flex-col justify-center">
        <fenced-title
          class="text-white flex lg:hidden mt-6"
          color="fence-dark"
          text-align="center"
          :closed="true"
          ><span class="flex-shrink-0">Breaking ETH</span></fenced-title
        >

        <fenced-title
          class="text-white hidden lg:flex"
          color="fence-dark"
          text-align="left"
          :closed="true"
          ><span class="flex-shrink-0">Breaking ETH</span></fenced-title
        >

        <div class="flex lg:justify-start items-center mt-2 justify-center">
          <user-badge type="dark" class="mr-4" />
          <live-indicator status="comming soon" />
        </div>

        <div class="auction-action flex items-center pt-14">
          <button class="button light mr-7">
            View Auction <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>
          <div class="price flex flex-col items-start">
            <div class="crypto text-white text-sm">
              <span class="font-bold mr-1.5 text-3xl">2.06</span>Ether
            </div>
            <div class="fiat text-gray-400 text-sm">$2,442.55</div>
          </div>
        </div>

        <div class="timer pt-12">
          <progress-bar :progress="0.34" class="bg-fence-dark h-3" />
          <progress-timer progress="0.2" class="text-white mt-3"/>
        </div>
      </div>
    </container>
  </div>
</template>


<script>
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";

export default {
  name: "HeroAuction",
  components: {
    UserBadge,
    Tag,
    ProgressBar,
    ProgressTimer,
    LiveIndicator,
    Container,
    FencedTitle,
  },
};
</script>


<style lang="scss" scoped>
.hero-auction {
  @apply border-solid border-gray-300;
  background-image: linear-gradient(180deg, #333333 2%, #000000 100%);

  @screen lg {
    // Change the direction of fade so it doesn't interfere with fence colors
    background-image: linear-gradient(66deg, #333333 2%, #000000 100%);
  }

  .media {
    .video-type-indicator {
      @apply flex text-white;
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 24px;
    }
  }

  .description {
    .title-text {
      @apply font-title mr-4 text-white flex-shrink-0 font-bold;
      max-width: 80%;
      font-size: 46px;
    }
  }
}
</style>
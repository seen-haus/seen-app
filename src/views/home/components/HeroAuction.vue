<template>
  <div class="hero-auction">
    <container class="py-15 flex flex-col lg:flex-row">
      <div class="media relative flex items-center flex-1">
        <!-- <img class="image" :src="media" alt="" /> -->

        <media-loader
          :src="media"
          aspectRatio="100%"
          class="overflow-hidden rounded-3xl flex-1"
          muted
          loop
          autoplay
        />

        <div class="tags flex absolute top-6 left-6">
          <tag v-if="isNft" class="bg-tag-nft mr-1 text-white">NFT</tag>
          <tag v-if="isTangible" class="bg-tag-tangible text-white"
            >TANGIBLE</tag
          >
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
          ><span class="flex-shrink-0">{{ title }}</span></fenced-title
        >

        <fenced-title
          class="text-white hidden lg:flex"
          color="fence-dark"
          text-align="left"
          :closed="true"
          ><span class="flex-shrink-0">{{ title }}</span></fenced-title
        >

        <div class="flex lg:justify-start items-center mt-2 justify-center">
          <user-badge
            type="dark"
            :url="artist.avatar"
            :username="artist.name"
          />
          <live-indicator :status="liveStatus" class="text-white ml-4" />
        </div>

        <div class="auction-action flex items-center pt-14">
          <button class="button light mr-7" @click="navigateToCollectable">
            View Auction <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>

          <price-display
            size="md"
            class="text-white"
            type="Ether"
            :price="price"
          />
        </div>

        <div class="timer pt-12">
          <progress-bar :progress="0.34" class="bg-fence-dark h-3" />
          <progress-timer progress="0.2" class="text-white mt-3" />
        </div>
      </div>
    </container>
  </div>
</template>


<script>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

import COLLECTABLE_TYPE from "@/constants/Collectables.js";

export default {
  name: "HeroAuction",
  components: {
    UserBadge,
    Tag,
    PriceDisplay,
    ProgressBar,
    ProgressTimer,
    LiveIndicator,
    Container,
    FencedTitle,
    MediaLoader,
  },
  props: {
    collectable: Object,
  },
  setup(props) {
    // console.log("ProductCard", props.collectable);
    const router = useRouter();

    const timerRef = ref(null);
    const state = reactive({
      progress: 0.0,
    });

    const title = computed(() => props.collectable.title);
    const artist = computed(() => props.collectable.artist);
    const type = computed(() => props.collectable.type);
    const media = computed(() => props.collectable.media[0].url);

    const is_active = computed(() => props.collectable.is_active);
    const is_coming_soon = computed(() => props.collectable.is_coming_soon);
    const is_sold_out = computed(() => props.collectable.is_sold_out);

    const startsAt = computed(() => props.collectable.starts_at);
    const endsAt = computed(() => props.collectable.ends_at);

    const purchase_type = computed(() => props.collectable.purchase_type);
    const price = computed(() =>
      purchase_type.value === 2
        ? props.collectable.price
        : props.collectable.start_bid
    );

    const edition = computed(() => props.collectable.edition);
    const edition_of = computed(() => props.collectable.edition_of);

    if (purchase_type.value === 1) {
      state.progress = edition_of.value / edition.value;
    }
    const progress = computed(() => state.progress);

    const isTangible = computed(
      () =>
        type.value === COLLECTABLE_TYPE.TANGIBLE ||
        type.value === COLLECTABLE_TYPE.TANGIBLE_NFT
    );
    const isNft = computed(
      () =>
        type.value === COLLECTABLE_TYPE.NFT ||
        type.value === COLLECTABLE_TYPE.TANGIBLE_NFT
    );
    const liveStatus = computed(() => {
      let status = is_active.value
        ? is_coming_soon.value
          ? "comming soon"
          : "live"
        : "ended";

      return status;
    });

    const updateProgress = function (event) {
      state.progress = event;
    };

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const navigateToCollectable = function () {
      router.push({
        name: "collectableAuction",
        params: { contractAddress: props.collectable.contract_address },
      });
    };

    return {
      title,
      artist,
      price,
      type,
      media,
      startsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      purchase_type,
      edition,
      edition_of,
      progress,
      // Methods
      isTangible,
      isNft,
      updateProgress,
      addTime,
      timerRef,
      navigateToCollectable,
    };
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
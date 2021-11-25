<template>
  <div :class="darkMode ? 'hero-auction-dark-mode' : 'hero-auction-light-mode'" class="hero-auction">
    <container class="py-15 flex flex-col lg:flex-row">
      <div
          class="media relative flex items-center flex-1 cursor-pointer rounded-3xl overflow-hidden"
          @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route)"
      >
        <media-loader
            :src="firstMedia"
            aspectRatio="100%"
            class="overflow-hidden rounded-20px hero-media-shadow flex-1"
            muted
            loop
            autoplay
        />

        <div class="tags flex absolute top-6 left-6">
          <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
          <tag v-if="isTangible" class="bg-black text-white"
          >PHYSICAL
          </tag
          >
        </div>
      </div>

      <div class="w-12"></div>

      <div class="description flex flex-1 flex-col justify-center">

        <fenced-title
            class="text-black flex lg:hidden mt-6"
            color="fence-dark"
            text-align="center"
            :titleMonospace="titleMonospace"
            :closed="true"
        ><span class="flex-shrink-0">{{ title }}</span></fenced-title>

        <unfenced-title
            class="text-black hidden lg:flex"
            color="fence-dark"
            text-align="left"
            :titleMonospace="titleMonospace"
            :closed="true"
        ><span class="flex-shrink-0">{{ title }}</span></unfenced-title>

        <div class="flex lg:justify-start items-center mt-2 justify-center">
          <div class="light-mode-surface button shortened shadow-lifted">
            <user-or-artist-badge
              :creatorAccount="creatorAccount"
              :creatorUsername="creatorUsername"
              :creatorProfilePicture="creatorProfilePicture"
            />
          </div>
          <live-indicator :status="liveStatus" class="text-black ml-4"/>
        </div>

        <light-typography textAlign="left" class="mt-6 collectable-description">{{description}}</light-typography>

        <div class="auction-action flex items-center pt-6">
          <button class="button primary dark mr-7" @click="navigateToCollectable">
            {{ isUpcomming && !collectable.contract_address ? "Preview" : (isAuction ? "View Auction" : "View Drop") }} <i class="fas fa-arrow-right ml-3 icon-right"></i>
          </button>

          <price-display
              size="md"
              type="Ether"
              v-if="!shouldHidePrice"
              :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
              :price="price"
              :priceUSD="isAuction ? priceUSD : priceUSDSold"
          />
        </div>

        <div class="timer pt-2">
          <!-- <progress-bar
              :inversed="isAuction || isOpenEdition"
              class="h-3"
              :class="{'': progress === 1}"
              progressBackgroundColor="bg-fence-dark"
              :endDate="currentEndsAt"
              :progress="progress"
              :colorClass="
              isCollectableActive && !isAwaitingReserve
                ? isUpcomming
                  ? 'bg-primary'
                  : 'bg-primary'
                : 'bg-primary'
            "
          /> -->

          <template v-if="isAuction">
            <div
                class="text-sm mt-2 text-gray-400 font-semibold"
                v-if="is_sold_out && !isAwaitingReserve"
            >
              Sold Out
            </div>
            <progress-timer
                v-if="!is_sold_out && !isAwaitingReserve"
                ref="timerRef"
                class="text-black text-sm mt-2"
                :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
                :startDate="getStartsAt"
                :endDate="currentEndsAt"
                :isAuction="isAuction"
                @onProgress="updateState"
                @onTimerStateChange="updateState"
            />
            <div
                class="text-sm mt-2 text-gray-400 font-semibold"
                v-if="isAwaitingReserve"
            >
              Awaiting Reserve Bid
            </div>
          </template>

          <template v-else>
            <progress-timer
                v-if="(isUpcomming || isOpenEdition) && isCollectableActive"
                ref="timerRef"
                class="text-black text-sm mt-2"
                :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
                :startDate="getStartsAt"
                :endDate="currentEndsAt"
                :isAuction="isAuction"
                @onProgress="updateState"
                @onTimerStateChange="updateState"
            />
            <div
              v-if="isOpenEdition"
              class="text-sm font-bold mt-2"
              :class="'text-gray-400'"
            >
              {{
                isCollectableActive
                    ? `${itemsBought} Editions Purchased`
                    : is_closed ? "Closed" : "Sold Out"
              }}
            </div>
            <div
                v-else
                class="text-sm font-bold mt-2"
                :class="isCollectableActive ? 'text-black' : 'text-gray-400'"
            >
              {{
                isCollectableActive
                    ? `${items} out of ${itemsOf} editions left`
                    : is_sold_out
                    ? "Sold Out"
                    : "Ended"
              }}
            </div>
          </template>
        </div>

        <div class="abstract-circles abstract-circles-hero">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>

      </div>
    </container>
  </div>
</template>


<script>
import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import { useStore } from "vuex";

import UserOrArtistBadge from "@/components/PillsAndTags/UserOrArtistBadge.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import useCollectableInformation from "@/hooks/useCollectableInformation.js";
import useDarkMode from "@/hooks/useDarkMode";

export default {
  name: "HeroAuction",
  components: {
    UserOrArtistBadge,
    Tag,
    PriceDisplay,
    ProgressBar,
    ProgressTimer,
    LiveIndicator,
    Container,
    FencedTitle,
    UnfencedTitle,
    MediaLoader,
    LightTypography,
  },
  props: {
    collectable: Object,
  },
  computed: {
    isAwaitingReserve: function () {
      switch (this.liveStatus) {
        case "awaiting-reserve-bid":
          return true;
        default:
          return false;
      }
    },
  },
  setup(props) {
    // console.log("ProductCard", props.collectable);
    const router = useRouter();
    const timerRef = ref(null);
    const titleMonospace = ref(false);
    const { darkMode } = useDarkMode();

    // TODO: Make this into a DB datasource unless V3 no longer uses this
    if([115].indexOf(props?.collectable?.id) > -1) {
      titleMonospace.value = true;
    }

    const {
      collectableState,
      price,
      priceUSD,
      priceUSDSold,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      // Static
      type,
      // media,
      firstMedia,
      artist,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      title,
      description,
      startsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      isUpcomming,
      isOpenEdition,
      itemsBought,
      // Methods
      updateProgress,
      // setCollectable,
      // updateInformation,
      updateCollectableState,
      bundleChildItems,
      pillOverride,
    } = useCollectableInformation(props.collectable);

    const addTime = function () {
      if (timerRef.value != null) timerRef.value.addSeconds(60 * 60 * 24);
    };

    const navigateToCollectable = function () {
      if (!isCollectableActive || !props.collectable.slug) return;
      if(props.collectable.is_slug_full_route) {
        router.push({
          name: props.collectable.slug,
        });
      }else{
        if(props.collectable.version === 2) {
          router.push({
            name: "collectableDropV2",
            params: { slug: props.collectable.slug },
          });
        } else if (props.collectable.version === 3) {
          router.push({
            name: "collectableDropV3",
            params: { slug: props.collectable.slug },
          });
        }
      }
    };

    const updateState = function(e) {
      updateProgress(e);
      updateCollectableState();
    }

    const currentEndsAt = computed(() => {
      if(bundleChildItems && bundleChildItems.value && bundleChildItems.value.length > 0) {
        let latestBundleItemEndsAt = false;
        for(let bundleItem of bundleChildItems.value) {
          if(!latestBundleItemEndsAt) {
            latestBundleItemEndsAt = bundleItem.ends_at;
          }else if(bundleItem.ends_at > latestBundleItemEndsAt) {
            latestBundleItemEndsAt = bundleItem.ends_at;
          }
        }
        if (latestBundleItemEndsAt && latestBundleItemEndsAt == "string") {
          return new Date(latestBundleItemEndsAt)
        }
        return latestBundleItemEndsAt;
      } else if (endsAt.value && typeof endsAt.value == "string") {
        return new Date(endsAt.value)
      }
      return endsAt.value;
    });

    const getStartsAt = computed(() => {
      if(bundleChildItems && bundleChildItems.value && bundleChildItems.value.length > 0) {
        let earliestBundleItemStartsAt = false;
        for(let bundleItem of bundleChildItems.value) {
          if(!earliestBundleItemStartsAt) {
            earliestBundleItemStartsAt = bundleItem.starts_at;
          }else if(bundleItem.starts_at < earliestBundleItemStartsAt) {
            earliestBundleItemStartsAt = bundleItem.starts_at;
          }
        }
        if (earliestBundleItemStartsAt && earliestBundleItemStartsAt == "string") {
          return new Date(earliestBundleItemStartsAt)
        }
        return earliestBundleItemStartsAt;
      } else if (startsAt.value && typeof startsAt.value == "string") {
        return new Date(startsAt.value)
      }
      return startsAt.value;
    });

    const shouldHidePrice = computed(() => {
      if(bundleChildItems && bundleChildItems.value && bundleChildItems.value.length > 0) {
        return true;
      }
      return false;
    });

    return {
      timerRef,
      collectableState,
      price,
      priceUSD,
      priceUSDSold,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      // Static
      type,
      firstMedia,
      artist,
      creatorAccount,
      creatorProfilePicture,
      creatorUsername,
      title,
      description,
      startsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      isUpcomming,
      darkMode,
      titleMonospace,
      isOpenEdition,
      itemsBought,
      // Methods
      updateProgress,
      updateState,
      addTime,
      navigateToCollectable,
      shouldHidePrice,
      currentEndsAt,
      getStartsAt,
      pillOverride,
    };
  },
};
</script>


<style lang="scss" scoped>
.hero-auction {
  @apply border-solid border-gray-300;
  // background-image: linear-gradient(180deg, #333333 2%, #000000 100%);

  @screen lg {
    // Change the direction of fade so it doesn't interfere with fence colors
    // background-image: linear-gradient(66deg, #333333 2%, #000000 100%);
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
      @apply font-title mr-4 text-black flex-shrink-0 font-bold;
      max-width: 80%;
      font-size: 46px;
    }
  }

  .collectable-description {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @supports (-webkit-line-clamp: 3) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  .abstract-circles-hero {
    position: absolute;
    z-index: -1;
  }
}
.hero-auction-light-mode {
  background-image: transparent;
}
.hero-auction-dark-mode {
  background-image: linear-gradient(180deg, #000000 2%, #000000 100%);

  @screen lg {
    // Change the direction of fade so it doesn't interfere with fence colors
    background-image: linear-gradient(66deg, #000000 2%, #000000 100%);
  }
}
</style>

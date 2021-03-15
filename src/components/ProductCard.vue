<template>
  <div
    class="product-card flex flex-col overflow-hidden rounded-2xl shadow-lg cursor-pointer"
  >
    <div class="media relative">
      <div class="relative pb-full">
        <img class="image absolute w-full h-full" :src="media" alt="" />
      </div>

      <div class="tags flex absolute top-6 left-6 right-6">
        <tag v-if="isNft" class="bg-tag-nft mr-1 text-white">NFT</tag>
        <tag v-if="isTangible" class="bg-tag-tangible text-white">TANGIBLE</tag>

        <live-indicator :status="liveStatus" class="text-white ml-auto" />
      </div>
    </div>
    <div class="description relative p-6 flex flex-col flex-grow">
      <user-badge
        type="light"
        :url="artist.avatar"
        :username="artist.name"
        class="absolute -top-4"
      />

      <div class="title-and-price flex items-start">
        <span class="text-2.5xl font-title font-bold flex-1"
          >{{ title }}</span
        >
        <price-display
          size="sm"
          class="text-black items-end ml-2"
          type="Ether"
          :price="price"
        />
      </div>

      <div class="flex-1"></div>

      <progress-bar
        :progress="progress"
        :colorClass="is_sold_out ? 'bg-gray-300' : 'bg-primary'"
        class="bg-fence-light h-2 mt-10"
      />

      <progress-timer
        ref="timerRef"
        v-if="purchase_type === 2"
        class="text-black text-sm mt-2"
        :startDate="startsAt"
        :endDate="endsAt"
        @onProgress="updateProgress"
      />
      <div v-else class="text-sm font-bold mt-2">
        {{ edition }} out of {{ edition_of }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Tag from "@/components/PillsAndTags/Tag.vue";
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import ProgressTimer from "@/components/Progress/ProgressTimer.vue";
import ProgressBar from "@/components/Progress/ProgressBar.vue";
import UserBadge from "./PillsAndTags/UserBadge.vue";
import { computed, reactive, ref } from "vue";
import COLLECTABLE_TYPE from "@/constants/Collectables.js";

export default {
  name: "ProductCard",
  components: {
    ProgressTimer,
    ProgressBar,
    UserBadge,
    Tag,
    LiveIndicator,
    PriceDisplay,
  },
  props: {
    collectable: Object,
  },
  setup(props) {
    // console.log('ProductCard', props.collectable);

    const timerRef = ref(null);
    const state = reactive({
      progress: 0.0,
    });

    const title = computed(() => props.collectable.title);
    const artist = computed(() => props.collectable.artist);
    const type = computed(() => props.collectable.type);
    const media = computed(() => props.collectable.media[1].url);

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

    const updateProgress = function(event) {
      state.progress = event;
    }

    const addTime = function() {
      if (timerRef.value != null)
        timerRef.value.addSeconds(60 * 60 * 24);
    }

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
      timerRef
    };
  },
};
</script>

<style lang="scss" scoped>
</style>

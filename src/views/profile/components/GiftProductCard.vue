<template>
  <div
    class="product-card flex flex-col overflow-hidden rounded-2xl shadow-lg cursor-pointer"
  >
    <div class="media relative">
      <media-loader
        ref="mediaRef"
        :src="firstMedia"
        aspectRatio="100%"
        muted
        loop
        autoplay
        class="overflow-hidden rounded-t-3xl flex-1"
      />
    </div>

    <div class="description relative p-6 pb-3 flex flex-col flex-grow">
      <user-badge
        type="light"
        :url="artist.avatar"
        :username="artist.name"
        :artistSlug="artist.slug"
        class="absolute -top-4"
      />

      <div class="title-and-price flex items-start">
        <span
          class="text-xl md:text-2xl font-title font-bold flex-1 text-black"
          >{{ title }}</span
        >
        <h1 class="font-bold mr-1.5 text-2xl text-gray-400 items-end ml-2 -mt-0.5 md:mt-0.5">Gift</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

export default {
  name: 'GiftProductCard',
  components: {
    UserBadge,
    MediaLoader,
  },
  props: {
    collectable: Object,
  },
  setup(props) {
    const firstMedia = computed(() => props.collectable.image_url);
    const artist = computed(() => {
      return {
        avatar: '/img/icon--seen-green.d1308baf.svg',
        name: 'SEEN HAUS'
      }
    });
    const title = computed(() => props.collectable.name);


    return {
      firstMedia,
      artist,
      title,
    }
  }
}
</script>
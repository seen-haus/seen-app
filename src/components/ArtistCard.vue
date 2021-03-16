<template>
  <div class="artist-card overflow-hidden rounded-lg shadow-lg">
    <div class="media flex justify-center bg-black h-32">
      <div class="w-32">
        <media-loader
          :src="artist.avatar"
          aspectRatio="100%"
          controls
          class="overflow-hidden"
        />
      </div>
    </div>
    <div class="description flex flex-col relative p-6">
      <img
        :src="artist.avatar"
        alt=""
        class="rounded-full border-white border-3 absolute left-6 -top-12.5 w-25 h-25"
      />

      <tag class="bg-fence-light self-end text-gray-400 font-semibold"
        >{{ artist.collectablesCount }} CREATIONS</tag
      >

      <div class="text-title font-bold text-2.5xl mt-6">{{ artist.name }}</div>
      <div class="mt-2 text-gray-600">
        {{ artist.bio }}
      </div>

      <div class="h-0.5 my-4 w-full rounded-full bg-gray-200"></div>

      <div class="flex justify-start items-center text-xs text-gray-400">
        <a class="mr-8 cursor-pointer" :href="twitter.url" target="_blank">
          <i class="fas fa-link mr-2 text-sm"></i>{{ twitter?.title }}
        </a>
        <a class="cursor-pointer" :href="twitter.url" target="_blank">
          <i class="fas fa-envelope mr-2 text-sm"></i>{{ instagram?.title }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";

export default {
  name: "ArtistCard",
  components: {
    Tag,
    MediaLoader,
  },
  props: {
    artist: Object,
  },
  computed: {
    twitter: function () {
      return this.artist.socials[0];
    },
    instagram: function () {
      return this.artist.socials[1];
    },
  },
};
</script>


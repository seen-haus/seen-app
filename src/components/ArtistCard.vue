<template>
  <div class="artist-card overflow-hidden rounded-lg shadow-lg cursor-pointer" @click="navigateToArtist">
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

      <div class="text-title font-bold text-2.5xl mt-6 ellipsis">{{ artist.name }}</div>
      <div class="mt-2 text-gray-600">
        {{ artist.bio }}
      </div>

      <div class="h-0.5 my-4 w-full rounded-full bg-gray-200"></div>

      <div class="flex flex-wrap justify-start items-center text-xs text-gray-400">
        <social-line :social="social" v-for="social in artist.socials" :key="social.url" />
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import {useRouter} from 'vue-router';
import {ref} from 'vue';

export default {
  name: "ArtistCard",
  components: {
    Tag,
    MediaLoader,
    SocialLine,
  },
  props: {
    artist: Object,
  },
  setup(props) {
    const artist = ref(props.artist);
    const router = useRouter();
    const navigateToArtist = () => {
      router.push({
        name: "artistProfile",
        params: { artistSlug: artist.value.slug },
      });
    }
    return {navigateToArtist};
  }
};
</script>

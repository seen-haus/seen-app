<template>
  <div
    class="artist-card overflow-hidden rounded-lg custom-shadow cursor-pointer"
    @click="navigateToArtist"
  >
    <div class="description flex flex-col p-6">
      <img
        :src="artist.avatar"
        alt=""
        class="rounded-full border-white border-3 left-6 -top-12.5 w-25 h-25"
      />

      <div class="flex items-center mt-6">
        <div class="text-title font-bold text-2.5xl ellipsis  mr-4">
          {{ artist.name }}
        </div>
        <tag class="bg-fence-light text-gray-400 font-semibold flex-shrink-0" :class="{'ml-auto': $route.name !== 'collectableDrops'}">
          {{ collectablesCount }} CREATION{{
            collectablesCount > 1 || collectablesCount === 0
              ? "S"
              : ""
          }}</tag
        >
      </div>

      <div
        class="mt-3 text-gray-600 text-lg"
        v-if="artistStatement != null"
        v-html="artistStatement"
      ></div>
      <div class="mt-3 text-gray-600" v-else>
        {{ artist.bio }}
      </div>

      <div class="h-0.5 my-4 w-full rounded-full bg-gray-200"></div>

      <div
        class="flex flex-wrap justify-start items-center text-xs text-gray-400"
      >
        <social-line
          :social="social"
          v-for="social in artist.socials"
          :key="social.url"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/PillsAndTags/Tag.vue";
import SocialLine from "@/components/PillsAndTags/SocialLine.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

export default {
  name: "ArtistCard",
  components: {
    Tag,
    MediaLoader,
    SocialLine,
  },
  props: {
    artist: Object,
    artistStatement: {
      type: String,
    },
  },
  setup(props) {
    const artist = ref(props.artist);
    const router = useRouter();
    const collectablesCount = computed(() => {
      return artist.value.collectablesCount || 0;
    });

    const navigateToArtist = () => {
      router.push({
        name: "artistProfile",
        params: { artistSlug: artist.value.slug },
      });
    };

    return {
      navigateToArtist,
      collectablesCount,
    };
  },
};
</script>

<style lang="scss" scoped>
  .custom-shadow {
    box-shadow: 0px 3px 15px rgba(0,0,0,.1);
  }
</style>

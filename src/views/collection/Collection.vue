<template>
  <div>
    <container class="section-featured-auctions pb-24">
      <div v-if="getCollectionTrailer(state.collectionName)" class="trailer-container mt-12">
        <media-loader
          @click="openModal('video/mp4', getCollectionTrailer(state.collectionName), false)"
          ref="mediaRef"
          :src="getCollectionTrailer(state.collectionName)"
          aspectRatio="100%"
          :loop="true"
          :autoplay="true"
          :declaredMediaType="false"
          :muted="true"
          :fillHeight="true"
          :class="darkMode ? 'dark-mode-background dark-mode-slide' : 'light-mode-background light-mode-slide'"
          class="overflow-hidden rounded-lg flex-1 media-loader-active"
        />
        <p class="w-full text-grey-9 text-center mt-4 text-sm">Click to Expand</p>
      </div>
      <div class="flex items-center pb-4 flex-col lg:flex-row">
        <div class="abstract-circles abstract-circles-drops">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
      </div>
      <div v-if="getCollectionDescription(state.collectionName)" class="mt-4 mb-4">
        <light-typography fontSize="18px">
          {{getCollectionDescription(state.collectionName)}}
        </light-typography>
      </div>
      <div
        class="auction-list-big grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-9"
      >
        <template
          v-for="collectable in listOfCollectables"
          :key="collectable && collectable.id"
        >
          <product-card-v3
            v-if="collectable != null"
            :collectable="collectable"
            @click="navigateToCollectable(collectable.slug, collectable.is_slug_full_route, collectable.version)"
          />
          <product-card-v3-placeholder v-else />
        </template>
      </div>

      <button
        class="button mt-20 mx-auto w-full md:w-96"
        :class="darkMode ? 'light' : 'dark'"
        v-if="hasMore"
        @click="handleLoadMore"
      >
        Load More
      </button>
    </container>
  </div>
</template>

<script>
import { computed, reactive, ref, watchEffect, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMeta } from "vue-meta";

import { slugToTitleCase } from "@/services/utils";

import Container from "@/components/Container.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import ProductCardV3Placeholder from "@/components/ProductCardV3Placeholder.vue";
import UnfencedTitle from "@/components/FencedTitle.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue"
import LightTypography from "@/components/LightTypography.vue";

import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import useDarkMode from '@/hooks/useDarkMode';

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

export default {
  name: "Drops",
  components: {
    Container,
    UnfencedTitle,
    ProductCardV3,
    ProductCardV3Placeholder,
    LightTypography,
    MediaLoader,
  },
  methods: {
    getCollectionTrailer(collectionName) {
      if(collectionName === '420') {
        // return [{ 
        //   url: `https://seenhaus.mypinata.cloud/ipfs/QmT2AMW6HEfgbwtftmCAfVnCKyjXkMwRfWMys23nyfhKZr`,
        //   type: 'video/mp4',
        // }]
        return `https://seenhaus.mypinata.cloud/ipfs/QmT2AMW6HEfgbwtftmCAfVnCKyjXkMwRfWMys23nyfhKZr`;
      }
    },
    getCollectionDescription(collectionName) {
      if(collectionName === '420') {
        return 'In collab with $FMHS @420 and SEEN.HAUS, delight in 5 dope limited edition NFT+physical hoodies by 5 dank cryptoartists. Each artist celebrates the season with original art on super soft streetwear swag.';
      }
    }
  },
  setup(props) {

    const { darkMode, setDarkMode } = useDarkMode();

    const { meta } = useMeta({
      title: "Drops",
    });
    const router = useRouter();
    const route = useRoute();

    if(['420'].indexOf(route.params["collectionName"]) > -1) {
      setTimeout(() => {
        setDarkMode(true);
      }, 200)
    }

    onUnmounted(() => {
      setDarkMode(false);
    })

    const state = reactive({
      collectionName: slugToTitleCase(route.params["collectionName"]),
    });

    watchEffect(() => {
      if(route.params["collectionName"] !== state.collectionName) {
        state.collectionName = slugToTitleCase(route.params["collectionName"]);
      }
    })

    const filterAuctions = ref(true);
    const filterEditions = ref(true);

    const paginatedCollectables = useDropsWithPagination(12, { collectionName: route.params["collectionName"] });
    const listOfCollectables = computed(
      () => paginatedCollectables.listOfCollectables.value
    );
    const hasMore = computed(() => paginatedCollectables.hasMore.value);

    paginatedCollectables.load();

    const handleLoadMore = async () => {
      paginatedCollectables.loadMore();
    };

    const handleAuctionsToggle = (event) => {
      if (!filterEditions.value && !event) return;
      filterAuctions.value = event;
      paginatedCollectables.filter(filterAuctions.value, filterEditions.value);
    }

    const handleEditionsToggle = (event) => {
      if (!filterAuctions.value && !event) return;
      filterEditions.value = event;
      paginatedCollectables.filter(filterAuctions.value, filterEditions.value);
    }
    const navigateToCollectable = function (slug, isSlugFullRoute, version) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      } else {
        if(version === 1 || version === 2) {
          router.push({
            name: "collectableDropV2",
            params: { slug: slug },
          });
        } else if (version === 3) {
          router.push({
            name: "collectableDropV3",
            params: { slug: slug },
          });
        }
      }
    };

    const openModal = (type, url, useHiRes = false) => {
      const lightbox = GLightbox({
          plyr: {
            config: {
              loop: {active: true},
            }
          },
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
      });

      const lightBoxElements = [{
          'href': url,
          'type': 'video',
          'source': 'local', //vimeo, youtube or local
      }];

      lightbox.setElements(lightBoxElements)

      lightbox.open();
    };

    return {
      state,
      filterAuctions,
      filterEditions,
      handleAuctionsToggle,
      handleEditionsToggle,

      listOfCollectables,
      hasMore,
      handleLoadMore,
      navigateToCollectable,
      openModal,

      darkMode,
    };
  },
};
</script>

<style scoped lang="scss">
  .abstract-circles-drops {
    top: 100px;
    @screen lg {
      right: 35px;
    }
  }
  .trailer-container {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>

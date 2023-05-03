<template>
  <container class="section-featured-auctions relative pt-10 pb-10">
      <div class="abstract-circles" :style="{
          'left': '-274px',
          'top': '77px'
        }">
        <img src="@/assets/images/abstract-circles.svg" alt="">
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-5">
        <div class="flex-center-align-top flex-col">
          <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hello SEEN community!<br><br>We have some important updates to share about the future of SEEN HAUS. Firstly, we want to assure you that the SEEN IPFS infra will remain up and running indefinitely, so all SEEN NFTs will remain intact even after closing <a href="https://t.co/fjWCrgf8kj">https://t.co/fjWCrgf8kj</a> <a href="https://t.co/XPaX3QTVh1">pic.twitter.com/XPaX3QTVh1</a></p>&mdash; seen.haus (@seen_haus) <a href="https://twitter.com/seen_haus/status/1607347122822578176?ref_src=twsrc%5Etfw">December 26, 2022</a></blockquote>
        </div>
        <div class="flex-center-align-top flex-col">
          <blockquote class="twitter-tweet"><p lang="en" dir="ltr">The swap page to exchange SEEN for PRO tokens is officially live!<a href="https://t.co/EvB8DyyYPL">https://t.co/EvB8DyyYPL</a><br><br>Please refer to our pinned tweet or jump in Telegram if you have any questions</p>&mdash; seen.haus (@seen_haus) <a href="https://twitter.com/seen_haus/status/1606434918589939712?ref_src=twsrc%5Etfw">December 23, 2022</a></blockquote>
          <blockquote class="twitter-tweet"><p lang="en" dir="ltr">1/ We&#39;re always looking for ways to innovate and push the boundaries of what&#39;s possible. Our overall goal is to drive innovation and our vision of the future of real estate technology to the next level.<br><br>We&#39;re thrilled to announce that we&#39;ve joined forces with <a href="https://twitter.com/seen_haus?ref_src=twsrc%5Etfw">@seen_haus</a> <a href="https://t.co/6QPRZNFgSA">pic.twitter.com/6QPRZNFgSA</a></p>&mdash; Propy (@PropyInc) <a href="https://twitter.com/PropyInc/status/1605311740433924096?ref_src=twsrc%5Etfw">December 20, 2022</a></blockquote>
        </div>
      </div>
    </container>
</template>

<script>
import {computed} from "vue";
import { useRouter } from "vue-router";
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import IconSquare from "@/components/IconSquare.vue";
import ProductCardV3 from "@/components/ProductCardV3.vue";
import ProductCardV3Placeholder from "@/components/ProductCardV3Placeholder.vue";
import CommonTitle from "@/components/CommonTitle.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import UserCard from "@/components/UserCard.vue";
import HeroAuction from "./components/HeroAuction.vue";
import PaneLink from "@/components/PaneLink.vue";
import useDarkMode from "@/hooks/useDarkMode";
import useDropsWithPagination from "@/hooks/useDropsWithPagination.js";
import useHeroCollectable from "@/hooks/useHeroCollectable.js";
import useArtistsWithPagination from "@/hooks/useArtistsWithPagination.js";

export default {
  name: "Home",
  components: {
    HeroAuction,
    Container,
    CommonTitle,
    ProductCardV3,
    ProductCardV3Placeholder,
    ArtistCard,
    SubTitle,
    LightTypography,
    IconSquare,
    PaneLink,
    UserCard,
  },
  setup() {
    const { meta } = useMeta({
      title: "Home",
    });
    const router = useRouter();
    const { darkMode } = useDarkMode();

    const heroCollectableApi = useHeroCollectable();
    const heroCollectable = computed(() => heroCollectableApi?.heroCollectable?.value);
    
    const paginatedLiveCollectables = useDropsWithPagination(7, {excludeEnded: true, excludeComingSoon: true}); // Use 7 in case one of them is the hero listing
    const paginatedEndedCollectables = useDropsWithPagination(7, {excludeLive: true}); // Use 7 in case one of them is the hero listing

    const listOfLiveCollectables = computed(
      // Uncomment if hero should be excluded from live list
      // () => paginatedCollectables.listOfCollectables.value.filter(item =>  item && !item.featured_drop).slice(0,6) // Limit to 6 items
      () => paginatedLiveCollectables.listOfCollectables.value.slice(0,6) // Limit to 6 items
    );

    const listOfEndedCollectables = computed(
      // Uncomment if hero should be excluded from ended list
      // () => paginatedCollectables.listOfCollectables.value.filter(item =>  item && !item.featured_drop).slice(0,6) // Limit to 6 items
      () => paginatedEndedCollectables.listOfCollectables.value.slice(0,6) // Limit to 6 items
    );

    paginatedLiveCollectables.load();
    paginatedEndedCollectables.load();
    heroCollectableApi.load();

    const navigateToCollectable = function (slug, isSlugFullRoute, version) {
      if(isSlugFullRoute) {
        router.push({
          name: slug,
        });
      }else{
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

    const navigateToCollection = function (slug) {
      router.push({
          name: 'collection',
          params: {
            collectionName: slug
          }
      });
    }

    const paginatedArtists = useArtistsWithPagination();
    const listOfArtists = computed(() => paginatedArtists.listOfArtists.value);

    paginatedArtists.load();

    return {
      heroCollectable,
      listOfLiveCollectables,
      listOfEndedCollectables,
      listOfArtists,
      navigateToCollectable,
      navigateToCollection,
      darkMode,
    };
  },
};
</script>

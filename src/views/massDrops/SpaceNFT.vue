<template>
  <mass-drop :drop="drop"></mass-drop>
</template>

<script>
import { useMeta } from "vue-meta";

import MassDrop from "@/views/massDrops/MassDrop.vue";

export default {
  name: "SpaceNFT",
  components: {
    MassDrop
  },
  setup() {
    const { meta } = useMeta({
      title: "Space NFT",
    });
    const drop = {
      metaTitle: "Space NFT",
      dropTitle: "Space NFT",
      artistSlug: 'jisbar',
      bundleChildId: 'jisbar-space',
      gridWidth: 4,
      artistId: 29,
      numberOfItems: 40,
      buttons: [
          {
              class: "button dark mr-0 mb-4 lg:mr-4 lg:mb-0 w-full lg:w-auto",
              displayText:"More About the Launch",
              url: "https://seen-haus.medium.com/seen-drop-jisbar-911ee32f732a",
              image: "fas fa-file-pdf mr-2 text-xl icon-left text-white"
          },
          {
              class: "button discord w-full lg:w-auto",
              displayText: "Discuss on Discord",
              url: "https://discord.com/invite/dad8J4f",
              image: "fab fa-discord mr-2 text-xl icon-left text-white"
          }],
      tags: [
              {class: "bg-fence-light self-end text-gray-400 font-semibold mr-1 my-2", text:"EDITION 40/40"},
              {class: "bg-tag-nft mr-1 text-white my-2", text:"NFT"},
              {class: "bg-tag-tangible text-white my-2", text: "PHYSICAL"}],
      phases: [
        [55, 57, 63, 66, 71, 74, 77, 85, 87, 88, 89, 90, 93],
        [61, 62, 64, 70, 76, 82, 84, 86, 91, 92, 94, 95, 96],
        [56, 58, 59, 60, 65, 67, 72, 73, 75, 78, 80, 81, 83]
      ],
      reservedId: 68,
      reservedTitleOverride: 'RESERVED FOR BEEPLE',
      artistStatement: "Make NFT History",
      artistText: "Jisbar will be adventuring towards space for a second time and to accomplish another historic milestone: this time, in collaboration with SEEN HAUS, he will be sending the very first NFT-backed painting into space. Space NFT is a portrait of renowned digital artist Beeple, depicted with the reflection of the galaxy on the lenses of his eyeglasses. The overlapping motifs such as the Alien Cryptopunk, the $DOGE shiba inu, and Bitcoin hero Elon Musk are welcome nods of respect towards the loyal crypto community.",
      videoUrl: "https://www.youtube.com/embed/oNdIXBrgz4M",
      // faq: [
      //     {question: "Q1", answer: "<p>A1 <br> :)</p>"},
      //     {question: "Q2", answer: "A2"},
      //     {question: "Q3", answer: "A3"},
      //     {question: "Q4", answer: "A4"},
      //     {question: "Q5", answer: "A5"},
      //     ]
    };
    return {
      drop
    };
  }
};
</script>

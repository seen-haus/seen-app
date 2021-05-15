<template>
  <mass-drop :drop="drop"></mass-drop>
</template>

<script>
import { useMeta } from "vue-meta";
import MassDrop from "@/views/massDrops/MassDrop.vue";

export default {
  name: "Spaaaaace",
  components: {
    MassDrop
  },
  setup() {
    const { meta } = useMeta({
      title: "Space NFT",
    });
    const drop = {
      metaTitle: "Spaace",
      dropTitle: "Space NFT",
      artistSlug: 'jisbar',
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
              {class: "bg-tag-tangible text-white my-2", text: "TANGIBLE"}],
      artistStatement: "Be Part of History",
      artistText: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum.",
      videoUrl: "https://www.youtube.com/embed/1G5caDyf-kA",
      faq: [
          {question: "Q1", answer: "<p>A1 <br> :)</p>"},
          {question: "Q2", answer: "A2"},
          {question: "Q3", answer: "A3"},
          {question: "Q4", answer: "A4"},
          {question: "Q5", answer: "A5"},
          ]
    };
    return {
      drop
    };
  }
};
</script>

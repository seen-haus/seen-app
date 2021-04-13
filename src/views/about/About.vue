<template>
  <div>
    <container class="section-featured-auctions pb-36">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Seen Haus</fenced-title
        >
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        seen.haus is merging the digital and physical worlds through
        non-fungible token (NFT) and tangible product auctions.
      </div>

      <div class="video-container overflow-hidden justify-center my-12 mb-32">
        <div class="relative mx-auto max-w-full lg:max-w-screen-md">
          <media-loader
            src="https://www.youtube.com/embed/I6BcTbTDWHc?controls=0&modestbranding"
            aspectRatio="56.25%"
            controls
            class="overflow-hidden rounded-3xl"
          />
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24 text-center lg:text-left"
      >
        <img
          src="@/assets/images/thrustworthiness.jpg"
          alt="thrustworthiness"
          width="500"
          height="500"
          class="rounded-3xl mx-auto"
        />

        <div class="flex flex-col items-strech justify-center">
          <div class="text-4xl font-title font-bold mb-6">Thrustworthiness</div>
          <div class="description text-gray-700 text-lg">
            We have created a trustworthy and on-trend exchange platform for
            buyers and sellers of limited edition physical and digital
            artworks.This relationship between digital and physical assets is
            established by a specifically generated QR code. The QR code
            permanently links the tangible asset to the minted NFT through the
            use of blockchain technology.
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24 text-center lg:text-right"
      >
        <img
          src="@/assets/images/authenticity.jpg"
          alt="authenticity"
          width="500"
          height="500"
          class="rounded-3xl mx-auto lg:order-1"
        />

        <div class="flex flex-col items-strech text-left justify-center">
          <div class="text-4xl font-title font-bold mb-6">Authenticity</div>
          <div class="description text-left text-gray-700 text-lg">
            seen.haus’s Certificate of Authenticity (CoA) is unique and
            inscribed with blockchain details specific to the item that has been
            purchased. <br><br> Our CoA ensures that the buyer is given a physical proof
            of ownership and authenticity upon transaction. This CoA is deep
            letter pressed and embossed, presented in a genuine leather box.
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24 text-center lg:text-left"
      >
        <img
          src="@/assets/images/seen.jpg"
          alt="seen"
          width="500"
          height="500"
          class="rounded-3xl mx-auto"
        />

        <div class="flex flex-col items-strech justify-center">
          <div class="text-4xl font-title font-bold mb-6">$SEEN Token</div>
          <div class="description text-gray-700 text-lg">
            Seen.haus is governed by the $SEEN token which is designed to help
            curate and guide the future of project. $SEEN holders will have a
            say in seen.haus collaborations, drops, auction styles, and much
            more. <br><br> The $SEEN token can be purchased <a href="#" class="text-green-500">here</a>.
          </div>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import { useMeta } from "vue-meta";

export default {
  name: "About",
  components: {
    Container,
    FencedTitle,
    MediaLoader,
  },
  setup() {
    const { meta } = useMeta({
      title: "About seen.haus",
    });
  },
};
</script>

<style scoped>
</style>

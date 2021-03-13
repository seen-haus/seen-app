<template>
  <div>
    <container class="section-featured-auctions pb-36">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >About seen.haus</fenced-title
        >
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        seen.haus is merging the digital and physical worlds through
        non-fungible token (NFT) and tangible product auctions.
      </div>

      <how-to-video class="my-12 mb-32"></how-to-video>

      <template v-for="(item, index) in 3" :key="item">
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24 text-center"
          :class="[index % 2 === 1 ? 'lg:text-right' : 'lg:text-left']"
        >
          <img
            src="http://placekitten.com/24/24"
            alt=""
            width="500"
            height="500"
            class="rounded-3xl mx-auto"
            :class="{ 'lg:order-1': index % 2 === 1 }"
          />

          <div class="flex flex-col items-strech justify-center">
            <div class="text-4xl font-title font-bold mb-6">
              Thrustworthiness
            </div>
            <div class="description text-gray-500 text-lg">
              We have created a trustworthy and on-trend exchange platform for
              buyers and sellers of limited edition physical and digital
              artworks.This relationship between digital and physical assets is
              established by a specifically generated QR code. The QR code
              permanently links the tangible asset to the minted NFT through the
              use of blockchain technology.
            </div>
          </div>
        </div>
      </template>
    </container>

    <div class="quotes bg-background-gray max-h-56">
      <container class="flex justify-center">
        <quote class="centered-quote" />
      </container>
    </div>
  </div>
</template>

<script>
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import HowToVideo from "@/components/HowToVideo.vue";
import Quote from "@/components/Quote.vue";

export default {
  name: "About",
  components: {
    Container,
    FencedTitle,
    HowToVideo,
    Quote,
  },
};
</script>

<style scoped>
</style>

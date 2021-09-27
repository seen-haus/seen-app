<template>
  <div class="background-square top-container-height">
    <div class="container mx-auto px-6 md:px-8">
      <div class="abstract-circles abstract-circles-about">
        <img src="@/assets/images/abstract-circles.svg" alt="" />
      </div>
      <div class="abstract-circles abstract-circles-two">
        <img src="@/assets/images/abstract-circles.svg" alt="" />
      </div>
      <div class="abstract-circles abstract-circles-three">
        <img src="@/assets/images/abstract-circles.svg" alt="" />
      </div>

      <div class="flex items-center py-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pb-1 pt-12"
          color="fence-dark"
          text-align="center"
        >
          About <span class="text-gradient">Seen Haus</span>
        </unfenced-title>
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        <light-typography>
          Seen.haus is merging the digital and physical worlds through
          non-fungible token (NFT) and tangible product auctions.
        </light-typography>
      </div>

      <div class="video-position video-container overflow-hidden justify-center mt-8">
        <div class="relative mx-auto max-w-full lg:max-w-screen-md">
          <media-loader
            src="https://www.youtube.com/embed/I6BcTbTDWHc"
            aspectRatio="56.25%"
            controls
            class="shadow-container overflow-hidden rounded-20px"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-6 sm:py-6 md:px-8 md:py-8 lg:py-14">
    <div>
      <div
        class="
          grid grid-cols-1
          lg:grid-cols-2
          gap-24
          lg:gap-24
          md:gap-2
          sm:gap-6
          lg:mt-60
          md:mt-50
          sm:mt-28
          text-center
          lg:text-left
        "
      >
        <img
          src="@/assets/images/trustworthiness.png"
          alt="trustworthiness"
          width="500"
          height="500"
          class="rounded-20px mx-auto"
        />

        <div class="flex flex-col items-strech justify-center">
          <div class="heading-align text-4xl font-title font-bold mb-6">Trustworthiness</div>
          <div class="description text-gray-700 text-lg">
            <light-typography textAlign="left">
              We have created a trustworthy and on-trend exchange platform for
              buyers and sellers of limited edition physical and digital
              artworks.This relationship between digital and physical assets is
              established by a specifically generated QR code. The QR code
              permanently links the tangible asset to the minted NFT through the
              use of blockchain technology.
            </light-typography>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="background-square">
    <div class="container mx-auto px-6 sm:pb-6 sm:pt-8 md:px-8 md:pt-10 md:pb-8 lg:py-16">
      <div
        class="
          grid grid-cols-1
          lg:grid-cols-2
          lg:gap-24
          sm:gap-8
          text-center
          lg:text-right
        "
      >
        <img
          src="@/assets/images/authenticity.jpg"
          alt="authenticity"
          width="500"
          height="500"
          class="rounded-20px mx-auto lg:order-1"
        />

        <div class="flex flex-col items-strech text-left justify-center">
          <div class="text-4xl font-title font-bold mb-6">Authenticity</div>
          <div class="description text-left text-gray-700 text-lg">
            <light-typography textAlign="left">
              seen.haus’s Certificate of Authenticity (CoA) is unique and
              inscribed with blockchain details specific to the item that has been
              purchased. <br /><br />
              Our CoA ensures that the buyer is given a physical proof of
              ownership and authenticity upon transaction. This CoA is deep letter
              pressed and embossed, presented in a genuine leather box.
            </light-typography>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mx-auto px-6 sm:py-8 md:px-8 md:py-10 lg:py-16">
    <div>
      <div
        class="
          grid grid-cols-1
          lg:grid-cols-2
          lg:gap-24
          sm:gap-8
          text-center
          lg:text-left
        "
      >
        <img
          src="@/assets/images/seen.jpg"
          alt="seen"
          width="500"
          height="500"
          class="rounded-20px mx-auto"
        />

        <div class="flex flex-col items-strech justify-center">
          <div class="heading-align text-4xl font-title font-bold mb-6">$SEEN Token</div>
          <div class="description text-gray-700 text-lg">
            <light-typography textAlign="left">
              Seen.haus is governed by the $SEEN token which is designed to help
              curate and guide the future of project. $SEEN holders will have a
              say in seen.haus collaborations, drops, auction styles, and much
              more.
              <br /><br />
              The $SEEN token can be purchased
              <a
                href="https://app.sushi.com/swap?outputCurrency=0xca3fe04c7ee111f0bbb02c328c699226acf9fd33"
                class="green-link"
                target="_blank"
              >
                here </a
              >.
            </light-typography>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";
import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "../../components/LightTypography.vue";

export default {
  name: "About",
  components: {
    Container,
    MediaLoader,
    UnfencedTitle,
    LightTypography,
  },
  setup() {
    const { meta } = useMeta({
      title: "About",
    });
  },
};
</script>

<style scoped lang="scss">
.background-square {
  background: #ebeef2;
}

.top-container-height {
  @screen sm {
    height: 387px;
  }
  @screen md {
    height: 491px;
  }
  @screen lg {
    height: 495px;
  }
}

.video-container {
  @screen sm {
    padding: 25px;
  }
  @screen md {
    padding: 25px;
  }
  @screen lg {
    padding-bottom: 25px;
  }
}

.video-position {
  position: relative;
}

.heading-align {
  @screen sm {
    text-align: left;
  }
  @screen md {
    text-align: left;
  }
}

.text-gradient {
  background: -webkit-linear-gradient(0deg, #11998e 1.74%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #26c785;
}

.abstract-circles-about {
  top: 425px;
  right: 97px;
}

.abstract-circles-two {
  top: 1025px;
  left: 350px;
}

.abstract-circles-three {
  top: 2050px;
  left: 1px;
}

.shadow-container {
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
}
</style>
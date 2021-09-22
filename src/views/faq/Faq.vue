<template>
  <div class="faqs">
    <container class="section-featured-auctions pb-12">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pb-1 pt-12"
          color="fence-dark"
          text-align="center"
        >
          FAQ
        </unfenced-title>
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        <light-typography>
          You got questions? We got the answers.
        </light-typography>
      </div>

      <div class="faq-list pt-14 pb-7">
        <collapsible-tile class="mx-auto mb-6" title="What is seen.haus?">
          <light-typography textAlign="left">
            seen.haus is an innovative auction house of the future that’s
            merging the physical and digital worlds of art.
          </light-typography>
          <br />
          <light-typography textAlign="left">
            Each physical collectible sold through our platform is paired with a
            digital version that provides an exclusive record of ownership.
          </light-typography>
          <light-typography textAlign="left">
            Please watch this video
            <a
              href="https://www.youtube.com/watch?v=I6BcTbTDWHc"
              class="green-link"
              target="_blank"
              >here</a
            >
            for more clarity.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="Who is in the team?">
          <light-typography textAlign="left">
            The seen.haus team is a unique blend of designers, developers, and
            marketers who have extensive experience both in the traditional and
            digital art scene.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="How do I bid on an item?">
          <light-typography textAlign="left">Navigate to the live drops page.</light-typography>
          <light-typography textAlign="left">
            Select an item that catches your eye and enter an amount higher than
            the previous bid.
          </light-typography>
          <light-typography textAlign="left">You’ll be prompted to sign the transaction in MetaMask.</light-typography>
          <light-typography textAlign="left">
            Be sure to stay online to check that you haven’t been outbid. It may
            be a nail biter.
          </light-typography>
          <light-typography textAlign="left">
            Please watch this video
            <a
              href="https://www.youtube.com/watch?v=1G5caDyf-kA"
              class="green-link"
              target="_blank"
              >here</a
            >
            for more clarity.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="What happens when I win?">
          <light-typography textAlign="left">
            After you win an NFT will automatically be sent to your ETH address.
          </light-typography>
          <light-typography textAlign="left">
            You will then be prompted to create an account on seen.haus and a
            team member will then reach out to coordinate shipping your physical
            item.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="When will I get my item?">
          <light-typography textAlign="left">
            All physical items are eligible for worldwide expedited and insured
            shipping. You can expect to receive your winnings 30 days after
            the auction ends.
            Please keep in mind it may take longer due to COVID restrictions in certain countries.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="What is the $SEEN token?">
          <light-typography textAlign="left">
            Seen.haus is governed by the $SEEN token which is designed to help
            curate and guide the future of the project.
          </light-typography>
          <light-typography textAlign="left">
            $SEEN holders will have a say in seen.haus collaborations, drops,
            auction styles, and much more.
          </light-typography>
        </collapsible-tile>

        <collapsible-tile
          class="mx-auto mb-6"
          title="How do I purchase the $SEEN token?"
        >
          <light-typography textAlign="left">You can purchase the seen.haus token on SushiSwap here:</light-typography>
          <light-typography textAlign="left">
            <a
              href="https://app.sushi.com/swap?outputCurrency=0xca3fe04c7ee111f0bbb02c328c699226acf9fd33"
              target="_blank"
              class="underline"
              >https://app.sushi.com/swap?outputCurrency=0xca3fe04c7ee111f0bbb02c328c699226acf9fd33</a
            >
          </light-typography>
        </collapsible-tile>

        <collapsible-tile
          class="mx-auto"
          title="How do I apply to have an item auctioned on seen.haus?"
        >
          <light-typography textAlign="left">
            Please send an email to
            <a
              href="mailto:seen.haus@gmail.com"
              class="green-link"
              >seen.haus@gmail.com</a
            >
            with your name and the piece of art you would like to auction
          </light-typography>
        </collapsible-tile>
      </div>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import CollapsibleTile from "./components/CollapsibleTile.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
  name: "Faqs",
  components: {
    Container,
    UnfencedTitle,
    CollapsibleTile,
    LightTypography,
  },
  setup() {
    const { meta } = useMeta({
      title: "FAQ",
    });
  }
};
</script>

<template>
  <div class="faqs">
    <container class="section-featured-auctions pb-12">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >FAQs</fenced-title
        >
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg">
        You got questions? We got the answers.
      </div>

      <div class="faq-list py-14">
        <collapsible-tile class="mx-auto mb-6" title="What is seen.haus?">
          <p>
            seen.haus is an innovative auction house of the future that’s
            merging the physical and digital worlds of art.
          </p>
          <br />
          <p>
            Each physical collectible sold through our platform is paired with a
            digital version that provides an exclusive record of ownership.
          </p>
          <p>
            Please watch this video
            <a
              href="https://www.youtube.com/watch?v=I6BcTbTDWHc"
              class="underline"
              target="_blank"
              >here</a
            >
            for more clarity.
          </p>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="Who is in the team?">
          <p>
            The seen.haus team is a unique blend of designers, developers, and
            marketers who have extensive experience both in the traditional and
            digital art scene.
          </p>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="How do I bid on an item?">
          <p>Navigate to the live drops page.</p>
          <p>
            Select an item that catches your eye and enter an amount higher than
            the previous bid.
          </p>
          <p>You’ll be prompted to sign the transaction in MetaMask.</p>
          <p>
            Be sure to stay online to check that you haven’t been outbid. It may
            be a nail biter.
          </p>
          <p>
            Please watch this video
            <a
              href="https://www.youtube.com/watch?v=1G5caDyf-kA"
              class="underline"
              target="_blank"
              >here</a
            >
            for more clarity.
          </p>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="What happens when I win?">
          <p>
            After you win an NFT will automatically be sent to your ETH address.
          </p>
          <p>
            You will then be prompted to create an account on seen.haus and a
            team member will then reach out to coordinate shipping your physical
            item.
          </p>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="When will I get my item?">
          <p>
            All physical items are eligible for worldwide expedited and insured
            shipping. You can expect to receive your winnings 10-14 days after
            the auction ends.
          </p>
        </collapsible-tile>

        <collapsible-tile class="mx-auto mb-6" title="What is the $SEEN token?">
          <p>
            Seen.haus is governed by the $SEEN token which is designed to help
            curate and guide the future of the project.
          </p>
          <p>
            $SEEN holders will have a say in seen.haus collaborations, drops,
            auction styles, and much more.
          </p>
        </collapsible-tile>

        <collapsible-tile
          class="mx-auto mb-6"
          title="How do I purchase the $SEEN token?"
        >
          <p>You can purchase the seen.haus token on SushiSwap here:</p>
          <p>
            <a
              href="https://sushiswap.fi/pair/0xc5fa164247d2f8d68804139457146efbde8370f6"
              target="_blank"
              class="underline"
              >https://sushiswap.fi/pair/0xc5fa164247d2f8d68804139457146efbde8370f6</a
            >
          </p>
        </collapsible-tile>

        <collapsible-tile
          class="mx-auto mb-6"
          title="Do I receive $SEEN when winning an item?"
        >
          <p>
            Yes, all auction winners will receive $SEEN as a part of our auction
            bid token mining program.
          </p>
        </collapsible-tile>

        <collapsible-tile
          class="mx-auto mb-6"
          title="How do I apply to have an item auctioned on seen.haus?"
        >
          <p>
            Please send an email to
            <a href="mailto:seen.haus@gmail.com" class="underline"
              >seen.haus@gmail.com</a
            >
            with your name and the piece of art you would like to auction
          </p>
        </collapsible-tile>
      </div>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";
import CollapsibleTile from "./components/CollapsibleTile.vue";

export default {
  name: "Faqs",
  components: {
    Container,
    FencedTitle,
    CollapsibleTile,
  },
  setup() {
    const { meta } = useMeta({
      title: "FAQ",
    });
  }
};
</script>

<style scoped>
</style>

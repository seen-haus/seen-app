<template>
  <div class="single-edition">
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Breaking ETH</fenced-title
        >

        <div class="status flex justify-center items-center">
          <user-badge type="light" />
          <div class="tags flex mx-9">
            <tag
              class="bg-fence-light self-end text-gray-400 font-semibold mr-1"
              >EDITION 1/1</tag
            >
            <tag class="bg-tag-nft mr-1 text-white">NFT</tag>
            <tag class="bg-tag-tangible text-white">TANGIBLE</tag>
          </div>
          <live-indicator status="live">LIVE</live-indicator>
        </div>
      </div>
    </container>

    <div
      class="galery h-96 bg-gray-400 text-white flex justify-center items-center mb-8"
    >
      GALERY HERE :P
    </div>

    <container>
      <div class="flex flex-col lg:grid grid-cols-12 gap-12 py-6">
        <div class="left-side col-span-7 py-6">
          <fenced-title
            class="text-black flex lg:hidden mt-6"
            color="fence-dark"
            text-align="center"
            :closed="true"
            ><span class="flex-shrink-0">Breaking ETH</span></fenced-title
          >

          <fenced-title
            class="text-black hidden lg:flex"
            color="fence-dark"
            text-align="left"
            :closed="true"
            ><span class="flex-shrink-0">Breaking ETH</span></fenced-title
          >

          <div class="text-lg text-gray-500 mt-6">
            Crypto is the new commodity. Like oil or gas or gold. Ethereum makes
            the whole space go. This piece is based in that theory when it all
            goes down and In Case of Bankruptcy - break glass and you have
            Ethereum.
          </div>

          <div class="text-4xl font-title font-bold mt-14 mb-6">
            Artist statement
          </div>
          <artist-card class="shadow-md" />

          <div class="text-4xl font-title font-bold mt-14 mb-6">
            Additional Information
          </div>

          <div class="rounded-container mb-6">
            <div class="text-3xl font-title font-bold mb-4">
              Tangible + Digital
            </div>

            <div class="text-gray-500">
              Auction winners will receive both a physical version of the
              artwork as well as a digital representation in the form of an NFT.
            </div>
          </div>

          <div class="rounded-container flex">
            <i
              class="fas fa-truck text-3xl icon-right text-gray-500 mr-6"
            ></i>

            <div class="text-sm font-bold">
              All winners will be required to submit their contact information
              for shipping purposes after the auction ends.
            </div>
          </div>
        </div>

        <div class="right-side col-span-5">
          <bid-card />

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Recent Buyers
          </div>

          <list-of-buyers class="mb-12"/>

          <button class="button dark w-full">
            <i class="fas fa-play-circle mr-2 text-xl icon-left text-white"></i>

            Learn How To Buy
          </button>

          <div class="text-sm text-gray-400 text-center mt-2">
            Explanation video will appear in a pop-up
          </div>

          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Proof of Authenticity
          </div>

          <div class="rounded-container">
            <button class="button outline w-full">
              View on Etherscan
              <i
                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <button class="button outline w-full mt-6">
              View on IPFS
              <i
                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <button class="button outline w-full mt-6">
              View on OpenSea
              <i
                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </container>
  </div>
</template>


<script>
import FencedTitle from "@/components/FencedTitle.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import Container from "@/components/Container.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import BidCard from "@/components/BidCard.vue";
import ListOfBuyers from "@/components/Lists/ListOfBuyers.vue";

export default {
  name: "SingleEdition",
  components: {
    FencedTitle,
    Container,
    UserBadge,
    Tag,
    LiveIndicator,
    ArtistCard,
    BidCard,
    ListOfBuyers,
  },
};
</script> 
    Container
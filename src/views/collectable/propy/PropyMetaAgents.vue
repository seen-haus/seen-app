<template>
  <div>
    <container class="section-featured-auctions hero-banner-meta-agents pb-12" style="overflow: hidden">
      <img class="meta-agent-hero-dots" src="@/assets/images/propy-meta-agent-bg-dots.svg" alt="">
      <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 mt-5"
          style="padding-top: 45px;margin-bottom: 20px;z-index: 1;"
        >
        <div class="flex items-center pb-6 flex-col lg:flex-row">
          <div>
            <common-title
              class="flex-grow pb-1 mb-2"
              color="fence-light"
              textAlign="left"
              fontSize="4rem"
              lineHeight="5rem"
              :closed="false"
            >
              Meta Agents<br/>& Shredders
            </common-title>
            <light-typography 
              textAlign="left"
              fontSize="1.6rem"
              lineHeight="40px"
              paddingBottom="6px"
            >
              Exclusive NFT Avatars for Real Estate and Metaverse Fans
            </light-typography>
          </div>
        </div>
        <div>
          <img class="meta-agent-previews" src="@/assets/images/propy/pfp-previews.png" alt="">
        </div>
      </div>
    </container>
    <div class="content-zone">
      <container>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 mt-5"
          style="padding-top: 45px;margin-bottom: 20px;"
        >
          <div>
            <div class="info-box">
              <div style="display: flex;align-items: center; margin-bottom: 16px">
                <img style="margin-right: 16px" src="@/assets/images/propy/natalia.png"/>
                <div>
                  <common-title
                    class="flex-grow mb-2"
                    color="fence-light"
                    textAlign="left"
                    fontSize="24px"
                    lineHeight="36px"
                    :closed="false"
                  >
                    Natalia Karayaneva
                  </common-title>
                  <light-typography 
                    textAlign="left"
                    fontSize="20px"
                    lineHeight="36px"
                    paddingBottom="0px"
                  >
                    CEO at Propy
                  </light-typography>
                </div>
              </div>
              <light-typography 
                textAlign="left"
                fontSize="20px"
                lineHeight="32px"
                paddingBottom="0px"
                color="black"
              >
                “PFPs are a great way to enter the meta world. When the utility of PFPs are connected to the real world and education, magic happens.”
              </light-typography>
            </div>
            <div class="info-box">
              <div style="display: flex;align-items: center; margin-bottom: 16px">
                <img style="margin-right: 16px" src="@/assets/images/propy/tom.png"/>
                <div>
                  <common-title
                    class="flex-grow mb-2"
                    color="fence-light"
                    textAlign="left"
                    fontSize="24px"
                    lineHeight="36px"
                    :closed="false"
                  >
                    Tom Ferry
                  </common-title>
                  <light-typography 
                    textAlign="left"
                    fontSize="20px"
                    lineHeight="36px"
                    paddingBottom="0px"
                  >
                    #1 Real estate coach
                  </light-typography>
                </div>
              </div>
              <light-typography 
                textAlign="left"
                fontSize="20px"
                lineHeight="32px"
                paddingBottom="0px"
                color="black"
              >
                “Many agents and real estate investors are investing in crypto and NFTs. As more home buyers utilize crypto earnings to purchase property, displaying an avatar immediately identifies these agents as someone who understands how cryptocurrency and NFTs work”.
              </light-typography>
            </div>
          </div>
          <div>
            <!-- <div  class="info-box" style="height: calc(100% - 32px);display: flex;justify-content: center;align-items: center"> -->
              <BidCardVRFv3
                v-if="collectable && collectable.id"
                :isPropySale="true"
                :status="liveStatus"
                :collectable="collectable"
                :startsAt="currentStartsAt"
                :minimumStartsAt="currentMinimumStartsAt"
                :endsAt="currentEndsAt"
                :isAuction="isAuction"
                :numberOfBids="events.length"
                :isOpenEdition="isOpenEdition"
                :isVRFSale="isVRFSale"
                :hasRequestedVRF="hasRequestedVRF"
                :hasFulfilledVRF="hasFulfilledVRF"
                :hasCommittedVRF="hasCommittedVRF"
                :itemsBought="itemsBought"
                :edition="edition"
                :edition_of="edition_of"
                :items="items"
                :items_of="itemsOf"
                :price="price"
                :priceUSD="priceUSD"
                :progress="progress"
                :is_sold_out="is_sold_out"
                :is_closed="is_closed"
                :isCollectableActive="isCollectableActive"
                :isUpcomming="isUpcomming"
                :nextBidPrice="nextBidPrice"
                :claim="claim"
                :customPaymentTokenName="customPaymentTokenName"
                :customPaymentTokenSymbol="customPaymentTokenSymbol"
                :customPaymentTokenAddress="customPaymentTokenAddress"
                :customPaymentTokenDecimals="customPaymentTokenDecimals"
                :customPaymentTokenCoingeckoId="customPaymentTokenCoingeckoId"
                :requireAdminCommitVRF="true"
                @update-state="updateCollectableState"
            />
            <!-- </div> -->
          </div>
        </div>
      </container>
      <container>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10"
          style="padding-top: 15px;margin-bottom: 25px;"
        >
          <div>
            <common-title
              class="flex-grow mb-2"
              color="fence-light"
              textAlign="left"
              fontSize="36px"
              lineHeight="36px"
              :closed="false"
            >
              NFT Avatars
            </common-title>
            <light-typography 
              textAlign="left"
              fontSize="20px"
              lineHeight="36px"
              paddingBottom="10px"
            >
              Propy Offers The First NFT Avatars Designed Specifically for Real Estate and Metaverse Fans
            </light-typography>
            <div class="info-box">
              <div style="display: flex;align-items: center; margin-bottom: 16px">
                <img style="margin-right: 16px" src="@/assets/images/propy/dan.png"/>
                <div>
                  <common-title
                    class="flex-grow mb-2"
                    color="fence-light"
                    textAlign="left"
                    fontSize="24px"
                    lineHeight="36px"
                    :closed="false"
                  >
                    Dan Weinstein
                  </common-title>
                  <light-typography 
                    textAlign="left"
                    fontSize="20px"
                    lineHeight="36px"
                    paddingBottom="0px"
                  >
                    Artist
                  </light-typography>
                </div>
              </div>
              <light-typography 
                textAlign="left"
                fontSize="20px"
                lineHeight="32px"
                paddingBottom="10px"
                color="black"
              >
                “These characters are THE RESISTANCE – shredding through the Metaverse, re-inventing the New Future. The meta world created by the agents of change – fair, honest and empowering.”
              </light-typography>
              <light-typography 
                textAlign="left"
                fontSize="20px"
                lineHeight="32px"
                paddingBottom="0px"
                fontWeight="300"
              >
                Created as “utility” NFTs (meaning that bonus items beyond the avatar are included in the purchase), limited edition NFTs designed by artist Dan Weinstein will also include passes to select Propy events and educational courses.
              </light-typography>
            </div>
          </div>
          <div>
            <common-title
              class="flex-grow mb-2"
              color="fence-light"
              textAlign="left"
              fontSize="36px"
              lineHeight="36px"
              :closed="false"
            >
              Major Community IRL Events
            </common-title>
            <light-typography 
              textAlign="left"
              fontSize="20px"
              lineHeight="36px"
              paddingBottom="10px"
            >
              Upcoming events that you can visit in the United States. Do not miss!
            </light-typography>
            <div class="info-box-event-map">
              <img style="margin-left: -1px" src="@/assets/images/propy/event-map-new.svg"/>
            </div>
          </div>
        </div>
      </container>
      <container>
        <common-title
          class="flex-grow mb-2"
          color="fence-light"
          textAlign="left"
          fontSize="36px"
          lineHeight="36px"
          paddingBottom="20px"
          :closed="false"
        >
          Meta Avatars Have 5 Utilities
        </common-title>
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10"
        >
          <div>
            <div class="info-box-utility">
              <div class="utility-number-container mb-4">
                <common-title
                  class="flex-grow"
                  color="white"
                  textAlign="center"
                  fontSize="32px"
                  lineHeight="32px"
                  :closed="false"
                >
                  1
                </common-title>
              </div>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Access to Meta Agent Course
              </common-title>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <div class="utility-number-container mb-4">
                <common-title
                  class="flex-grow"
                  color="white"
                  textAlign="center"
                  fontSize="32px"
                  lineHeight="32px"
                  :closed="false"
                >
                  2
                </common-title>
              </div>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                DAO Membership
              </common-title>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <div class="utility-number-container mb-4">
                <common-title
                  class="flex-grow"
                  color="white"
                  textAlign="center"
                  fontSize="32px"
                  lineHeight="32px"
                  :closed="false"
                >
                  3
                </common-title>
              </div>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Ticket to Web3 & Real Estate Summit
              </common-title>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <div class="utility-number-container-secret mb-4">
                <common-title
                  class="flex-grow"
                  color="#838492"
                  textAlign="center"
                  fontSize="32px"
                  lineHeight="32px"
                  :closed="false"
                >
                  4
                </common-title>
              </div>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                🔒 Secret
              </common-title>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <div class="utility-number-container-secret mb-4">
                <common-title
                  class="flex-grow"
                  color="#838492"
                  textAlign="center"
                  fontSize="32px"
                  lineHeight="32px"
                  :closed="false"
                >
                  5
                </common-title>
              </div>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                🔒 Secret
              </common-title>
            </div>
          </div>
        </div>
      </container>
      <container>
        <div
          class="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-10 mb-10"
          style="padding-top: 24px;"
        >
          <div>
            <common-title
              class="flex-grow"
              color="fence-light"
              textAlign="left"
              fontSize="36px"
              lineHeight="36px"
              :closed="false"
            >
              About Propy
            </common-title>
            <common-title
              class="flex-grow mt-5 mb-5"
              color="fence-light"
              textAlign="left"
              fontSize="32px"
              fontWeight="300"
              lineHeight="42px"
              :closed="false"
            >
              Propy, the real estate blockchain pioneer, aims to automate the real estate transaction process to make it fast, easy and secure.
            </common-title>
            <light-typography
              class="mb-8"
              textAlign="left"
              fontSize="20px"
              fontWeight="300"
              lineHeight="36px"
              paddingBottom="10px"
            >
              Propy, founded in Silicon Valley, is on a mission to revolutionize the residential real estate sales process. The company’s blockchain innovation removes inefficiencies, streamlines everything from offer to closing to recording title, records everything securely, and enables buyers and sellers to use traditional financing, dollar or cryptocurrency payments, or NFT-ed properties sales. The company has processed $4bn in transactions and recorded them on blockchain.
            </light-typography>
            <common-title
              class="flex-grow mb-5"
              color="fence-light"
              textAlign="left"
              fontSize="36px"
              lineHeight="36px"
              :closed="false"
            >
              Join Propy Groups
            </common-title>
            <a href="https://t.me/propy" target="_blank" class="btn-social">
                <i class="fab fa-telegram mr-2"></i>
            </a>
            <a href="https://twitter.com/PropyInc" target="_blank" class="btn-social">
                <i class="fab fa-twitter mr-1.5"></i>
            </a>
            <a href="https://discord.com/invite/BSpmUeBF" target="_blank" class="btn-social">
                <i class="fab fa-discord mr-2"></i>
            </a>
          </div>
        </div>
      </container>
      <container class="pb-5">
        <common-title
          class="flex-grow mb-2 mt-5"
          color="fence-light"
          textAlign="left"
          fontSize="36px"
          lineHeight="36px"
          paddingBottom="20px"
          :closed="false"
        >
          Advisors
        </common-title>
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10"
        >
          <div>
            <div class="info-box-utility">
              <img class="mb-4" style="width: 80px" src="@/assets/images/propy/dan.png"/>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Tom Ferry
              </common-title>
              <light-typography
                class="mt-1"
                textAlign="center"
                fontSize="14px"
                fontWeight="300"
              >
                #1 real estate coach
              </light-typography>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <img class="mb-4" style="width: 80px" src="@/assets/images/propy/dan.png"/>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Tony Giordano
              </common-title>
              <light-typography
                class="mt-1"
                textAlign="center"
                fontSize="14px"
                fontWeight="300"
              >
                www.giordano.global
              </light-typography>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <img class="mb-4" style="width: 80px" src="@/assets/images/propy/dan.png"/>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Zach Aarons
              </common-title>
              <light-typography
                class="mt-1"
                textAlign="center"
                fontSize="14px"
                fontWeight="300"
              >
                MetaProp
              </light-typography>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <img class="mb-4" style="width: 80px" src="@/assets/images/propy/dan.png"/>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Tony Edward
              </common-title>
              <light-typography
                class="mt-1"
                textAlign="center"
                fontSize="14px"
                fontWeight="300"
              >
                @ThinkingCrypto1
              </light-typography>
            </div>
          </div>
          <div>
            <div class="info-box-utility">
              <img class="mb-4" style="width: 80px" src="@/assets/images/propy/dan.png"/>
              <common-title
                class="flex-grow"
                textAlign="center"
                fontSize="20px"
                lineHeight="24px"
                :closed="false"
              >
                Alvaro Nunez
              </common-title>
              <light-typography
                class="mt-2"
                textAlign="center"
                fontSize="14px"
                fontWeight="300"
              >
                Super Luxury Group
              </light-typography>
            </div>
          </div>
        </div>
      </container>
    </div>
  </div>
  <div class="footer-zone">
    <img class="meta-agent-hero-dots" src="@/assets/images/propy/circle-dot-matrix.svg" alt="">
    <img class="meta-agent-hero-sliced-circle" style="opacity: 0.4;height: 80%;left: 80%" src="@/assets/images/propy/sliced-circle-blue.svg" alt="">
    <div class="flex-center flex-col" style="z-index: 1">
      <common-title
        class="flex-grow mb-2 mt-5 max-width-footer-text"
        color="white"
        textAlign="center"
        fontSize="36px"
        lineHeight="36px"
        paddingBottom="20px"
        :closed="false"
      >
        Discover more about the latest news from Propy as well as the upcoming Web3 & Real Estate Summit
      </common-title>
      <a href="https://propy.com/browse/cres/" target="_blank" rel="noopener noreferrer">
        <button
          class="cursor-pointer button blue-button"
        >
        Get Started
        </button>
      </a>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useMeta } from "vue-meta";

import CommonTitle from "@/components/CommonTitle.vue";
import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import BidCardVRFv3 from "@/components/BidCardVRFv3.vue";

import { CollectablesService } from "@/services/apiService";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";

export default {
  name: "PropyMetaAgents",
  components: {
    Container,
    UnfencedTitle,
    LightTypography,
    CommonTitle,
    BidCardVRFv3,
  },
  setup() {
    const { meta } = useMeta({
      title: "Propy Meta Agents",
    });

    const {
      collectable,
      collectableState,
      price,
      priceUSD,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isUpcomming,
      isOpenEdition,
      isVRFSale,
      itemsBought,
      hasRequestedVRF,
      hasFulfilledVRF,
      hasCommittedVRF,
      // Static
      type,
      media,
      // firstMedia,
      gallerySortedMedia,
      artist,
      artistStatement,
      title,
      description,
      events,
      startsAt,
      minimumStartsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      version,
      nextBidPrice,
      user,
      // Methods
      updateProgress,
      setCollectable,
      updateCollectableState,
      claim,
      pillOverride,
      collectionName,
      customPaymentTokenName,
      customPaymentTokenSymbol,
      customPaymentTokenAddress,
      customPaymentTokenDecimals,
      customPaymentTokenCoingeckoId,
    } = useCollectableInformation();

    const state = reactive({
      loading: true,
      contractAddress: null,
      collectable: {},
      buyersVisible: 3,
    });

    (async function loadCollectable() {
      state.loading = true;
      const slug = 'PropyMetaAgents';
      const {data} = await CollectablesService.show(slug);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      state.loading = false;
      state.collectable = data;
      state.contractAddress = data.contract_address;

      console.log({data})

      setCollectable(data);
    })();

    const currentEndsAt = computed(() => {
      return endsAt.value;
    });

    const currentStartsAt = computed(() => {
      return startsAt.value;
    });

    const currentMinimumStartsAt = computed(() => {
      return minimumStartsAt.value;
    });

    return {
      currentEndsAt,
      currentStartsAt,
      currentMinimumStartsAt,
      collectable,
      collectableState,
      price,
      priceUSD,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isUpcomming,
      isOpenEdition,
      isVRFSale,
      itemsBought,
      hasRequestedVRF,
      hasFulfilledVRF,
      hasCommittedVRF,
      // Static
      type,
      media,
      // firstMedia,
      gallerySortedMedia,
      artist,
      artistStatement,
      title,
      description,
      events,
      startsAt,
      minimumStartsAt,
      endsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      version,
      nextBidPrice,
      user,
      // Methods
      updateProgress,
      setCollectable,
      updateCollectableState,
      claim,
      pillOverride,
      collectionName,
      customPaymentTokenName,
      customPaymentTokenSymbol,
      customPaymentTokenAddress,
      customPaymentTokenDecimals,
      customPaymentTokenCoingeckoId,
    }
  }
};
</script>

<style lang="scss" scoped>
.hero-banner-meta-agents {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
}
.meta-agent-hero-dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%)translateY(-50%);
  top: 50%;
  max-width: 100%;
}
.meta-agent-hero-agent {
  position: absolute;
  left: 65%;
  transform: translateX(-50%)translateY(-50%);
  top: 50%;
  max-width: 600px;
}
.meta-agent-hero-sliced-circle {
  position: absolute;
  left: 100%;
  transform: translateX(-100%) translateY(-50%);
  top: 50%;
  max-width: 600px;
}
.meta-agent-previews {

}
.content-zone {
  background: #F7F8FA;
}
.info-box {
  background: #FFF;
  box-shadow: 0px 20px 40px 0px #0000001A;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
}
.info-box-event-map {
  background: #FFF;
  box-shadow: 0px 20px 40px 0px #0000001A;
  border-radius: 12px;
  margin-bottom: 32px;
}
.info-box-utility {
  background: #FFF;
  box-shadow: 0px 20px 40px 0px #0000001A;
  border-radius: 12px;
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  padding-top: 30px;
  height: calc(100% - 30px);
}
.utility-number-container {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F26F21;
  border-radius: 6px;
}
.utility-number-container-secret {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8384921a;
  border-radius: 6px;
}
.btn-social {
  @apply mr-5 text-sm inline-flex items-center;
  &:last-child {
    @apply mr-0;
  }
  font-size: 2.5rem;
  color: #38A6FA;
  opacity: 1;
  transition-duration: 0.2s;
}
.footer-zone {
  position: relative;
  background-color: black;
  height: 444px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.max-width-footer-text {
  max-width: 850px;
  text-shadow: 1px 1px 1px #000, 2px 2px 8px black;
}
</style>


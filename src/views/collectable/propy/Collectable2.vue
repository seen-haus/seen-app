<template>
  <div class="loading-mask" v-if="isLoading">
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
            class="flex-grow mr-0 mb-2 self-stretch"
            color="fence-gray"
            textAlign="center"
            :closed="true"
        >Loading...
        </fenced-title>
      </div>
    </container>
  </div>

  <div class="single-edition" v-else>
    <container>
      <div class="flex items-center py-6 flex-col">
        <fenced-title
            class="flex-grow mr-0 mb-2 self-stretch"
            color="fence-gray"
            textAlign="center"
            :closed="true"
        >{{ title }}
        </fenced-title>

        <div class="status flex justify-center items-center mb-5">
          <user-badge
                type="light"
                :url="artist.avatar"
                :username="pillOverride ? pillOverride : artist.name"
                :artistSlug="artist.slug"
            />
        </div>
        <div class="status flex justify-center items-center">
          <div class="tags flex flex-wrap md:flex-nowrap mr-4">
            <tag
                v-if="isAuction"
                class="bg-fence-light self-end text-gray-500 font-semibold mr-1"
            >EDITION {{ edition }}/{{ edition_of }}
            </tag>
            <tag v-if="isNft" class="bg-black mr-1 text-white">NFT</tag>
            <tag v-if="isTangible" class="bg-black text-white"
            >PHYSICAL
            </tag>
          </div>
          <live-indicator :status="liveStatus"/>
        </div>
      </div>
    </container>

    <hero-gallery :mediaResources="gallerySortedMedia"/>

    <container>
      <div class="flex flex-col lg:grid grid-cols-12 gap-12 py-6 pb-32 mt-12 md:mt-0">
        <div class="left-side col-span-7 pb-6">

          <div class="title-text font-title text-4xl font-bold mb-3">Florida – the home of the first US real estate NFT</div>

          <div class="text-lg text-gray-500 description" v-html="description"></div>

          <div class="gap-12 py-6">
            <product-video :src="video"></product-video>
          </div>
          <div class="gap-12 py-6">
            <highlights v-if="highlights" :highlights="highlights"></highlights>
          </div>

          <faq v-if="faq" :faq="faq"/>

          <div class="text-4xl font-title font-bold mt-14 mb-6">
            The NFT Creator Statement
          </div>
          <artist-card class="shadow-md" :artist="artist" :artistStatement="artistStatement"/>
        </div>

        <div class="right-side col-span-5">

          <template v-if="showAdditionalInformation">
            <!--            <div class="rounded-container flex items-center mt-12">-->
            <!--              <i-->
            <!--                  class="fas fa-truck text-3xl icon-right text-gray-500 mr-6"-->
            <!--              ></i>-->

            <!--              <div class="text-sm font-bold">-->
            <!--                The item will be shipped from Paris, France-->
            <!--              </div>-->
            <!--            </div>-->

            <div class="rounded-container flex items-center mb-6">
              <i
                  class="fas fa-id-card text-3xl icon-right text-gray-500 mr-6"
              ></i>

              <div class="text-sm font-bold">
                All bidders are required to submit their KYC information
                and await verification before being able to bid on the auction.
              </div>
            </div>


          </template>
          <bid-card
              :collectable="collectable"
              :startsAt="startsAt"
              :endsAt="currentEndsAt"
              :isAuction="isAuction"
              :isOpenEdition="isOpenEdition"
              :itemsBought="itemsBought"
              :numberOfBids="events.length"
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
              :requiresRegistration="requiresRegistration"
              :bidDisclaimers="bidDisclaimers"
              overrideClaimLink="https://propy.com/nft"
              @update-state="updateCollectableState"
          />

          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            {{ isAuction ? "Recent bids" : "Recent buys" }}
          </div>
          <list-of-buyers v-if="collectable.nft_contract_address && collectable.nft_token_id" :list="events" :isAuction="isAuction"/>

          <template v-if="isAuction">
            <button class="button dark w-full mt-12" @click="openModal('video', 'https://www.youtube.com/watch?v=1G5caDyf-kA')">
              <i
                  class="fas fa-play-circle mr-2 text-xl icon-left text-white"
              ></i>
              Learn How To Buy
            </button>

            <div class="text-sm text-gray-400 text-center mt-2">
              Explanation video will appear in a pop-up
            </div>
          </template>


          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            Proof of Authenticity
          </div>

          <div v-if="collectable.nft_contract_address && collectable.nft_token_id" class="rounded-container">
            <button class="button outline w-full" @click="viewOnEtherscan">
              View on Etherscan
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
            <!--            <button class="button outline w-full mt-6">-->
            <!--              View on IPFS-->
            <!--              <i-->
            <!--                class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"-->
            <!--              ></i>-->
            <!--            </button>-->
            <button class="button outline w-full mt-6" @click="viewOnOpenSea">
              View on OpenSea
              <i
                  class="fas fa-external-link-alt mr-2 text-sm icon-right text-gray-500"
              ></i>
            </button>
          </div>
          <div class="tour-zone text-3xl font-title font-bold text-center mb-6 mt-12" v-if="tour3d" @click="view3dTour">
            <span>3D Tour</span>
            <img src="@/assets/images/propy-2-3d-tour.png">
          </div>
          <div class="text-3xl font-title font-bold text-center mb-6 mt-12">
            <GMapMap :center="{lat: 27.759575958232478, lng: -82.72284828122115}" :zoom="13" map-type-id="roadmap" style="height: 400px"></GMapMap>
          </div>

          <div v-if="partnersPress" class="text-3xl font-title font-bold text-center mb-6 mt-12">
            <partners-and-press :partners="partnersPress"></partners-and-press>
          </div>

          <contact-agent class="shadow-md" artist-name="Propy" :socials="contactAgent"/>

        </div>
      </div>
    </container>
  </div>
</template>


<script>
import {computed, onBeforeUnmount, reactive, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useMeta} from "vue-meta";

import FencedTitle from "@/components/FencedTitle.vue";
import UserBadge from "@/components/PillsAndTags/UserBadge.vue";
import LiveIndicator from "@/components/PillsAndTags/LiveIndicator.vue";
import Tag from "@/components/PillsAndTags/Tag.vue";
import Container from "@/components/Container.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import BidCard from "@/components/BidCard.vue";
import ListOfBuyers from "@/components/Lists/ListOfBuyers.vue";
import HeroGallery from "@/components/Media/HeroGallery.vue";
import {CollectablesService} from "@/services/apiService";
import {useToast} from "primevue/usetoast";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import Highlights from "@/views/collectable/components/Highlights.vue";
import ProductVideo from "@/views/collectable/components/ProductVideo.vue";
import ContactAgent from "@/views/collectable/components/ContactAgent.vue";
import Faq from "@/views/collectable/components/FAQ.vue";
import PartnersAndPress from "@/views/collectable/components/PartnersAndPress.vue";

import useCollectableInformation from "@/hooks/useCollectableInformation.js";
import useContractEvents from "@/hooks/useContractEvents";
import {getEtherscanLink} from "@/services/utils";
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.css';

export default {
  name: "Collectable",
  components: {
    FencedTitle,
    Container,
    UserBadge,
    Tag,
    LiveIndicator,
    ArtistCard,
    BidCard,
    ListOfBuyers,
    HeroGallery,
    MediaLoader,
    Highlights,
    ProductVideo,
    ContactAgent,
    Faq,
    PartnersAndPress
  },
  setup() {
    const toast = useToast();
    const route = useRoute();
    const state = reactive({
      loading: true,
      contractAddress: null,
      collectable: {},
      buyersVisible: 3,
    });
    const faq = [
      {question: "Why is this NFT sale so important?", answer: "This first NFT sale is important because it is the first US Property that will be sold as an NFT. It is based on US legislation."},
      {question: "Can the property be purchased via a traditional transaction or will it only be sold as an NFT?", answer: "No.  The property will be sold via auction as an NFT, unless there are no offers.  At that point, it will be sold as a traditional transaction"},
      // {question: "How will the new owner pay taxes, utility bills, and any other expenses?", answer: "The new owner makes all payments as they normally would surrounding property ownership, The owner will be required to pay an annual LLC maintenance fee to Propy of $XXX/year."},
      {question: "Is an NFT equivalent to a title?", answer: "In the current legal environment, title deeds cannot be directly represented by a token, but legal entities can. The home is owned by a Delaware Limited Liability Company (LLC). The LLC is “tokenized into” a specific NFT and made available for purchase."},
      {question: "How is ownership transferred?", answer: "Each sale of an NFT will effect a complete, self-contained transfer of rights to acquire full membership in the LLC, which owns the property."},
      {question: "Are property taxes required with an NFT sale?", answer: "Yes. The taxes involved are in accordance with Florida laws and regulations."},
      {question: "Where is the LLC registered?", answer: "Delaware, United States."},
      {question: "What if I sell the NFT?", answer: "Selling the NFT is the same as selling one’s rights to be registered as the owner of the SPV holding legal title to the underlying property. The new NFT Owner is required to provide their real name and other personal information to execute the transfer of ownership."},
      {question: "Does NFT trading require the use of the Propy platform?", answer: "NFT trading can be done on the Propy Platform and other NFT platforms. Property ownership is not dependent on Propy’s operations. The LLC will continue to exist even if Propy is ever liquidated. The LLC owner has the ability to fully control the LLC and the underlying property. The NFT owner has the right to demand the passage of ownership rights even in the absence of Propy. This right is enforceable in Delaware court."},
      {question: "Is there a refund policy?", answer: "There is no refund policy technically integrated into the NFT of the property."},
      {question: "Can I sell the apartment via traditional real estate sales methods in the future?", answer: "You cannot sell the apartment in both the traditional way and via an NFT. If you’d like to sell it traditionally in the future, then Propy will help you to burn the NFT."},
      {question: "Do I need to pay for the property in cryptocurrency?", answer: "Yes, because the auction is being run on an NFT platform that accepts cryptocurrency (ETH)."},
      {question: "What are the gas/transaction fees associated with the purchase?", answer: "Normal gas fees on Ethereum (we know they are high, but it’s real property and there are no additional ownership transfer fees needed to be paid by you)."},
      {question: "Do I need to use Propy to sell the property in the future?", answer: "No, but you will need to find a platform that can support NFT/Blockchain transactions"},
      {question: "Why is Propy doing this?", answer: "Propy is committed to supporting innovative self-driving transactions that utilize the security of blockchain.  Selling a property as an NFT is an exciting new property-sale use-case that will initiate a wave of RE NFT sales and will make them available as collateral for crypto borrowers and investors. In fact, Propy has several other US properties scheduled to be sold via NFT later this year."},
      {question: "I want to sell a property via NFT, are there any requirements to do so?", answer: "Since an NFT is technically a “collectible,” an NFT property should be in high demand or unique in some way -- structure, location, artwork, historical relevance, price -- similar to the property that we are currently auctioning."},
      // {question: "How quickly can I move into the property after purchasing it?", answer: "In theory, You may move into the property immediately after the transaction is completed."},
      // {question: "Can I view the property in person before bidding on it?", answer: "You can view a live virtual tour on our landing page.  There is a live open house on Saturday, February 5th  You can also visit the property in person by contacting Agent’s Name"},
      // {question: "Does the transaction require title insurance?", answer: "No. Proof of ownership will be provided to whitelisted auction candidates on DATE"},
      // {question: "Can I view any inspections or disclosures for the property?", answer: "Inspections and disclosures will be provided to whitelisted auction candidates upon request."},
      // {question: "What is the property currently appraised at?", answer: "We estimate the property price to be a minimum of $650,000 USD. Access to comparables will be provided to whitelisted auction candidates on DATE."},
      {question: "How do I get keys to the property?", answer: ""},
      {question: "What happens if the value of ETH fluctuations occur during bidding?  Is the minimum price based on dollars or ETH?", answer: "The price is based on the dollar value."},
      {question: "If Propy is ever sold or liquidated, the transaction participants will have private keys to all their documents forever. All files are stored on decentralized IPFS  storage.", answer: "If a buyer loses a private key, they can reach out to agents to access the necessary transaction documents. For the time being Propy will always be able to identify the user and provide the transaction data upon request if passwords or private keys are lost. There will not be a case where ownership is locked into a digital wallet with a single access to a private key, which could be lost together with ownership."},
    ];
    const bidDisclaimers = [
      "Apartment images are rendered designs",
      "Apartment comes unfurnished",
      "Apartment renovations to be completed by July 1st",
    ]
    const highlights = [
            {icon: "fas fa-circle", text: "7405 sq/foot (687.95 Sq/Meters)"},
            {icon: "fas fa-circle", text: "5 bedrooms"},
            {icon: "fas fa-circle", text: "4 bathrooms"},
            {icon: "fas fa-circle", text: "Built in 1951"},
            {icon: "fas fa-circle", text: "Central Heating"},
            {icon: "fas fa-circle", text: `Central AC`},
            ];
    const video = "https://www.youtube.com/embed/RoBB-rrZC-k";
    const tour3d = "https://my.matterport.com/show/?m=wtHSRJ9eoPC";
    const contactAgent = [
            {type: 'website', url: 'https://propy.com/browse/propy-nft/'},
            {type: 'telegram', url: 'https://t.me/propy/'},
            {type: 'twitter', url: 'https://twitter.com/propyinc'},
            {type: 'discord', url: 'https://discord.gg/hR73KhhzMc'},
            {type: 'mail', url: 'mailto:info@propy.com'},
            ];
    const partnersPress = [
        {image: require("@/assets/images/partners/coindesk.jpg"), url: 'https://www.coindesk.com/tag/propy'},
        {image: require("@/assets/images/partners/techcrunch.jpg"), url: 'https://techcrunch.com/tag/propy/'},
      ];


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
      isOpenEdition,
      itemsBought,
      // Methods
      updateProgress,
      setCollectable,
      updateCollectableState,
      claim,
      pillOverride,
      requiresRegistration,
    } = useCollectableInformation();

    const currentEndsAt = computed(() => {
      return endsAt.value;
    });

    const keywords = computed(() => {
      let words = ["collectable", "drop", "seen", "seen.haus"];
      if (isTangible) words.push("tangible");
      if (isNft) words.push("nft");
      if (isAuction) words.push("auction");
      else words.push("sale");

      return words.join(" ");
    });
    const {meta} = useMeta({
      title: title.value || "Loading...",
      meta: [
        {
          name: "keywords",
          content: "",
        },
        {
          name: "description",
          content: "",
        },
      ],
    });

    const isLoading = computed(() => state.loading);

    const showAdditionalInformation = computed(
        () => type.value === "tangible" || type.value === "tangible_nft"
    );

    const updateMeta = () => {
      meta.title = title.value || "Collectable";
      meta.meta[0].content = keywords.value;
      meta.meta[1].content = description.value.replace(
          /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g,
          ""
      );
    };

    const viewOnEtherscan = () => {
      const address = state.collectable.contract_address;
      let url = getEtherscanLink(1, address, "address");
      window.open(url, '_blank').focus()
    }
    const view3dTour = () => {
      window.open(tour3d, '_blank').focus()
    }
    const viewOnOpenSea = () => {
      let nftAddress = collectable.value.nft_contract_address
      let nftTokenId = collectable.value.nft_token_id
      let url = `https://opensea.io/assets/${nftAddress}/${nftTokenId}`;
      window.open(url, '_blank').focus()
    }

    (async function loadCollectable() {
      state.loading = true;
      const slug = 'first-us-real-estate-nft';
      const {data} = await CollectablesService.show(slug);

      // data.events.reverse(); // Right order
      // state.buyers.list = data.events;
      state.loading = false;
      state.collectable = data;
      state.contractAddress = data.contract_address;

      setCollectable(data);
      updateMeta();
    })();

    const openModal = (type, url) => {
      const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
      });
      if (type === 'video' || type.includes("mp4") || type.includes("video")) {
        lightbox.setElements([{
          'href': url,
          'type': 'video',
          'source': 'youtube', //vimeo, youtube or local
        }])
      } else {
        lightbox.setElements([{
          'href': url,
          'type': 'image', //vimeo, youtube or local
        }]);
      }
      lightbox.open();
    };

    (async function setBackgroundImage(){
      artist.background_image = '@/assets/images/artist-background-placeholder.jpg';
    })();

    return {
      isLoading,
      collectable,
      collectableState,
      price,
      priceUSD,
      items,
      itemsOf,
      progress,
      isCollectableActive,
      isUpcomming,
      // Static
      type,
      media,
      gallerySortedMedia,
      // firstMedia,
      artist,
      artistStatement,
      title,
      description,
      events,
      startsAt,
      currentEndsAt,
      liveStatus,
      is_sold_out,
      is_closed,
      edition,
      edition_of,
      isTangible,
      isNft,
      isAuction,
      isOpenEdition,
      itemsBought,
      nextBidPrice,
      // Methods
      updateProgress,
      viewOnEtherscan,
      viewOnOpenSea,
      view3dTour,
      openModal,
      showAdditionalInformation,
      updateCollectableState,
      claim,
      pillOverride,
      faq,
      highlights,
      video,
      contactAgent,
      partnersPress,
      bidDisclaimers,
      requiresRegistration,
      tour3d,
    };
  },
};
</script>


<style lang="scss" scoped>
.description {
  p {
    margin-bottom: 1rem;
  }
}
.tour-zone {
  cursor: pointer;
  &.span {
    position: absolute;
  }
}
</style>

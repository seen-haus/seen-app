<template>
  <div class="team">
    <container class="section-featured-artists pb-24">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <fenced-title
          class="flex-grow mr-0 mb-2 self-stretch"
          color="fence-gray"
          textAlign="center"
          :closed="true"
          >Meet the Team
        </fenced-title>
      </div>

      <h2 class="subtitle">Founding Members</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <template
          v-for="member in foundingMembers"
          :key="member && member.name"
        >
          <team-member-card :teamMember="member" headerColor="bg-black" />
        </template>
      </div>

      <h2 class="subtitle">Core Contributors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <template
          v-for="member in coreContributors"
          :key="member && member.name"
        >
          <team-member-card :teamMember="member" headerColor="bg-gray-500" />
        </template>
      </div>

      <h2 class="subtitle">Advisors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <template v-for="member in advisors" :key="member && member.name">
          <team-member-card :teamMember="member" headerColor="bg-gray-300" />
        </template>
      </div>

      <h2 class="subtitle">Community Contributors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <template
          v-for="member in communityContributors"
          :key="member && member.name"
        >
          <team-member-card :teamMember="member" headerColor="bg-gray-200" />
        </template>
      </div>

      <h2 class="subtitle">Multisig</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <template v-for="member in multisig" :key="member && member.name">
          <team-member-card :teamMember="member" headerColor="bg-gray-100" />
        </template>
      </div>
    </container>
  </div>
</template>


<script>
import Container from "@/components/Container.vue";
import FencedTitle from "@/components/FencedTitle.vue";

import TeamMemberCard from "./components/TeamMemberCard.vue";

const foundingMembers = [
  {
    avatar: require("@/assets/images/team/Jigglybuff69.jpg"),
    name: "Jigglybuff69",
    title: "Head of Design",
    socials: [
      {
        url: "https://twitter.com/JIGGLYBUFF69",
        type: "twitter",
        handle: "JIGGLYBUFF69",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Jiigsaw01.jpg"),
    name: "Jiigsaw01",
    title: "Operations and Comms",
    socials: [
      {
        url: "https://twitter.com/jiigsaw01",
        type: "twitter",
        handle: "Jiigsaw01",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Buddyart00.jpg"),
    name: "Buddyart00",
    title: "Creative Director",
    socials: [
      {
        url: "https://twitter.com/buddyart00",
        type: "twitter",
        handle: "Buddyart00",
      },
      { url: "https://www.buddyart00.com", type: "webpage" },
    ],
  },
  {
    avatar: require("@/assets/images/team/CryptoSamurai.jpg"),
    name: "CryptoSamurai",
    title: "Fullstack Developer",
    socials: [
      {
        url: "https://twitter.com/CryptoSamurai",
        type: "twitter",
        handle: "CryptoSamurai",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Bluekirbyfi.jpg"),
    name: "Bluekirbyfi",
    title: "Marketing",
    socials: [
      {
        url: "https://twitter.com/bluekirbyfi",
        type: "twitter",
        handle: "Bluekirbyfi",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Eyeofsauron.jpg"),
    name: "Eyeofsauron",
    title: "Solidity Dev",
    socials: [
      {
        url: "https://twitter.com/EyeOfSauronSeen",
        type: "twitter",
        handle: "EyeOfSauronSeen",
      },
    ],
  },
];

const coreContributors = [
  {
    avatar: require("@/assets/images/team/Atmanbay.jpg"),
    name: "Atmanbay",
    title: "Lead Solidity Dev",
    socials: [
      {
        url: "https://twitter.com/atmanbay",
        type: "twitter",
        handle: "atmanbay",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Laserbach.jpg"),
    name: "Laserbach",
    title: "Head of Marketing",
    socials: [
      {
        url: "https://twitter.com/Laserbacher",
        type: "twitter",
        handle: "Laserbach",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Lostboyfi.jpg"),
    name: "Lostboyfi",
    title: "Operations Specialist",
    socials: [
      {
        url: "https://twitter.com/lostboyfi",
        type: "twitter",
        handle: "lostboyfi",
      },
    ],
  },
];

const advisors = [
  {
    avatar: require("@/assets/images/team/Gmoney.jpg"),
    name: "Gmoney",
    title: "Advisor",
    socials: [
      {
        url: "https://twitter.com/gmoneyNFT",
        type: "twitter",
        handle: "gmoneyNFT",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Justintrimble.jpg"),
    name: "Justintrimble",
    title: "Advisor",
    socials: [
      {
        url: "https://twitter.com/justintrimble",
        type: "twitter",
        handle: "Justintrimble",
      },
    ],
  },
  // {
  //   avatar: require("@/assets/images/team/Fidi Bu.jpg"),
  //   name: "Fidi Bu",
  //   title: "Advisor",
  //   socials: [
  //     {
  //       url: "https://www.instagram.com/ferdinandoverderi/",
  //       type: "instagram",
  //       handle: "ferdinandoverderi",
  //     },
  //   ],
  // },
];

const communityContributors = [
  {
    avatar: require("@/assets/images/team/Shillusmaximus.jpg"),
    name: "Shillusmaximus",
    title: "Chief of Memes",
    socials: [
      {
        url: "https://twitter.com/ShillusMaximus",
        type: "twitter",
        handle: "ShillusMaximus",
      },
      {
        url: "https://www.instagram.com/shillusmaximus/",
        type: "instagram",
        handle: "ShillusMaximus",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/mangicrypto.jpg"),
    name: "mangicrypto",
    title: "Marketing Support",
    socials: [
      {
        url: "https://twitter.com/mangicrypto",
        type: "twitter",
        handle: "mangicrypto",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Doublewordscore.jpg"),
    name: "Doublewordscore",
    title: "Content Creator",
    socials: [
      {
        url: "https://twitter.com/doublew0rdscore",
        type: "twitter",
        handle: "doublew0rdscore",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Desulator.jpg"),
    name: "desultor",
    title: "UI/UX Consultant",
    socials: [
      {
        url: "https://twitter.com/_desultor_",
        type: "twitter",
        handle: "_desultor_",
      },
      {
        url: "https://www.instagram.com/_desultor_/",
        type: "instagram",
        handle: "_desultor_",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Jaywelsh.jpg"),
    name: "Jaywelsh",
    title: "Backend Consultant",
    socials: [
      {
        url: "https://twitter.com/JayBWelsh",
        type: "twitter",
        handle: "JayBWelsh",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/SEM.jpg"),
    name: "SEM",
    title: "Backend Consultant",
    socials: [
      { url: "https://twitter.com/0xSEM", type: "twitter", handle: "0xSEM" },
    ],
  },
];

const multisig = [
  {
    avatar: require("@/assets/images/team/0xMaki.jpg"),
    name: "0xMaki",
    title: "Signee",
    socials: [
      { url: "https://twitter.com/0xMaki", type: "twitter", handle: "0xMaki" },
      { url: "https://sushiswap.fi/", type: "website" },
    ],
  },
  {
    avatar: require("@/assets/images/team/Solarcurve.jpg"),
    name: "Solarcurve",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/SolarCurve",
        type: "twitter",
        handle: "Solarcurve",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Laserbach.jpg"),
    name: "Laserbach",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/Laserbacher",
        type: "twitter",
        handle: "Laserbach",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Jigglybuff69.jpg"),
    name: "Jigglybuff69",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/JIGGLYBUFF69",
        type: "twitter",
        handle: "JIGGLYBUFF69",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Jiigsaw01.jpg"),
    name: "Jiigsaw01",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/jiigsaw01",
        type: "twitter",
        handle: "Jiigsaw01",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/CryptoSamurai.jpg"),
    name: "CryptoSamurai",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/CryptoSamurai",
        type: "twitter",
        handle: "CryptoSamurai",
      },
    ],
  },
  {
    avatar: require("@/assets/images/team/Andy8052.jpg"),
    name: "Andy8052",
    title: "Signee",
    socials: [
      {
        url: "https://twitter.com/andy8052",
        type: "twitter",
        handle: "andy8052",
      },
    ],
  },
];

import { useStore } from "vuex";

export default {
  name: "Team",
  components: {
    Container,
    FencedTitle,
    TeamMemberCard,
  },
  setup() {
    const store = useStore();

    // Disable dark mode until dark mode is supported across website
    store.dispatch("application/setDarkMode", false);

    return {
      foundingMembers,
      coreContributors,
      advisors,
      communityContributors,
      multisig,
    };
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  @apply font-title text-center lg:text-left mt-20 font-bold text-3xl md:text-4xl mb-12;
}
</style>

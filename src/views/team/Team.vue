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

      <h2 class="font-title mt-10 font-bold text-4xl mb-6">Founding Members</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="member in foundingMembers"
          :key="member && member.name"
        >
          <team-member-card 
            :teamMember="member"
            headerColor="bg-black"
          />
        </template>
      </div>

      <h2 class="font-title mt-20 font-bold text-4xl mb-6">Core Contributors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="member in coreContributors"
          :key="member && member.name"
        >
          <team-member-card 
            :teamMember="member"
            headerColor="bg-gray-500"
          />
        </template>
      </div>

      <h2 class="font-title mt-20 font-bold text-4xl mb-6">Advisors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="member in advisors"
          :key="member && member.name"
        >
          <team-member-card 
            :teamMember="member"
            headerColor="bg-gray-300"
          />
        </template>
      </div>

      <h2 class="font-title mt-20 font-bold text-4xl mb-6">Community Contributors</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="member in communityContributors"
          :key="member && member.name"
        >
          <team-member-card 
            :teamMember="member"
            headerColor="bg-gray-200"
          />
        </template>
      </div>

      <h2 class="font-title mt-20 font-bold text-4xl mb-6">Multisig</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <template
          v-for="member in multisig"
          :key="member && member.name"
        >
          <team-member-card 
            :teamMember="member"
            headerColor="bg-gray-100"
          />
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
    avatar: 'http://placekitten.com/200/300',
    name: 'Jigglybuff69',
    title: 'Head of Design',
    socials: [{url: 'https://twitter.com/JIGGLYBUFF69', type: 'twitter', handle: 'JIGGLYBUFF69'}]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Jiigsaw01',
    title: 'Operations and Comms',
    socials: [{url: 'https://twitter.com/jiigsaw01', type: 'twitter', handle: 'Jiigsaw01'}]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Buddyart00',
    title: 'Creative Director',
    socials: [
      {url: 'https://twitter.com/buddyart00', type: 'twitter', handle: 'Buddyart00'},
      {url: 'www.buddyart00.com', type: 'webpage'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'CryptoSamurai',
    title: 'Front End Developer',
    socials: [
      {url: 'https://twitter.com/CryptoSamurai', type: 'twitter', handle: 'CryptoSamurai'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Bluekirbyfi',
    title: 'Marketing',
    socials: [
      {url: 'https://twitter.com/bluekirbyfi', type: 'twitter', handle: 'Bluekirbyfi'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Eyeofsauron',
    title: 'Solidity Dev',
    socials: [
      {url: 'https://twitter.com/EyeOfSauronSeen', type: 'twitter', handle: 'EyeOfSauronSeen'},
    ]
  },
];

const coreContributors = [
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Atmanbay',
    title: 'Lead Solidity Dev',
    socials: [
      {url: 'https://twitter.com/atmanbay', type: 'twitter', handle: 'atmanbay'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Laserbach',
    title: 'Head of Marketing',
    socials: [
      {url: 'https://twitter.com/Laserbacher', type: 'twitter', handle: 'Laserbach'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Lostboyfi',
    title: 'Operations Specialist',
    socials: [
      {url: 'https://twitter.com/lostboyfi', type: 'twitter', handle: 'lostboyfi'},
    ]
  },
];

const advisors = [
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Gmoney',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/gmoneyNFT', type: 'twitter', handle: 'gmoneyNFT'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Justintrimble',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/justintrimble', type: 'twitter', handle: 'Justintrimble'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Fidi Bu',
    title: 'Advisor',
    socials: [
      {url: 'https://www.instagram.com/ferdinandoverderi/', type: 'instagram', handle: 'ferdinandoverderi'},
    ]
  },
];

const communityContributors = [
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Shillusmaximus',
    title: 'Chief of Memes',
    socials: [
      {url: 'https://twitter.com/ShillusMaximus', type: 'twitter', handle: 'ShillusMaximus'},
      {url: 'https://www.instagram.com/shillusmaximus/', type: 'instagram', handle: 'ShillusMaximus'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'mangicrypto',
    title: 'Marketing Support',
    socials: [
      {url: 'https://twitter.com/mangicrypto', type: 'twitter', handle: 'mangicrypto'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Doublewordscore',
    title: 'Content Creator',
    socials: [
      {url: 'https://twitter.com/doublew0rdscore', type: 'twitter', handle: 'doublew0rdscore'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Desulator',
    title: 'Front End Consultant',
    socials: [
      {url: 'https://twitter.com/_desultor_', type: 'twitter', handle: '_desultor_'},
      {url: 'https://www.instagram.com/_desultor_/', type: 'instagram', handle: '_desultor_'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Jaywelsh',
    title: 'Backend Consultant',
    socials: [
      {url: 'https://twitter.com/JayBWelsh', type: 'twitter', handle: 'JayBWelsh'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'SEM',
    title: 'Backend Consultant',
    socials: [
      {url: 'https://twitter.com/0xSEM', type: 'twitter', handle: '0xSEM'},
    ]
  },
];

const multisig = [
  {
    avatar: 'http://placekitten.com/200/300',
    name: '0xMaki',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/0xMaki', type: 'twitter', handle: '0xMaki'},
      {url: 'https://sushiswap.fi/', type: 'website'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Solarcurve',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/SolarCurve', type: 'twitter', handle: 'Solarcurve'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Laserbach',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/Laserbacher', type: 'twitter', handle: 'Laserbach'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Jigglybuff69',
    title: 'Advisor',
    socials: [{url: 'https://twitter.com/JIGGLYBUFF69', type: 'twitter', handle: 'JIGGLYBUFF69'}]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Jiigsaw01',
    title: 'Advisor',
    socials: [{url: 'https://twitter.com/jiigsaw01', type: 'twitter', handle: 'Jiigsaw01'}]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'CryptoSamurai',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/CryptoSamurai', type: 'twitter', handle: 'CryptoSamurai'},
    ]
  },
  {
    avatar: 'http://placekitten.com/200/300',
    name: 'Andy8052',
    title: 'Advisor',
    socials: [
      {url: 'https://twitter.com/andy8052', type: 'twitter', handle: 'andy8052'},
    ]
  },
];


export default {
  name: 'Team',
  components: {
    Container,
    FencedTitle,
    TeamMemberCard,
  },
  setup() {
    return {
      foundingMembers,
      coreContributors,
      advisors,
      communityContributors,
      multisig
    }
  },
}
</script>
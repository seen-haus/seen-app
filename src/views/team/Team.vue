<template>
  <div class="team">
    <container class="section-featured-artists pb-24">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <div class="abstract-circles abstract-circles-team">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
        <div v-if="isActiveSelection(['all'])"
          class="abstract-circles abstract-circles-team-two">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
        <div v-if="isActiveSelection(['all'])"
          class="abstract-circles abstract-circles-team-three">
          <img src="@/assets/images/abstract-circles.svg" alt="">
        </div>
        <unfenced-title
          class="text-black hidden lg:flex pb-4 pt-12"
          color="fence-dark"
          text-align="left"
        >
          Meet the Team
        </unfenced-title>
      </div>

      <div>
          <div class="mr-12 inline-block">
            <light-typography
              @click="setSelectedType('all')"
              class="clickable"
              :class="data?.selectedType === 'all' ? 'active-selection' : null"
            >
              All
            </light-typography>
          </div>
          <div class="mr-12 inline-block">
            <light-typography
              @click="setSelectedType('core')"
              class="clickable"
              :class="data?.selectedType === 'core' ? 'active-selection' : null"
            >
              Core Contributors
            </light-typography>
          </div>
          <div class="mr-12 inline-block">
            <light-typography
              @click="setSelectedType('advisors')"
              class="clickable"
              :class="data?.selectedType === 'advisors' ? 'active-selection' : null"
            >
              Advisors
            </light-typography>
          </div>
          <div class="mr-12 inline-block">
            <light-typography
              @click="setSelectedType('multisig')"
              class="clickable"
              :class="data?.selectedType === 'multisig' ? 'active-selection' : null"
            >
              Multisig
            </light-typography>
          </div>
          <div class="mr-12 inline-block">
            <light-typography 
              @click="setSelectedType('community')"
              class="clickable"
              :class="data?.selectedType === 'community' ? 'active-selection' : null"
            >
              Community Contributors
            </light-typography>
          </div>
      </div>

      <div v-if="isActiveSelection(['all', 'core'])">
        <h2 class="subtitle">Core Contributors</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <template
            v-for="member in coreContributors"
            :key="member && member.name"
          >
            <team-member-card :teamMember="member" headerColor="bg-black" />
          </template>
        </div>
      </div>

      <div v-if="isActiveSelection(['all', 'advisors'])">
        <h2 class="subtitle">Advisors</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <template
            v-for="member in advisors"
            :key="member && member.name"
          >
            <team-member-card :teamMember="member" headerColor="bg-gray-500" />
          </template>
        </div>
      </div>

      <div v-if="isActiveSelection(['all', 'multisig'])">
        <h2 class="subtitle">Multisig</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <template
            v-for="member in multisig"
            :key="member && member.name"
          >
            <team-member-card :teamMember="member" headerColor="bg-gray-200" />
          </template>
        </div>
      </div>

      <div v-if="isActiveSelection(['all', 'community'])">
        <h2 class="subtitle">Community Contributors</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-12">
          <template
            v-for="member in communityContributors"
            :key="member && member.name"
          >
            <team-member-card :teamMember="member" headerColor="bg-gray-300" />
          </template>
        </div>
      </div>
    </container>
  </div>
</template>


<script>
import { reactive } from "vue";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import TeamMemberCard from "./components/TeamMemberCard.vue";
import LightTypography from "@/components/LightTypography.vue";

import { coreContributors, advisors, multisig, communityContributors } from "./data.js";

export default {
  name: "Team",
  components: {
    Container,
    UnfencedTitle,
    TeamMemberCard,
    LightTypography,
  },

  methods: {
    setSelectedType(type) {
      this.data.selectedType = type;
    },
    isActiveSelection(selections = []) {
      return selections.indexOf(this.data.selectedType) > -1;
    }
  },

  setup() {
    const data = reactive({
      selectedType: 'all',
    })

    return {
      communityContributors,
      coreContributors,
      advisors,
      multisig,
      data,
    };
  },
};
</script>

<style lang="scss" scoped>

.abstract-circles-team {
  top: 100px;
  @screen lg {
    right: 35px;
  }
}

.abstract-circles-team-two {
  left: 0px;
  top: 700px;
}

.abstract-circles-team-three {
  right: 1px;
  top: 1300px;
}

.subtitle {
  @apply font-title text-center lg:text-left mt-15 font-bold text-3xl md:text-4xl mb-12;
}

.active-selection {
  text-decoration: underline;
  text-decoration-color: #90cd93;
  text-decoration-thickness: 2px;
}
</style>

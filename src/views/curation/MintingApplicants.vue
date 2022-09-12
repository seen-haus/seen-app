<template>
  <div class="curate-self-minting">
    <container class="section-featured-auctions pb-12">
      <div class="flex items-center pb-6 pt-6 flex-col lg:flex-row" style="max-width: 800px;">
        <div>
          <common-title
            class="flex-grow pb-1 mb-2"
            color="fence-light"
            textAlign="left"
            fontSize="4rem"
            lineHeight="5rem"
            :closed="false"
          >
            Minter Curation Round {{curationRoundInfo && curationRoundInfo.id}}
          </common-title>
          <common-title
            class="flex-grow pb-1 mb-2"
            color="fence-light"
            textAlign="left"
            fontSize="2.5rem"
            lineHeight="5rem"
            :closed="false"
            v-if="timerState === 'WAITING'"
          >
            <span v-if="!ended" style="font-weight: 400">Starting in</span> {{value}}
          </common-title>
          <common-title
            class="flex-grow pb-1 mb-2"
            color="fence-light"
            textAlign="left"
            fontSize="2.5rem"
            lineHeight="5rem"
            :closed="false"
            v-else
          >
            {{value}} <span v-if="!ended" style="font-weight: 400">Remaining</span>
          </common-title>
          <light-typography 
            textAlign="left"
            fontSize="1.6rem"
            lineHeight="40px"
            paddingBottom="6px"
          >
            Use your SEEN or xSEEN to vote on who you think should be granted access to SEEN self-minting.
          </light-typography>
          <light-typography 
            textAlign="left"
            fontSize="1.2rem"
            lineHeight="40px"
            paddingBottom="6px"
          >
            Balance snapshots derived from block <a class="green-link" :href="`https://etherscan.io/block/${latestSnapshotBlock}`" target="_blank" rel="noopener noreferrer">{{latestSnapshotBlock}}</a>.
          </light-typography>
        </div>
      </div>
      <div
        class="auction-list-big grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-5"
      >
        <template
          v-for="applicant in listOfApplicants"
          :key="applicant?.id ? applicant.id : new Date().getTime()"
        >
          <SelfCreationApplicantCard :key="`self-minting-applicant-${applicant.id}`" :roundDeclarationId="curationRoundInfo.id" :votingClosed="ended" :votingState="timerState" v-if="applicant && applicant.id && (tempHideList.indexOf(applicant.id) === -1)" autoMargins :applicant="applicant">{{applicant}}</SelfCreationApplicantCard>
          <product-card-v3-placeholder v-else-if="applicant && (tempHideList.indexOf(applicant.id) === -1)" />
        </template>
      </div>

      <button
        class="button mt-20 mx-auto w-full md:w-96"
        :class="darkMode ? 'light' : 'dark'"
        v-if="hasMore"
        @click="handleLoadMore"
      >
        Load More
      </button>
    </container>
  </div>
</template>

<script>
import { computed, watchEffect } from "vue";
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import LightTypography from "@/components/LightTypography.vue";
import CommonTitle from "@/components/CommonTitle.vue";
import SelfCreationApplicantCard from "@/components/Curation/SelfCreationApplicantCard.vue";

import useApplicantsWithPagination from "@/hooks/useApplicantsWithPagination";
import useLatestCurationRound from "@/hooks/useLatestCurationRound";
import useGenericTimer from "@/hooks/useGenericTimer.js";

export default {
  name: "MintingApplicants",
  components: {
    Container,
    LightTypography,
    CommonTitle,
    SelfCreationApplicantCard,
  },
  setup() {
    const { meta } = useMeta({
      title: "SEEN Curation - Self-Minting",
    });

    const curationRoundInfoHook = useLatestCurationRound('self_minting_applicants');
    curationRoundInfoHook.load();

    const curationRoundInfo = computed(() => curationRoundInfoHook.curationRound.value);
    const latestSnapshotBlock = computed(() => curationRoundInfoHook.latestSnapshotBlock.value);

    const {startTimer, endTimer, percentage, timerState, value, ended} = useGenericTimer(null, 'Curation round');

    const paginatedApplicants = useApplicantsWithPagination('self_minting_applicants');
    const listOfApplicants = computed(
      () => paginatedApplicants.listOfApplicants.value
    );

    const hasMore = computed(() => paginatedApplicants.hasMore.value);

    const handleLoadMore = async () => {
      if(curationRoundInfo.value) {
        paginatedApplicants.loadMore(curationRoundInfo.value.id);
      }
    };

    watchEffect(() => {
      if(curationRoundInfo.value) {
        startTimer({
          startDate: curationRoundInfo.value.start_unix * 1000,
          endDate: curationRoundInfo.value.end_unix * 1000,
        })
        console.log({listOfApplicants})
        if(!listOfApplicants.value || (listOfApplicants.value[0] === null) || listOfApplicants.value.length === 0) {
          paginatedApplicants.load(curationRoundInfo.value.id);
        }
      }
    })

    const tempHideList = [5, 15, 22, 21, 25];

    return {
      curationRoundInfo,
      listOfApplicants,
      hasMore,
      handleLoadMore,
      tempHideList,
      value,
      ended,
      latestSnapshotBlock,
      timerState
    }
  }
};
</script>
<style lang="scss" scoped>
  .curate-self-minting {

  }
</style>

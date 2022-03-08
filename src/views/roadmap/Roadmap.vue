<template>
  <div class="privacy">
    <container class="pb-12">
      <div class="flex items-center flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pt-12"
          color="fence-dark"
          text-align="left"
        >
          Roadmap
        </unfenced-title>
      </div>
      <div class="roadmap-list">
        <template v-for="[yearOrStatus, parentIndex] in Object.entries(roadmap)" :key="`roadmap-entry-parent-${yearOrStatus}-${index}`">
          <div v-if="roadmap[yearOrStatus].constructor === Array">
            <common-title
              class="flex-grow mb-6"
              color="fence-light"
              textAlign="left"
              :closed="false"
              :class="{
                'mt-6': parentIndex > 0
              }"
            >
              {{yearOrStatus}}
            </common-title>
            <template v-for="(roadmapEntry, childIndex) in roadmap[yearOrStatus]" :parentIndex="parentIndex" :key="`roadmap-entry-child-${parentIndex}-${childIndex}`">
              <roadmap-entry
                :title="roadmapEntry.title"
                :status="roadmapEntry.status"
                :description="roadmapEntry.description"
                :exampleLinks="roadmapEntry.exampleLinks"
                :githubLinksFrontend="roadmapEntry?.githubCommits?.['frontend']"
                :githubLinksApi="roadmapEntry?.githubCommits?.['api']"
                :githubLinksContracts="roadmapEntry?.githubCommits?.['contracts']"
                :marginBottom="childIndex === (roadmap[yearOrStatus].length - 1)"
              />
            </template>
          </div>
          <div v-else>
            <template v-for="[quarterOrTitle, roadmapEntryIndex] in Object.entries(roadmap[yearOrStatus])" :parentIndex="parentIndex" :key="`roadmap-entry-child-${parentIndex}-${childIndex}-${roadmapEntryIndex}`">
              <common-title
                class="flex-grow mr-0 mb-6 mt-6"
                color="fence-light"
                textAlign="left"
                :closed="false"
              >
                {{quarterOrTitle + ' ' + yearOrStatus}}
              </common-title>
              <template v-for="(roadmapEntry, childIndex) in roadmap[yearOrStatus][quarterOrTitle]" :parentIndex="parentIndex" :key="`roadmap-entry-child-${parentIndex}-${childIndex}`">
                <roadmap-entry
                  :title="roadmapEntry.title"
                  :status="roadmapEntry.status"
                  :description="roadmapEntry.description"
                  :exampleLinks="roadmapEntry.exampleLinks"
                  :githubLinksFrontend="roadmapEntry?.githubCommits?.['frontend']"
                  :githubLinksApi="roadmapEntry?.githubCommits?.['api']"
                  :githubLinksContracts="roadmapEntry?.githubCommits?.['contracts']"
                  :marginBottom="childIndex === (roadmap[yearOrStatus][quarterOrTitle].length - 1)"
                />
              </template>
            </template>
          </div>
        </template>
      </div>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import CommonTitle from "../../components/CommonTitle.vue";
import LightTypography from "../../components/LightTypography.vue";
import RoadmapEntry from "../../components/RoadmapEntry.vue";

import { roadmap } from "./data.js";

export default {
  name: "Roadmap",
  components: {
    Container,
    UnfencedTitle,
    LightTypography,
    CommonTitle,
    RoadmapEntry,
  },
  setup() {
    const { meta } = useMeta({
      title: "ROADMAP",
    });
    return {
      roadmap
    }
  },
};
</script>

<style lang="scss" scoped>

ul {
    list-style-type: disc;
    list-style-position: inside;
}

ol {
    list-style-type: decimal;
    list-style-position: inside;
}

</style>
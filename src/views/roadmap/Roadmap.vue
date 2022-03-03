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
              <div class="roadmap-card mt-4 mb-4" v-if="yearOrStatus"
                :class="{
                  'mb-8': childIndex === (roadmap[yearOrStatus].length - 1)
                }"
              >
                  <div class="flex p-4 align-center">
                    <div class="status-container">
                      <div v-if="roadmapEntry.status === 'in-progress'" class="status-circle in-progress-status flex items-center justify-center">
                        <i class="fas fa-ellipsis-h" style="font-size: 24px;color:white;"></i>
                      </div>
                      <div v-if="roadmapEntry.status === 'upcoming'" class="status-circle upcoming-status flex items-center justify-center">
                        <i class="fas fa-ellipsis-h" style="font-size: 24px;color:white;"></i>
                      </div>
                    </div>
                    <div class="roadmap-item-title-container flex items-center">
                      <common-title
                        class="flex-grow"
                        color="fence-light"
                        textAlign="left"
                        fontSize="27px"
                        style="margin-top: 2px"
                        :closed="false"
                      >
                        {{roadmapEntry.title}}
                      </common-title>
                    </div>
                  </div>
                </div>
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
                <div class="roadmap-card mt-4 mb-4" v-if="yearOrStatus"
                  :class="{
                    'mb-8': childIndex === (roadmap[yearOrStatus][quarterOrTitle].length - 1)
                  }"
                >
                  <div class="flex p-4 align-center">
                    <div class="status-container">
                      <div class="status-circle complete-status flex items-center justify-center">
                        <img src="@/assets/icons/complete-icon.svg" style="width: 24px"/>
                      </div>
                    </div>
                    <div class="roadmap-item-title-container flex items-center">
                      <common-title
                        class="flex-grow"
                        color="fence-light"
                        textAlign="left"
                        fontSize="27px"
                        style="margin-top: 2px"
                        :closed="false"
                      >
                        {{roadmapEntry.title}}
                      </common-title>
                    </div>
                  </div>
                </div>
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

import { roadmap } from "./data.js";

export default {
  name: "Roadmap",
  components: {
    Container,
    UnfencedTitle,
    LightTypography,
    CommonTitle,
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

.roadmap-card {
  max-width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
  border-radius: 10px;
}

.status-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.complete-status {
  background-color: #31E07F;
}

.in-progress-status {
  background-color: #038FFF;
}

.upcoming-status {
  background-color: #BEBEBE;
}

.status-container {
  width: 60px;
}

.roadmap-item-title-container {
  width: calc(100% - 60px);
}

</style>
<template>
  <div class="roadmap-card mt-4 mb-4"
    :class="{
      'mb-8': marginBottom
    }"
  >
    <div class="flex p-4 align-center bottom-padding-mobile"
      :class="{
        'disable-bottom-padding': isExpanded
      }"
    >
      <div class="status-container">
        <div v-if="status === 'complete'" class="status-circle complete-status flex items-center justify-center">
          <img src="@/assets/icons/complete-icon.svg" style="width: 24px"/>
        </div>
        <div v-if="status === 'in-progress'" class="status-circle in-progress-status flex items-center justify-center">
          <i class="fas fa-ellipsis-h" style="font-size: 24px;color:white;"></i>
        </div>
        <div v-if="status === 'upcoming'" class="status-circle upcoming-status flex items-center justify-center">
          <i class="fas fa-ellipsis-h" style="font-size: 24px;color:white;"></i>
        </div>
      </div>
      <div class="roadmap-item-title-container flex items-center">
        <common-title
          class="flex-grow ml-2"
          color="fence-light"
          textAlign="left"
          fontSize="27px"
          style="margin-top: 2px"
          :closed="false"
        >
          {{title}}
        </common-title>
      </div>
      <div class="lg-hidden" v-if="description.length > 0">
        <button class="button primary dark" @click="toggleExpansion">
          {{isExpanded ? 'Less' : 'More'}}
        </button>
      </div>
    </div>
    <div class="flex lg:hidden p-4 align-center" :class="{
        'disable-bottom-padding-mobile': isExpanded
      }">
      <div class="w-full" v-if="description.length > 0">
        <button class="button w-full primary dark" @click="toggleExpansion">
          {{isExpanded ? 'Less' : 'More'}}
        </button>
      </div>
    </div>
    <div v-if="isExpanded" class="roadmap-item-content p-4">
      <template v-if="description">
        <common-title
          class="flex-grow mb-2"
          color="fence-light"
          textAlign="left"
          fontSize="22px"
          :closed="false"
        >
          Description
        </common-title>
        {{description}}
      </template>
      <template v-if="exampleLinks && (exampleLinks.length > 0)">
        <common-title
          class="flex-grow mb-2 mt-4"
          color="fence-light"
          textAlign="left"
          fontSize="22px"
          :closed="false"
        >
          Example Links
        </common-title>
        <div v-for="(exampleLink, index) in exampleLinks" :key="`${exampleLink}-${index}`">
          <a class="green-link" :href="exampleLink" rel="noopener noreferrer">{{exampleLink}}</a>
        </div>
      </template>
      <template 
        v-if="
          (githubLinksFrontend && (githubLinksFrontend.length > 0)) || 
          (githubLinksApi && (githubLinksApi.length > 0)) || 
          (githubLinksContracts && (githubLinksContracts.length > 0))
        ">
        <common-title
          class="flex-grow mb-2 mt-4"
          color="fence-light"
          textAlign="left"
          fontSize="22px"
          :closed="false"
        >
          Code Links
        </common-title>
        <div class="break-word" v-for="(githubLinkFrontend, index) in githubLinksFrontend" :key="`githubLinkFrontend-${githubLinkFrontend}-${index}`">
          <span style="font-weight: bold">[frontend]</span> <a class="green-link" target="_blank" :href="githubLinkFrontend" rel="noopener noreferrer">{{githubLinkFrontend}}</a>
        </div>
        <div class="break-word" v-for="(githubLinkApi, index) in githubLinksApi" :key="`githubLinkApi-${githubLinkApi}-${index}`">
          <span style="font-weight: bold">[api]</span> <a class="green-link" target="_blank" :href="githubLinkApi" rel="noopener noreferrer">{{githubLinkApi}}</a>
        </div>
        <div class="break-word" v-for="(githubLinkContracts, index) in githubLinksContracts" :key="`githubLinkContracts-${githubLinkContracts}-${index}`">
          <span style="font-weight: bold">[smart contract]</span> <a class="green-link" target="_blank" :href="githubLinkContracts" rel="noopener noreferrer">{{githubLinkContracts}}</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {ref, Transition} from "vue";
import CommonTitle from "./CommonTitle.vue";
import LightTypography from "./LightTypography.vue";

export default {
  name: "RoadmapEntry",
  props: {
    title: {
      type: String,
      default: "",
    },
    marginBottom: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "",
    },
    exampleLinks: {
      type: Array,
      default: () => []
    },
    githubLinksFrontend: {
      type: Array,
      default: () => []
    },
    githubLinksApi: {
      type: Array,
      default: () => []
    },
    githubLinksContracts: {
      type: Array,
      default: () => []
    },
  },
  components: {
    LightTypography,
    CommonTitle,
    Transition,
  },
  setup() {
    const isExpanded = ref(false);
    const toggleExpansion = () => {
      isExpanded.value = !isExpanded.value;
    }
    return {
      isExpanded,
      toggleExpansion
    }
  }
};
</script>


<style lang="scss" scoped>

.roadmap-card {
  max-width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
  border-radius: 10px;
  transition: all 0.2s ease-out;
  &:hover {
      box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
      transform: translateY(-2px);
  }
}

.disable-bottom-padding {
  @screen lg {
    padding-bottom: 0px!important;
  }
}

.disable-bottom-padding-mobile {
  @screen sm {
    padding-bottom: 0px;
  }
  @screen md {
    padding-bottom: 0px;
  }
}

.bottom-padding-mobile {
  @screen sm {
    @apply pb-1;
  }
  @screen md {
    @apply pb-1;
  }
  @screen lg {
    @apply pb-4;
  }
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

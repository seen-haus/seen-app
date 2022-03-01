<template>
  <!-- <a
    v-if="link && isExternalLink"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="icon-square rounded-xl flex-center" :class="{'pointer': link}">
      <div class="image-container">
        <div class="darkened-overlay max-width-height" />
        <img class="max-width-height" :src="require(`../assets/images/${image}`)"/>
      </div>
      <div class="title-container">
        <sub-title fontSize="28px" color="white">{{title}}</sub-title>
      </div>
    </div>
  </a>
  <router-link v-if="link && !isExternalLink" :to="link">
    <div class="icon-square rounded-xl flex-center" :class="{'pointer': link}">
      <div class="image-container">
        <div class="darkened-overlay max-width-height" />
        <img class="max-width-height" :src="require(`../assets/images/${image}`)"/>
      </div>
      <div class="title-container">
        <sub-title fontSize="28px" color="white">{{title}}</sub-title>
      </div>
    </div>
  </router-link> -->
  <external-or-internal-link :isExternalLink="isExternalLink" :link="link">
    <div class="icon-square rounded-xl flex-center" :class="{'pointer': link}">
      <div class="image-container">
        <div class="darkened-overlay max-width-height" />
        <img class="max-width-height" :src="require(`../assets/images/${image}`)"/>
      </div>
      <div class="title-container">
        <sub-title fontSize="28px" color="white">{{title}}</sub-title>
      </div>
    </div>
  </external-or-internal-link>
</template>

<script>
import SubTitle from "@/components/SubTitle.vue";
import ExternalOrInternalLink from "@/components/ExternalOrInternalLink.vue";

export default {
  name: "PaneLink",
  components: {
    SubTitle,
    ExternalOrInternalLink,
  },
  props: {
    image: String, // file name of image, must be in the src/assets/image folder
    title: String,
    link: String,
    isExternalLink: {
      default: false,
      type: Boolean,
    }
  },
};
</script>


<style lang="scss" scoped>
  .icon-square {
    background-color: black;
    overflow: hidden;
    width: 100%;
    height: 230px;
    position: relative;
    box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.4);
    transition: all 0.2s ease-out;
    &:hover {
      box-shadow: 0px 6px 30px rgba(142, 152, 160, 0.6);
      transform: translateY(-2px);
    }
    &:active {
      box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.3);
      transform: translateY(2px);
    }
  }

  .pointer {
    cursor: pointer;
  }
  .title-container {
    position: absolute;
    bottom: 5px;
    left: 15px;
  }
  .title-text {
    color: white;
  }
  .darkened-overlay {
    background-image: linear-gradient(transparent, black);
    position: absolute;
  }
  .image-container {
    min-width: 100%;
    min-height: 100%;
    position: relative;
  }
  .max-width-height {
    min-width: 100%;
    min-height: 100%;
  }
</style>

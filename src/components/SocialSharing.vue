<template>
  <div class="wrapme">
    <div class="relative mb-4" @click="showDropdown=!showDropdown">
    <button class="button white shadow-lifted">
      Share <i class="px-2 fas fa-share"></i>
    </button>

  <div v-if="showDropdown" class="dropup absolute rounded-md shadow-lg bg-white w-40">
    <div class="py-4">
      <a :href="twitterUrl" target="_blank" class="text-gray-700 block py-2 text-sm"><i class="mx-4 fab fa-twitter"></i>Twitter</a>
      <a :href="facebookUrl" target="_blank" class="text-gray-700 block py-2 text-sm"><i class="mx-4 fab fa-facebook"></i>Facebook</a>
      <a :href="pinterestUrl" target="_blank" class="text-gray-700 block py-2 text-sm"><i class="mx-4 fab fa-pinterest"></i>Pinterest</a>
      <span @click="shareUrl()" class="cursor-pointer text-gray-700 block py-2 text-sm"><i class="mx-4 fas fa-link"></i>Copy URL</span>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import {useToast} from "primevue/usetoast";

export default {
  name: "SocialSharing",
  data(){
    return {
      showDropdown: false
    }
  },
  props: {
  },
  methods: {
    shareUrl() {
      const dummy = document.createElement('input'),
      text = window.location.href;
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
    }
  },
  computed: {

    twitterUrl() {
      return "https://twitter.com/intent/tweet?text=" + window.location.href;
    },
    facebookUrl() {
      return "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
    },
    pinterestUrl() {
      return "https://pinterest.com/pin/create/button/?url=" + window.location.href;
    },
  },
};
</script>


<style>
.dropup {
  top: -190px;
  left: -18px;
  z-index: 100;
}

.white {
  background-color: white;
  color: black;
}

.wrapme {
  position: relative;
  float: right;
  margin-top: -100px;
}
</style>

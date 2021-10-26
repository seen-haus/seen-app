<template>
  <div class="wrapme" v-click-outside="handleClickOutside">
    <div class="relative">
      <button @click="showDropdown=!showDropdown" class="button shadow-lifted" :class="darkMode ? 'dark-mode-surface dark-mode-text' : 'light-mode-surface'">
        Share <i class="px-2 fas fa-share"></i>
      </button>
      <div v-if="showDropdown" class="dropup absolute rounded-md shadow-lg w-40" :class="darkMode ? 'dark-mode-surface dark-mode-text' : 'light-mode-surface text-gray-700'">
        <div class="py-4">
          <a :href="twitterUrl" @click="showDropdown=false" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-twitter"></i>Twitter</a>
          <a :href="facebookUrl" @click="showDropdown=false" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-facebook"></i>Facebook</a>
          <a :href="pinterestUrl" @click="showDropdown=false" target="_blank" class="block py-2 text-sm"><i class="mx-4 fab fa-pinterest"></i>Pinterest</a>
          <span @click="() => {shareUrl()}" class="cursor-pointer block py-2 text-sm"><i class="mx-4 fas fa-link"></i>Copy URL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useDarkMode from '@/hooks/useDarkMode';

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
      this.showDropdown = !this.showDropdown;
      const dummy = document.createElement('input'),
      text = window.location.href;
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
    },
    handleClickOutside() {
      this.showDropdown = false;
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
  setup() {
    const { darkMode } = useDarkMode();

    return {
      darkMode,
    }
  }
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
  transform: translateY(-50%);
}
</style>

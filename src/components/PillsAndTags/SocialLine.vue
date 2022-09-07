<template>
  <a class="cursor-pointer" 
    :class="{
      'w-full block': isVertical,
      'inline': !isVertical,
      'mr-8': !iconOnly
    }" :href="social.url" target="_blank" v-if="getSocialText(social)"
  >
    <i :class="'mr-2 text-lg ' + getSocialIcon(social)"></i>{{ iconOnly ? `` : getSocialText(social) }}
  </a>
</template>

<script>
export default {
  name: "ArtistCard",
  props: {
    social: Object,
    isVertical: {
      type: Boolean,
      default: false
    },
    iconOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getSocialIcon(social) {
      const type = social?.type;
      if (type === 'twitter') {
        return 'fab fa-twitter'
      } else if (type === 'instagram') {
        return 'fab fa-instagram'
      } else {
        return 'fas fa-link';
      }
    },
    getSocialText(social) {
      return social?.handle || social?.url || "";
    },
  },
};
</script>

<template>
  <a class="mr-8 cursor-pointer" :class="isVertical ? 'w-full block' : 'inline'" :href="social.url" target="_blank">
    <i :class="'mr-2 text-sm ' + getSocialIcon(social)"></i>{{ getSocialText(social) }}
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
    }
  },
  methods: {
    getSocialIcon(social) {
      const type = social.type;
      if (type === 'twitter') {
        return 'fab fa-twitter'
      } else if (type === 'instagram') {
        return 'fab fa-instagram'
      } else {
        return 'fas fa-link';
      }
    },
    getSocialText(social) {
      return social.handle || social.url;
    }
  },
};
</script>

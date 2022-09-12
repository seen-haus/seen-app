<template>
  <a class="cursor-pointer" 
    :class="{
      'w-full block': isVertical,
      'inline': !isVertical,
      'mr-8': !iconOnly
    }" :href="getSocialLink(social)" target="_blank" v-if="getSocialText(social)"
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
    getSocialLink(social) {
      let stripped = social?.handle.replace(/@/, '');
      if(social.type === 'twitter') {
        let extracted = stripped.split('twitter.com/');
        let username = extracted[extracted.length - 1];
        return `https://twitter.com/${username}`
      }
      if(social.type === 'instagram') {
        let extracted;
        if(stripped.indexOf('www.instagram.com/') > -1) {
          extracted = stripped.split('www.instagram.com/');
        } else {
          extracted = stripped.split('instagram.com/');
        }
        let username = extracted[extracted.length - 1];
        let hasTrailingSlash = username.indexOf('/') === username.length - 1;
        return hasTrailingSlash ? `https://instagram.com/${username}` : `https://instagram.com/${username}/`
      }
      if(social.type === 'website') {
        if(stripped.indexOf('http') === -1) {
          return `https://${stripped}`;
        } else {
          return stripped
        }
      }
    }
  },
};
</script>

<template>
  <a
    v-if="link && isExternalLink"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot></slot>
  </a>
  <router-link v-if="link && !isExternalLink" :to="link">
    <slot></slot>
  </router-link>
</template>

<script>

export default {
  name: "ExternalOrInternalLink",
  props: {
    link: String,
    isExternalLink: Boolean,
  },
};
</script>

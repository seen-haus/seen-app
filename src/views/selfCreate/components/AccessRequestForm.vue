<template>
  <div>
    <container>
        <sub-title
          class="text-black hidden lg:flex pt-6"
          text-align="center"
        >
          Access Request Required
        </sub-title>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";

import Container from "@/components/Container.vue";
import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
  name: "AccessRequestForm",
  components: {
    Container,
    SubTitle,
    LightTypography,
  },

  setup() {
    const { meta } = useMeta({
      title: "Access Request Form",
    });
  },
};
</script>

<style scoped lang="scss">

</style>
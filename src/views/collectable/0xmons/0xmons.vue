<template>
  <div class="dark-mode-section background-square">
    <div class="container mx-auto px-6 md:px-8">
      <div class="flex-center pt-12">
        <img class="xmons-logo" src="@/assets/images/0xmons-logo.png" alt="" />
      </div>
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pt-1"
          color="fence-dark"
          text-align="center"
        >
          <span class="text-gradient monospace">0xmons Physical Claim</span>
        </unfenced-title>
      </div>

      <div class="text-center md:w-1/2 md:mx-auto text-gray-600 text-lg pb-12">
        <light-typography>
          Claim physical collectables against your 0xmons NFT. This process does not involve burning or transferring your 0xmons, claims are simply based off ownership.
        </light-typography>
      </div>
    </div>
  </div>

  <div class="dark-mode-section background-square">
    <div class="container mx-auto px-6 md:px-8">
      
    </div>
  </div>
</template>

<script>
import { onUnmounted } from "vue";
import { useMeta } from "vue-meta";
import Container from "@/components/Container.vue";
import MediaLoader from "@/components/Media/MediaLoader.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

import { OpenSeaAPIService } from "@/services/apiService";

import useDarkMode from "@/hooks/useDarkMode";

export default {
  name: "0xmonsClaim",
  components: {
    Container,
    MediaLoader,
    UnfencedTitle,
    LightTypography,
  },
  setup() {

    const { darkMode, setDarkMode } = useDarkMode();

    setDarkMode(true);

    const { meta } = useMeta({
      title: "0xmons Claim",
    });

    onUnmounted(() => {
      setDarkMode(false);
    })
  },
};
</script>

<style scoped lang="scss">

.video-container {
  @screen sm {
    padding: 25px;
  }
  @screen md {
    padding: 25px;
  }
  @screen lg {
    padding-bottom: 25px;
  }
}

.video-position {
  position: relative;
}

.heading-align {
  @screen sm {
    text-align: left;
  }
  @screen md {
    text-align: left;
  }
}

.text-gradient {
  background: -webkit-linear-gradient(0deg, #11998e 1.74%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #26c785;
}

.abstract-circles-about {
  top: 425px;
  right: 97px;
}

.abstract-circles-two {
  top: 1025px;
  left: 350px;
}

.abstract-circles-three {
  top: 2050px;
  left: 1px;
}

.shadow-container {
  box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
}

.xmons-logo {
  height: 300px;
}
</style>
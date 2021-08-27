<template>
  <div class="privacy">
    <container class="pb-12">
      <div class="flex items-center py-6 flex-col lg:flex-row">
        <unfenced-title
          class="text-black hidden lg:flex pb-7 pt-12"
          color="fence-dark"
          text-align="left"
        >
          Privacy
        </unfenced-title>
      </div>
      <div class="privacy-list">
        <div>
          <h2 class="mx-auto mb-3 text-lg font-title font-bold flex-1">
            What is Lorem Ipsum?
          </h2>
          <light-typography class="mb-10" textAlign="left">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </light-typography>

          <h2 class="mx-auto mb-3 text-lg font-title font-bold flex-1">
            What is Lorem Ipsum?
          </h2>
          <light-typography class="mb-10" textAlign="left">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of
            <a
              href=""
              class="green-link"
              target="_blank"
            >
              Lorem Ipsum.
            </a>
          </light-typography>

          <h2 class="mx-auto mb-3 text-lg font-title font-bold flex-1">
            What is Lorem Ipsum?
          </h2>
          <light-typography class="mb-10" textAlign="left">
            <ul>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
            </ul>
          </light-typography>

          <h2 class="mx-auto mb-3 text-lg font-title font-bold flex-1">
            What is Lorem Ipsum?
          </h2>
          <light-typography textAlign="left">
            <ol>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
                <li>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </li>
            </ol>
          </light-typography>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import { useMeta } from "vue-meta";
import { useStore } from "vuex";

import Container from "@/components/Container.vue";
import UnfencedTitle from "@/components/UnfencedTitle.vue";
import LightTypography from "../../components/LightTypography.vue";

export default {
  name: "Privacy",
  components: {
    Container,
    UnfencedTitle,
    LightTypography,
  },

  setup() {
    const { meta } = useMeta({
      title: "PRIVACY",
    });

    const store = useStore();

    // Disable dark mode until dark mode is supported across website
    store.dispatch("application/setDarkMode", false);
  },
};
</script>

<style scoped>

ul {
    list-style-type: disc;
    list-style-position: inside;
}

ol {
    list-style-type: decimal;
    list-style-position: inside;
}

</style>
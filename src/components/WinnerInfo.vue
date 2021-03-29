

<template>
  <Dialog :header="collectable.name" v-model:visible="displayModal" :style="{width: '50vw'}" :modal="true">
    <p class="p-m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <template #footer>
      <button icon="pi pi-times" @click="submitWinnerData" class="p-button-text">Submit</button>
    </template>
  </Dialog>
</template>

<script>
import Container from "@/components/Container";
import {ref} from 'vue';

export default {
  name: "TopHeaderBar",
  components: { Container },
  props: {
    collectable: Object,
  },
  setup() {
    const displayModal = ref(false);
    const submitWinnerData = () => {

    }
    return {
      displayModal,
      submitWinnerData,
    };
  },
};
</script>

<style scoped lang="scss">

</style>

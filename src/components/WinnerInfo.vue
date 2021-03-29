

<template>
  <Dialog :header="collectableData.title" v-model:visible="displayModal" :style="{width: '50vw'}" :modal="true">
    <div>
      <div class="fc mb-4">
        <label for="winner-email">Email</label>
        <div class="outlined-input mt-2">
          <input type="email" id="winner-email" placeholder="Your email" />
        </div>
      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-name">Name</label>
          <div class="outlined-input mt-2">
            <input type="text" id="winner-name" placeholder="Your name" />
          </div>
        </div>
        <div class="fc mb-4">
          <label for="winner-surname">Surname</label>
          <div class="outlined-input mt-2">
            <input type="text" id="winner-surname" placeholder="Your surname" />
          </div>
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-phone">Phone</label>
        <div class="outlined-input mt-2">
          <input type="phone" id="winner-phone" placeholder="Your phone" />
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-telegram">Telegram Username (optional)</label>
        <div class="outlined-input mt-2">
          <input type="email" id="winner-telegram" placeholder="Your Telegram username" />
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-address">Address</label>
        <div class="outlined-input mt-2">
          <input type="text" id="winner-address" placeholder="Your address" />
        </div>
      </div>
      <div class="fc mb-4">
        <label for="winner-city">City</label>
        <div class="outlined-input mt-2">
          <input type="text" id="winner-city" placeholder="Your city" />
        </div>
      </div>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="fc mb-4">
          <label for="winner-state">State / Province</label>
          <div class="outlined-input mt-2">
            <input type="text" id="winner-state" placeholder="Your state / province" />
          </div>
        </div>
        <div class="fc mb-4">
          <label for="winner-country">Country</label>
          <div class="outlined-input mt-2">
            <input type="text" id="winner-country" placeholder="Your country" />
          </div>
        </div>
      </div>
      
    </div>
    <template #footer>
      <div class="flex items-center justify-center mb-4 mt-8">
        <button class="cursor-pointer primary button mt-3 md:mt-0">
            Join&nbsp;Submit
          </button>
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import {ref} from 'vue';
import emitter from "@/services/utils/emitter"

export default {
  name: "TopHeaderBar",
  components: { Dialog },
  props: {
    collectable: Object,
  },
  setup() {
    const displayModal = ref(false);
    const collectableData = ref({});
    emitter.on('openWinnerModal', payload => {
      debugger; // eslint-disable-line
      collectableData.value = payload;
      displayModal.value = true;
    })
    
    const submitWinnerData = () => {
      
    }
    return {
      displayModal,
      collectableData,
      submitWinnerData,
    };
  },
};
</script>

<style lang="scss">
  .p-dialog {
    max-width: 36rem;
  }
</style>

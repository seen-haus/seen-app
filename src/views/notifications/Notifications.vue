<template>
  <div>
    <container class="section-featured-auctions pb-12 max-w-screen-md">
        <notification-manager-form :showTitle="true"/>
    </container>
  </div>
</template>

<script>

import Container from "@/components/Container.vue";
import NotificationManagerForm from "@/components/NotificationManagerForm.vue";

export default {
  name: "Notifications",
  components: {
    Container,
    NotificationManagerForm,
  },
};
</script>

<style scoped>
</style>

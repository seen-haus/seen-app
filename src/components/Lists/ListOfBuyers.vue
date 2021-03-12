<template>
  <div
    class="list-of-buyers rounded-container"
  >
    <template v-for="(item, index) in 5" :key="item">
      <div class="list-tile flex items-center py-6">
        <img
          class="user-img rounded-full mr-4"
          src="http://placekitten.com/40/40"
        />

        <div class="flex flex-col flex-grow">
          <div class="address text-gray-500">0xc22...8Ff609CF3A</div>
          <div class="time text-xs text-gray-400">3 weeks ago</div>
        </div>

        <price-display size="xs" class="items-end"/>
      </div>

      <div v-if="index != 4" class="divider h-0 border-t-2 border-gray-200"></div>

    </template>

    <button class="button outline w-full mt-6">Load More</button>
  </div>
</template>

<script>
import PriceDisplay from "@/components/PillsAndTags/PriceDisplay.vue";

export default {
  name: "ListOfBuyers",
  components: { PriceDisplay },
};
</script>
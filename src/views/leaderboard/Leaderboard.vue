<template>
  <div class="user-loaderboard">
    <container class="py-6 mb-24">
      <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Leaderboard</fenced-title
      >

      <div class="description text-gray-600 mx-auto text-center py-4 text-lg">
        The leaderboard is a great way to see who spent the most, how many
        artworks they owned and how many bids they placed.
      </div>
    </container>
    <div class="bg-background-gray border-t">
      <container class="py-6">
        <div
          class="leaderboard bg-white rounded-lg shadow-lifted overflow-hidden px-6 py-12 mx-auto -mt-28"
        >
          <div class="grid">
            <div
              class="headers flex flex-col lg:flex-row text-gray-400 font-medium text-sm text-center lg:text-right mb-4 px-8"
            >
              <div class="flex-1 lg:text-left">COLLECTOR</div>
              <div class="flex-shrink-0 lg:w-40">ARTWORKS OWNED</div>
              <div class="flex-shrink-0 lg:w-40">NUMBER OF BIDS</div>
              <div class="flex-shrink-0 lg:w-40">AMOUNT SPENT</div>
            </div>

            <div
              class="first-three flex flex-col rounded-lg shadow-lifted-sm"
            >
              <template v-for="place in 3" :key="place">
                <leaderboard-tile class="px-8" :place="place - 1" :selected="place === 2"/>
                <div
                  v-if="place != 3"
                  class="divider h-0 border-t border-gray-300"
                ></div>
              </template>
            </div>

            <div class="others flex flex-col pt-8">
              <leaderboard-tile class="px-8" v-for="place in 5" :key="place" :selected="place===3"/>
            </div>
          </div>
        </div>

        <button class="button dark mt-12 mb-28 mx-auto w-full md:w-96">Load More</button>
      </container>
    </div>
  </div>
</template>

<script>
import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import LeaderboardTile from "@/views/leaderboard/components/LeaderboardTile.vue";

export default {
  name: "Leaderboard",
  components: {
    FencedTitle,
    Container,
    LeaderboardTile,
  },
};
</script>

<style scoped>
@screen lg {
  .description {
    max-width: 750px;
  }

  .leaderboard {
    max-width: 880px;
  }
}
</style>

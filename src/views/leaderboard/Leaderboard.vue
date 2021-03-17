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
    <div class="bg-background-gray border-t pb-28">
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

            <template v-if="isLoading">
              <div class="flex justify-center items-middle py-16 text-lg">Loading...</div>
            </template>

            <template v-else>
              <div
                class="first-three flex flex-col rounded-lg shadow-lifted-sm"
              >
                <template
                  v-for="(user, index) in users.slice(0, 3)"
                  :key="user.id"
                >
                  <leaderboard-tile class="px-8" :place="index" :user="user" />
                  <div
                    v-if="index != 2"
                    class="divider h-0 border-t border-gray-300"
                  ></div>
                </template>
              </div>

              <div class="others flex flex-col pt-8">
                <leaderboard-tile
                  v-for="user in users.slice(3)"
                  :key="user.id"
                  :user="user"
                  class="px-8"
                />
              </div>
            </template>
          </div>
        </div>
      </container>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from "vue";
import { LeaderboardService } from "@/services/apiService";

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
  setup() {
    const state = reactive({
      isLoading: true,
      users: [],
    });

    const isLoading = computed(() => state.isLoading);
    const users = computed(() => state.users);

    (async function () {
      state.isLoading = true;
      const { data } = await LeaderboardService.get();
      
      state.users = data.sort((a, b) => +b.amount_spent - +a.amount_spent);
      state.isLoading = false;
    })();

    return {
      isLoading,
      users,
    };
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

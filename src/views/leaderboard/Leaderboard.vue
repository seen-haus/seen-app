<template>
  <div class="user-loaderboard">
    <container class="py-6 mb-24">
      <fenced-title
        class="flex-grow mr-0 mb-2 self-stretch"
        color="fence-gray"
        textAlign="center"
        :closed="true"
        >Top Collectors</fenced-title
      >

      <div class="description text-gray-600 mx-auto text-center py-4 text-lg">
        Here’s a list of our Top Collectors.
      </div>
    </container>
    <div class="pb-28">
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
              <!-- <div class="flex-shrink-0 lg:w-40">NUMBER OF BIDS</div> -->
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
                  v-for="(user, index) in extendedUsers.slice(0, 3)"
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
                  v-for="user in extendedUsers.slice(3)"
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
import { computed, reactive, watch, ref } from "vue";
import { useMeta } from "vue-meta";

import { LeaderboardService } from "@/services/apiService";
import { UserService } from "@/services/apiService"

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
    const { meta } = useMeta({
      title: "Collectors",
    });
    const state = reactive({
      isLoading: true,
      users: [],
    });

    const extendedUserData = ref({});

    const isLoading = computed(() => state.isLoading);
    const users = computed(() => state.users);

    const extendedUsers = computed(() => [...state.users].map(v => {
        const ud = extendedUserData.value[v.wallet_address.toLowerCase()];
        return {...v, username: ud && ud.username, image: ud && ud.image}
      })
    );

    (async function () {
      state.isLoading = true;
      const { data } = await LeaderboardService.get();

      state.users = data.sort((a, b) => +b.amount_spent - +a.amount_spent);
      state.isLoading = false;
    })();

    function getExtendedUserData(newList) {
      if (!newList && newList.length === 0) return;

      const payload = {
        walletAddresses: newList.map(v => v.wallet_address)
      };

      UserService.getExtendedUserData(payload).then(res => {
        extendedUserData.value = res.data.reduce((p, v) => {
          p[v.walletAddress.toLowerCase()] = {username: v.username, image: v.image};
          return p;
        }, {});
      }).catch(e => {
        console.error(e);
      });
    }

    watch(users, getExtendedUserData);

    return {
      isLoading,
      users,
      extendedUsers,
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

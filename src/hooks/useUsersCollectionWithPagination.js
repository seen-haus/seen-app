import { OpenSeaAPIService } from "@/services/apiService";
import { computed, reactive } from "vue";

export default function useUsersCollectionWithpagination(address = null) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    limit: 6,
    offset: 0,
    hasMore: false,
    address,
    error: null,
  });

  async function load() {
    state.limit = 6;
    state.offset = 0;
    state.hasMore = false;

    state.items = [
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    try {
      const data = await OpenSeaAPIService.getProfileEntries(state.address, state.limit, state.offset);
      state.items = data;
      state.hasMore = data.length === state.limit;
    } catch (e) {
      state.error = e;
    }
  }

  async function loadMore() {
    if (!state.hasMore) return;

    state.offset += state.limit;
    state.items = [
      ...state.items,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    try {
      const data = await OpenSeaAPIService.getProfileEntries(state.address, state.limit, state.offset);

      state.items = [
        ...state.items.filter((i) => i != null),
        ...data,
      ];

      state.hasMore = data.assets.length === 6;
    } catch (e) {
      state.error = e;
    }
  }

  const listOfCollectables = computed(() => state.items);
  const hasMore = computed(() => state.hasMore);
  const error = computed(() => state.error);

  return {
    listOfCollectables,
    load,
    hasMore,
    error,
    loadMore,
  };

}
import { ArtistService } from "@/services/apiService";
import { computed, reactive } from "vue";


export default function useArtistsWithPagination(pagNumber = 6) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    perPage: pagNumber,
    page: 1,
    hasMore: false
  });

  async function load() {
    state.perPage = pagNumber;
    state.page = 1;
    state.hasMore = false;

    state.items = [
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const pagination = {
      perPage: state.perPage,
      page: state.page,
    };

    const { data, metadata } = await ArtistService.list(
      pagination,
    );

    state.items = data;
    state.hasMore =
      metadata.pagination.totalPages !== state.page;
  }

  async function loadMore() {
    if (!state.hasMore) return;

    const pagination = {
      perPage: state.perPage,
      page: state.page + 1,
    };

    state.items = [
      ...state.items,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const { data, metadata } = await ArtistService.list(
      pagination,
    );

    state.page += 1;
    state.items = [
      ...state.items.filter((i) => i != null),
      ...data,
    ];

    state.hasMore =
      metadata.pagination.totalPages !== state.page;
  }


  const listOfArtists = computed(() => state.items);
  const hasMore = computed(() => state.hasMore);

  return {
    listOfArtists,
    hasMore,
    load,
    loadMore,
  };
}

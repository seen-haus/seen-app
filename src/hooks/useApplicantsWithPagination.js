import { CurationService } from "@/services/apiService";
import { computed, reactive } from "vue";


export default function useApplicantsWithPagination(
  applicantType,
  perPage = 12,
  initAdditionalFiltrationOptions = {}
) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    perPage: perPage,
    page: 1,
    hasMore: false,
    filter: applicantType,
    additionalFiltrationOptions: initAdditionalFiltrationOptions
  });

  async function load(roundDeclarationId) {
    state.perPage = perPage;
    state.page = 1;
    state.hasMore = false;

    state.items = [];

    const pagination = {
      perPage: state.perPage,
      page: state.page,
    };

    const filtrationOptions = { applicantType: state.filter, roundDeclarationId };

    // if(state.additionalFiltrationOptions) {
    //   if (state.additionalFiltrationOptions.artistId != null) {
    //     filtrationOptions.artistId = state.additionalFiltrationOptions.artistId;
    //   }
    // }

    const { data, metadata } = await CurationService.curationApplicants(
      pagination,
      filtrationOptions,
    );

    console.log({data})

    state.items = data;
    state.hasMore =
      metadata.pagination.totalPages > state.page;
  }

  async function loadMore(roundDeclarationId) {
    if (!state.hasMore) return;

    const pagination = {
      perPage: state.perPage,
      page: state.page + 1,
    };

    state.items = [
      ...state.items
    ];

    const filtrationOptions = { applicantType: state.filter, roundDeclarationId };
    if(state.additionalFiltrationOptions) {
      // if (state.additionalFiltrationOptions.artistId != null) {
      //   filtrationOptions.artistId = state.additionalFiltrationOptions.artistId;
      // }
    }

    const { data, metadata } = await CurationService.curationApplicants(
      pagination,
      filtrationOptions,
    );

    state.page += 1;
    state.items = [
      ...state.items.filter((i) => i != null),
      ...data,
    ];

    state.hasMore =
      metadata.pagination.totalPages !== state.page;
  }

  const listOfApplicants = computed(() => state.items);
  const hasMore = computed(() => state.hasMore);

  return {
    listOfApplicants,
    hasMore,
    // filter,
    load,
    loadMore,
  };
}

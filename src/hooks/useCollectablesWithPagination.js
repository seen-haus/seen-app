import { CollectablesService } from "@/services/apiService";
import { COLLECTABLE_TYPE } from "@/constants/Collectables.js";
import { computed, reactive } from "vue";


export default function useCollectablesWithPagination(purchaseType = 1, perPage = 6) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    perPage: perPage,
    page: 1,
    hasMore: false,
    filter: COLLECTABLE_TYPE.NONE,
  });

  async function load() {
    state.perPage = perPage;
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

    const { data, metadata } = await CollectablesService.list(
      pagination,
      { type: state.filter, purchaseType },
    );

    // Mock
    // let mockData = [];
    // if (state.page == 1) {
    //   console.log('insert mocks');
    //   const mockSale = { ...data[0] };

    //   mockSale.id = 1000;
    //   mockSale.starts_at = '2021-04-15T17:14:50.000Z';
    //   mockSale.ends_at = '2021-04-17T07:00:00.000Z';
    //   mockSale.is_sold_out = 0;
    //   mockSale.title = 'MockSale';
    //   mockSale.available_qty = 100;
    //   mockSale.events = [];

    //   const mockAuction = { ...data.filter(v => v.id === 23)[0] };

    //   // console.log('mokc auticon', mockAuction);
    //   mockAuction.id = 2000;
    //   mockAuction.title = 'MockAuction';
    //   mockAuction.ends_at = '2021-04-15T07:00:00.000Z';
    //   mockAuction.is_sold_out = 0;
    //   mockAuction.events = [];


    //   console.log(mockSale);
    //   console.log(mockAuction);

    //   //data.unshift(mockAuction);
    //   // data.unshift(mockSale);
    //   mockData = [mockSale];
    // }

    state.items = data;
    state.hasMore =
      metadata.pagination.totalPages > state.page;
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

    const { data, metadata } = await CollectablesService.list(
      pagination,
      { type: state.filter, purchaseType },
    );

    state.page += 1;
    state.items = [
      ...state.items.filter((i) => i != null),
      ...data,
    ];

    state.hasMore =
      metadata.pagination.totalPages !== state.page;
  }

  function filter(filterNft, filterTangibleNft) {
    state.filter = getFilter(filterNft, filterTangibleNft);
    load();
  }

  function getFilter(filterNft, filterTangibleNft) {
    if (filterNft && filterTangibleNft)
      return COLLECTABLE_TYPE.NONE;
    if (filterNft)
      return COLLECTABLE_TYPE.NFT;
    if (filterTangibleNft)
      return COLLECTABLE_TYPE.TANGIBLE_NFT;

    return COLLECTABLE_TYPE.TANGIBLE;
  }

  const listOfCollectables = computed(() => state.items);
  const hasMore = computed(() => state.hasMore);

  return {
    listOfCollectables,
    hasMore,
    filter,
    load,
    loadMore,
  };
}
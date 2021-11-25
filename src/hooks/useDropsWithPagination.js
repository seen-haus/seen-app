import { CollectablesService } from "@/services/apiService";
import { COLLECTABLE_TYPE } from "@/constants/Collectables.js";
import PURCHASE_TYPE from "@/constants/PurchaseTypes.js";
import { computed, reactive } from "vue";


export default function useDropsWithPagination(
  artistId = null,
  perPage = 12,
  initAdditionalFiltrationOptions = {}
) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    perPage: perPage,
    page: 1,
    hasMore: false,
    filter: PURCHASE_TYPE.BOTH,
    artistId,
    additionalFiltrationOptions: initAdditionalFiltrationOptions
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

    const filtrationOptions = { purchaseType: state.filter };
    if (artistId != null) {
      filtrationOptions.artistId = artistId;
    }

    if(state.additionalFiltrationOptions) {
      if (state.additionalFiltrationOptions?.includeIsHiddenFromDropList) {
        filtrationOptions.includeIsHiddenFromDropList = true;
      }
      if(state.additionalFiltrationOptions?.bundleChildId){
        filtrationOptions.bundleChildId = state.additionalFiltrationOptions.bundleChildId;
      }
      if(state.additionalFiltrationOptions?.collectionName) {
        filtrationOptions.collectionName = state.additionalFiltrationOptions.collectionName;
      }
      if(state.additionalFiltrationOptions?.excludeEnded) {
        filtrationOptions.excludeEnded = state.additionalFiltrationOptions.excludeEnded;
      }
      if(state.additionalFiltrationOptions?.excludeLive) {
        filtrationOptions.excludeLive = state.additionalFiltrationOptions.excludeLive;
      }
      if(state.additionalFiltrationOptions?.excludeComingSoon) {
        filtrationOptions.excludeComingSoon = state.additionalFiltrationOptions.excludeComingSoon;
      }
    }

    const { data, metadata } = await CollectablesService.list(
      pagination,
      filtrationOptions,
    );

    // Mock
    // let mockData = [];
    // if (state.page == 1) {
    //   console.log('insert mocks');
    //   const mockSale = { ...data[0] };

    //   mockSale.id = 1000;
    //   mockSale.ends_at = '2021-05-02T07:00:00.000Z';
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
    //   mockData = [mockAuction];
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

    const filtrationOptions = { purchaseType: state.filter };
    if (artistId != null) {
      filtrationOptions.artistId = artistId;
    }
    if(state.additionalFiltrationOptions) {
      if (state.additionalFiltrationOptions?.includeIsHiddenFromDropList) {
        filtrationOptions.includeIsHiddenFromDropList = true;
      }
      if(state.additionalFiltrationOptions?.bundleChildId){
        filtrationOptions.bundleChildId = state.additionalFiltrationOptions.bundleChildId;
      }
      if(state.additionalFiltrationOptions?.collectionName) {
        filtrationOptions.collectionName = state.additionalFiltrationOptions.collectionName;
      }
      if(state.additionalFiltrationOptions?.excludeEnded) {
        filtrationOptions.excludeEnded = state.additionalFiltrationOptions.excludeEnded;
      }
      if(state.additionalFiltrationOptions?.excludeLive) {
        filtrationOptions.excludeLive = state.additionalFiltrationOptions.excludeLive;
      }
      if(state.additionalFiltrationOptions?.excludeComingSoon) {
        filtrationOptions.excludeComingSoon = state.additionalFiltrationOptions.excludeComingSoon;
      }
    }

    const { data, metadata } = await CollectablesService.list(
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

  function filter(filterAuctions, filterEditions, additionalFiltrationOptions) {
    state.filter = getFilter(filterAuctions, filterEditions);
    state.additionalFiltrationOptions = {...state.additionalFiltrationOptions, ...additionalFiltrationOptions};
    load();
  }

  function getFilter(filterAuctions, filterEditions) {
    if (filterAuctions && filterEditions)
      return PURCHASE_TYPE.BOTH;
    if (filterAuctions)
      return PURCHASE_TYPE.AUCTION;
    if (filterEditions)
      return PURCHASE_TYPE.SALE;

    return COLLECTABLE_TYPE.BOTH;
  }

  // function filter(filterNft, filterTangibleNft) {
  //   state.filter = getFilter(filterNft, filterTangibleNft);
  //   load();
  // }

  // function getFilter(filterNft, filterTangibleNft) {
    // if (filterNft && filterTangibleNft)
    //   return COLLECTABLE_TYPE.NONE;
    // if (filterNft)
    //   return COLLECTABLE_TYPE.NFT;
    // if (filterTangibleNft)
    //   return COLLECTABLE_TYPE.TANGIBLE_NFT;

    // return COLLECTABLE_TYPE.TANGIBLE;
  // }

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

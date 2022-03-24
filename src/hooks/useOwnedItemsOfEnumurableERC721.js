import {OpenSeaAPIService} from "@/services/apiService";
import {computed, reactive} from "vue";
import {Web3Provider} from "@ethersproject/providers";
import { useERC721EnumerableContract } from "../hooks/useContract";

export default function useOwnedItemsOfEnumurableERC721(holderAddress = null, tokenAddress = null, limit = 50) {
    const state = reactive({
        items: [],
        limit: limit,
        offset: 0,
        hasMore: false,
        holderAddress,
        tokenAddress,
        error: null,
    });

    const setHolderAddress = (holderAddress) => {
        state.holderAddress = holderAddress;
    }

    const setTokenAddress = (tokenAddress) => {
      state.tokenAddress = tokenAddress;
    }

    async function load() {
        state.limit = limit;
        state.offset = 0;
        state.hasMore = false;

        state.items = [];

        try {
            const contract = await useERC721EnumerableContract(true, state.tokenAddress);
            let broken = false;
            for(let i = 0; !broken; i++) {
              try {
                let firstOwned = await contract.tokenOfOwnerByIndex(state.holderAddress, i);
              } catch (e) {
                broken = true;
              }
            }
            console.log("Done")
            // const data = await OpenSeaAPIService.getOwnedCollectables(state.holderAddress, state.limit, state.offset, state.collection);
            // state.items = data;
            // state.hasMore = data.length === state.limit;
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
            const data = await OpenSeaAPIService.getProfileEntries(state.holderAddress, state.limit, state.offset, state.collection);

            state.items = [
                ...state.items.filter((i) => i != null),
                ...data,
            ];

            state.hasMore = data.length === limit;
        } catch (e) {
            console.log(e)
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
        setHolderAddress,
        setTokenAddress,
    };

}

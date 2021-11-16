import {OpenSeaAPIService} from "@/services/apiService";
import {computed, reactive} from "vue";

export default function useUsersCollectionWithPaginationV3(address = null, chainId = null) {
    const state = reactive({
        items: [null, null, null, null, null, null],
        limit: 6,
        offset: 0,
        hasMore: false,
        address,
        chainId,
        error: null,
        loading: false,
    });

    const setAddress = (address) => {
        state.address = address;
    }

    const setChainId = (chainId) => {
        state.chainId = chainId;
    }

    async function load() {
        state.limit = 6;
        state.offset = 0;
        state.hasMore = false;
        state.loading = true;

        state.items = [];

        try {
            const data = await OpenSeaAPIService.getProfileEntriesV3(state.chainId, state.address, state.limit, state.offset);
            state.loading = false;
            state.items = data;
            state.hasMore = data.length === state.limit;
        } catch (e) {
            state.loading = false;
            state.error = e;
        }
    }

    async function loadMore() {
        if (!state.hasMore) return;

        state.loading = true;

        state.offset += state.limit;
        state.items = [
            ...state.items,
        ];

        try {
            const data = await OpenSeaAPIService.getProfileEntriesV3(state.chainId, state.address, state.limit, state.offset);

            state.loading = false;

            state.items = [
                ...state.items.filter((i) => i != null),
                ...data,
            ];

            state.hasMore = data.length === 6;
        } catch (e) {
            state.loading = false;
            console.log(e)
            state.error = e;
        }
    }

    const listOfCollectables = computed(() => state.items);
    const hasMore = computed(() => state.hasMore);
    const error = computed(() => state.error);
    const loading = computed(() => state.loading);

    return {
        listOfCollectables,
        load,
        hasMore,
        error,
        loading,
        loadMore,
        setAddress,
        setChainId,
    };

}

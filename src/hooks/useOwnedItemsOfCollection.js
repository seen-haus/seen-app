import {OpenSeaAPIService} from "@/services/apiService";
import {computed, reactive} from "vue";

export default function useOwnedItemsOfCollection(address = null, collection = "seen-haus") {
    const state = reactive({
        items: [null, null, null, null, null, null],
        limit: 6,
        offset: 0,
        hasMore: false,
        address,
        collection,
        error: null,
    });

    const setAddress = (address) => {
        state.address = address;
    }

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
            const data = await OpenSeaAPIService.getProfileEntries(state.address, state.limit, state.offset, state.collection);
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
            const data = await OpenSeaAPIService.getProfileEntries(state.address, state.limit, state.offset, state.collection);

            state.items = [
                ...state.items.filter((i) => i != null),
                ...data,
            ];

            state.hasMore = data.length === 6;
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
        setAddress,
    };

}

import {TokenCacheService} from "@/services/apiService";
import {computed, reactive} from "vue";

export default function useTokenCache(holderAddress = null, tokenAddress = null) {
    const state = reactive({
        tokenCache: [],
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
        state.offset = 0;
        state.hasMore = false;

        state.tokenCache = [];

        try {
            console.log("test")
            const result = await TokenCacheService.fetchTokenCacheByHolder(state.tokenAddress, state.holderAddress);
            state.tokenCache = result.data;
            state.hasMore = result.data.length === state.limit;
        } catch (e) {
            state.error = e;
        }
    }

    const tokenCache = computed(() => state.tokenCache);
    const error = computed(() => state.error);

    return {
        tokenCache,
        load,
        error,
        setHolderAddress,
        setTokenAddress,
    };

}

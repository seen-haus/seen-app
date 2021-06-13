import {IPFSService} from "@/services/apiService";
import {computed, reactive} from "vue";

export default function useIPFS(uri) {
    const state = reactive({
        item: null,
        uri,
        hash: null,
        error: null,
        loading: null
    });

    const setUri = (uri) => {
        state.uri = uri
    };

    const item = computed(() => state.item);
    const loading = computed(() => !(state.item || state.error));
    const error = computed(() => state.error);
    const hash = computed(() => state.uri.split('/').pop());

    async function load() {
        state.item = null;
        state.loading = true;
        try {
            state.item = await IPFSService.get(hash.value);
        } catch (e) {
            state.error = e;
        }
    }

    return {
        item,
        error,
        hash,
        uri: state.uri,
        setUri,
        load,
        loading
    };

}

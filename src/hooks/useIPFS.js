import { IPFSService } from "@/services/apiService";
import { computed, watchEffect, ref } from "vue";

export default function useIPFS(ipfsUri) {
    const item = ref(null);
    const error = ref(false);
    const loading = computed(() => !(item.value || error.value));

    watchEffect(async () => {
        if (!ipfsUri.value) {
            return;
        }

        item.value = null;
        error.value = null;

        try {
            item.value = await IPFSService.get(ipfsUri.value);
        } catch (e) {
            error.value = e;
        }
    });

    return {
        item,
        error,
        loading,
    };
}

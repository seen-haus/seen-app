import copy from 'copy-to-clipboard'
import {ref} from 'vue';

export default function useCopyClipboard(timeout = 500) {
    const isCopied = ref(false);
    const staticCopy = (text) => {
        copy(text);
        isCopied.value = true
        setTimeout(() => {
            isCopied.value = false
        }, timeout)
    }
    return {isCopied, staticCopy}
}

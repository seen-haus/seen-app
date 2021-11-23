<template>
    <modal :visible="isModalOpen" class="rounded-lg">
        <modal-header class="rounded-t-lg font-title text-red-600">{{ title }}</modal-header>
        <modal-content class="rounded-b-lg">{{ message }}</modal-content>
        <footer>
            <button @click="disconnectFunction" class="button w-full bottom-0 p-4 cursor-pointer">Disconnect</button>
        </footer>
    </modal>
</template>

<script>
import {computed, watchEffect} from "vue";

import {useStore} from "vuex";

import Modal from "@/components/Modal/Modal";
import ModalHeader from "@/components/Modal/Header";
import ModalContent from "@/components/Modal/Content";
import {DEFAULT_CHAIN_ID} from "@/constants/ChainIds";
import useWeb3 from "@/connectors/hooks";

export default {
    name: "NetworkModal",
    components: {
        ModalHeader,
        ModalContent,
        Modal
    },
    setup() {
        const store = useStore();
        const {deactivate, activate, chainId} = useWeb3();

        const modalName = "NetworkModal";

        const disconnectFunction = () => {
            store.dispatch("application/closeModal");
            store.dispatch("user/setUser", null);
            deactivate();
        };

        const title = "Wrong Network";
        const message = "You're on the wrong network. Switch to the Ethereum Mainnet network or disconnect your wallet.";
        const isModalOpen = computed(() => store.getters["application/openModal"] === modalName);

        const openModal = () => {
            store.dispatch("application/openModal", modalName);
        };

        const closeModal = () => {
            store.dispatch("application/closeModal");
        };

        watchEffect(() => {
            if (!isModalOpen.value) {
                return;
            }

            const useChainId = Number(chainId.value);

            if (useChainId === DEFAULT_CHAIN_ID) {
                closeModal();
            }
        });

        watchEffect(() => {
            if (!chainId?.value) {
                return;
            }

            const useChainId = Number(chainId.value);

            if (useChainId !== DEFAULT_CHAIN_ID) {
                openModal();
            }
        });

        return {
            isModalOpen,
            title,
            message,
            disconnectFunction
        };
    }
};
</script>

<style scoped>
</style>

<template>
    <div
        class="
            stake-or-withdraw-card
            rounded-lg
            overflow-hidden
            shadow-lifted
            flex-1 flex
            bg-white
        "
    >
        <div class="py-7 px-10 flex-1">
            <div class="text-4xl font-title font-bold mb-6">Staking Pool</div>

            <button
                class="button primary w-full font-base"
                @click="openWalletModal"
                v-if="!account"
            >
                Connect Wallet
            </button>
            <button
                class="button primary w-full text-base font-bold"
                :class="{
                    'cursor-wait disabled opacity-50': state.distributing,
                }"
                @click="distribute"
                v-if="account"
                :disabled="state.distributing"
            >
                {{ state.distributing ? "Dsitributing..." : "Distribute" }}
            </button>
            <div class="text-sm text-gray-400 my-2">
                Last distributed SOMETIME{{
                    latestDistributorUsername
                        ? " by " + latestDistributorUsername
                        : null
                }}
            </div>
        </div>
        <div
            class="
                h-full
                bg-background-gray
                py-7
                px-10
                text-gray-400 text-2xs
                tracking-wide
                border-t
                flex-1
            "
        >
            <p class="text-sm font-bold uppercase mb-5">
                Staking pool balance
                <i
                    class="fas fa-info-circle"
                    v-tooltip="{ text: 'Staking pool balance' }"
                ></i>
            </p>
            <p class="mb-5">
                <img
                    src="@/assets/icons/icon--ethereum.svg"
                    class="mr-2 fill-current text-purple-700 inline"
                    alt="Ether"
                />
                {{ balanceOfDistribution }}
            </p>

            <p>
                Clicking "Distribute" will swap the balance of Ether in the
                distribution pool for SEEN and send it over to the staking pool.
            </p>
        </div>
    </div>
</template>

<script>
import { computed, reactive, watchEffect } from "vue";
import useWeb3 from "@/connectors/hooks";
import { useStore } from "vuex";
import { useDistributionContract } from "@/hooks/useContract";
import { Web3Provider } from "@ethersproject/providers";
import { useToast } from "primevue/usetoast";
import parseError from "@/services/utils/parseError";
import { formatEther } from "@ethersproject/units";
import { UserService } from "@/services/apiService";

export default {
    name: "DistributionCard",
    setup() {
        const state = reactive({
            distributing: false,
            balanceOfDistribution: 0,
        });
        const toast = useToast();
        const store = useStore();
        const { account, provider } = useWeb3();

        watchEffect(async () => {
            if (!account.value) {
                return;
            }

            const distributionAddress =
                process.env.VUE_APP_DISTRIBUTION_CONTRACT_ADDRESS;

            const temporaryProvider = new Web3Provider(provider.value);
            state.balanceOfDistribution = await temporaryProvider.getBalance(
                distributionAddress
            );
            state.balanceOfDistribution = formatEther(
                state.balanceOfDistribution
            );
            state.balanceOfDistribution = Math.round(
                (state.balanceOfDistribution * 100) / 100
            ).toFixed(1);
        });

        const openWalletModal = () => {
            store.dispatch("application/openModal", "WalletModal");
        };

        const balanceOfDistribution = computed(() => {
            return state.balanceOfDistribution;
        });

        const latestDistributorUsername = computed(() => {
            // TODO: get latest transaction data on the swap contract
            const distributorAddress = 0x00;
            const distributorData = UserService.get(distributorAddress);

            return distributorData.data?.user?.username;
        });

        const distribute = async () => {
            if (state.distributionBalance === 0) {
                return;
            }

            const temporaryProvider = new Web3Provider(provider.value);
            const gasPrice = await temporaryProvider
                .getGasPrice()
                .catch((e) => {
                    console.log(e);

                    toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: `You may be out of ETH`,
                        life: 6000,
                    });
                });

            state.distributing = true;

            const contract = useDistributionContract(true);
            const tx = await contract.swap({ gasPrice }).catch((e) => {
                state.distributing = false;

                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: parseError(e.message) ?? e.message,
                    life: 6000,
                });

                console.error(e);
            });

            if (!tx) {
                state.distributing = false;
                return;
            }

            return tx
                .wait()
                .then(() => {
                    state.balanceOfDistribution = "0.0";
                    toast.add({
                        severity: "success",
                        summary: "Success",
                        detail: "You have successfully distributed the SEEN in the pool.",
                        life: 3000,
                    });
                    setTimeout(() => {
                        window.location.reload();
                        state.distributing = false;
                    }, 3000);
                })
                .catch((e) => {
                    state.distributing = false;

                    toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: parseError(e.message) ?? e.message,
                        life: 6000,
                    });
                });
        };

        return {
            balanceOfDistribution,
            distribute,
            state,
            account,
            openWalletModal,
            latestDistributorUsername,
        };
    },
};
</script>

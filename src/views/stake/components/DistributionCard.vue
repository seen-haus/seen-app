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
            <div class="text-4xl font-title font-bold mb-6">
                Distribution Pool
            </div>

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
                    'cursor-wait disabled opacity-50': !distributionEnabled,
                }"
                @click="distribute"
                v-if="account"
                :disabled="state.distributing || !distributionEnabled"
            >
                {{ state.distributing ? "Dsitributing..." : "Distribute" }}
            </button>
            <div
                class="text-sm text-gray-400 my-2"
                v-if="latestDistributionDate || latestDistributorUsername"
            >
                Last distributed
                {{
                    latestDistributionDate
                        ? latestDistributionDate.toLocaleString(undefined, {
                              weekday: "short",
                              month: "long",
                              year: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : null
                }}{{
                    latestDistributorUsername
                        ? " by " + latestDistributorUsername
                        : null
                }}
            </div>
        </div>
        <div
            class="
                bg-background-gray
                py-7
                px-10
                text-gray-400 text-2xs
                flex-1 flex flex-col
            "
        >
            <div class="flex-1 text-sm font-bold uppercase mb-5">
                Distribution pool balance
                <i
                    class="fas fa-info-circle"
                    v-tooltip="{ text: 'Staking pool balance' }"
                ></i>
            </div>
            <div class="flex-1 mb-5 content-center text-2xl font-bold">
                <img
                    src="@/assets/icons/icon--ethereum.svg"
                    class="mr-2 fill-current text-purple-700 inline"
                    alt="Ether"
                    s
                />
                {{ outstandingDistributionBalance }}
            </div>

            <div class="flex-1">
                Clicking "Distribute" will swap the balance of Ether in the
                Distribution pool for SEEN and transfer it to the staking pool.
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, watchEffect } from "vue";
import useWeb3 from "@/connectors/hooks";
import { useStore } from "vuex";
import { useDistributionContract } from "@/hooks/useContract";
import useDistributionContractEvents from "@/hooks/useDistributionContractEvents";
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
            distributionEnabled: false,
            outstandingDistributionBalance: 0,
            latestDistributorUsername: null,
            latestDistributionDate: null,
        });
        const toast = useToast();
        const store = useStore();
        const { account, provider } = useWeb3();
        const { getDistributionEvents } = useDistributionContractEvents();

        watchEffect(async () => {
            if (!account.value) {
                return;
            }

            const distributionAddress =
                process.env.VUE_APP_DISTRIBUTION_CONTRACT_ADDRESS;

            const temporaryProvider = new Web3Provider(provider.value);
            const outstandingDistributionBalance =
                await temporaryProvider.getBalance(distributionAddress);

            if (!outstandingDistributionBalance) {
                return;
            }

            state.outstandingDistributionBalance = Math.round(
                (formatEther(outstandingDistributionBalance) * 100) / 100
            ).toFixed(1);
        });

        watchEffect(async () => {
            const events = await getDistributionEvents();

            let latestDistributionBlockNumber = null;
            let latestDistributionTransaction = null;
            let latestDistributionEvent = null;

            for (const event of events) {
                const transaction = await event.getTransaction();

                if (
                    !latestDistributionBlockNumber ||
                    transaction.blockNumber > latestDistributionBlockNumber
                ) {
                    latestDistributionBlockNumber = transaction.blockNumber;
                    latestDistributionTransaction = transaction;
                    latestDistributionEvent = event;
                }
            }

            if (!latestDistributionBlockNumber) {
                return;
            }

            const latestDistributionBlock =
                await latestDistributionEvent.getBlock(
                    latestDistributionBlockNumber
                );

            const distributorData = UserService.get(
                latestDistributionTransaction.from.toLowerCase()
            );

            state.latestDistributionDate = new Date(
                latestDistributionBlock.timestamp * 1000
            );
            state.latestDistributorUsername =
                distributorData?.data?.user?.username;
        });

        const openWalletModal = () => {
            store.dispatch("application/openModal", "WalletModal");
        };

        const outstandingDistributionBalance = computed(() => {
            return state.outstandingDistributionBalance;
        });

        const latestDistributorUsername = computed(() => {
            return state.latestDistributorUsername;
        });

        const latestDistributionDate = computed(() => {
            return state.latestDistributionDate;
        });

        const distributionEnabled = computed(() => {
            return outstandingDistributionBalance?.value > 0;
        });

        const distribute = async () => {
            if (outstandingDistributionBalance.value === 0) {
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
            distributionEnabled,
            outstandingDistributionBalance,
            latestDistributorUsername,
            latestDistributionDate,
            distribute,
            state,
            account,
            openWalletModal,
        };
    },
};
</script>

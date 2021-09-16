<template>
    <div class="stake-seen">
        <container>
            <fenced-title
                class="flex-grow mr-0 mb-2 self-stretch"
                color="fence-gray"
                textAlign="center"
                :closed="true"
                >Stake Seen
            </fenced-title>
            <div
                class="
                    description
                    text-gray-600
                    mx-auto
                    text-center
                    py-4
                    text-lg
                    max-w-lg
                    mb-6
                "
            >
                Deposit your SEEN in the pool and start earning fees generated
                by the SEEN Protocol.
            </div>

            <div
                class="
                    grid grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    bg-background-gray
                    p-9
                    rounded-lg
                    border
                    mb-20
                "
            >
                <div class="flex flex-col items-center xl:items-start mb-6">
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        TVL (USD)
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{ text: 'Total Value Locked (USD)' }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black">{{ totalStakedUsd }}</div>
                </div>

                <div class="flex flex-col items-center xl:items-start mb-6">
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        TOTAL SEEN LOCKED
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{ text: 'Total SEEN Locked' }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black flex">
                        <img
                            src="@/assets/icons/icon--seen.svg"
                            alt="SEEN"
                            class="mr-1"
                        />
                        {{ formatCrypto(state.totalStaked, true) }}
                    </div>
                </div>

                <div class="flex flex-col items-center xl:items-start mb-6">
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        Your share of the pool
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{ text: 'Your share of the pool' }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black">
                        {{ formatCrypto(state.shareOfThePool, true) }}%
                    </div>
                </div>

                <div
                    class="
                        flex flex-col
                        items-center
                        xl:items-start
                        mb-6
                        md:mb-0
                        xl:mb-0
                    "
                >
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        Your xSEEN balance
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{
                                text: 'Your balance of xSEEN which represents your staked SEEN',
                            }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black flex">
                        {{ formatCrypto(state.xSeenBalance, true) }}
                    </div>
                </div>

                <div
                    class="
                        flex flex-col
                        items-center
                        xl:items-start
                        mb-6
                        md:mb-0
                        xl:mb-0
                    "
                >
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        xSEEN to SEEN ratio
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{
                                text: 'The amount of SEEN that 1 xSEEN is worth',
                            }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black flex">
                        {{
                            formatCrypto(
                                state.xSeenToSeenRatio,
                                true,
                                state.xSeenToSeenRatio === 0 ? 2 : 8
                            )
                        }}
                    </div>
                </div>

                <div
                    class="
                        flex flex-col
                        items-center
                        xl:items-start
                        md:mb-0
                        xl:mb-0
                    "
                >
                    <div
                        class="
                            text-sm text-gray-400
                            font-semibold
                            uppercase
                            mb-1
                        "
                    >
                        Staked SEEN (with reward)
                        <i
                            class="fas fa-info-circle"
                            v-tooltip="{
                                text: 'SEEN staked\r\nincluding reward',
                            }"
                        ></i>
                    </div>
                    <div class="text-3xl font-black flex">
                        {{ formatCrypto(state.seenIncludingReward, true) }}
                    </div>
                </div>
            </div>

            <div class="cards flex flex-col xl:flex-row mb-12">
                <stake-or-withdraw-card
                    :amount="seenBalance"
                    :state="state"
                    class="mr-0 mb-12 xl:mb-0 xl:mr-12"
                    type-of="stake"
                />
                <stake-or-withdraw-card
                    :amount="seenBalance"
                    :state="state"
                    type-of="withdraw"
                />
            </div>
            <div class="cards flex flex-col xl:flex-row">
                <distribution-card :state="state" />
            </div>
        </container>

        <div class="bg-background-gray border-t pb-28 pt-52 -mt-32">
            <container class="py-6">
                <fenced-title
                    class="flex-grow mr-0 mb-2 self-stretch"
                    color="fence-gray"
                    textAlign="center"
                    :closed="true"
                    >How to Stake
                    <span class="text-primary italic">Seen?</span></fenced-title
                >

                <div class="list max-w-xl mx-auto mt-12">
                    <div
                        class="
                            flex
                            bg-white
                            border
                            rounded-lg
                            p-4
                            items-center
                            font-bold
                            mb-2
                        "
                    >
                        <span
                            class="
                                rounded-full
                                bg-black
                                text-white
                                flex
                                items-center
                                justify-center
                                w-8
                                h-8
                                mr-4
                                flex-shrink-0
                            "
                            >1</span
                        >
                        Deposit your SEEN
                    </div>
                    <div
                        class="
                            flex
                            bg-white
                            border
                            rounded-lg
                            p-4
                            items-center
                            font-bold
                            mb-2
                        "
                    >
                        <span
                            class="
                                rounded-full
                                bg-black
                                text-white
                                flex
                                items-center
                                justify-center
                                w-8
                                h-8
                                mr-4
                                flex-shrink-0
                            "
                            >2</span
                        >
                        Receive xSEEN in return
                    </div>
                    <div
                        class="
                            flex
                            bg-white
                            border
                            rounded-lg
                            p-4
                            items-center
                            font-bold
                            mb-2
                        "
                    >
                        <span
                            class="
                                rounded-full
                                bg-black
                                text-white
                                flex
                                items-center
                                justify-center
                                w-8
                                h-8
                                mr-4
                                flex-shrink-0
                            "
                            >3</span
                        >
                        Start earning a portion of protocol fees
                    </div>
                    <div
                        class="
                            flex
                            bg-white
                            border
                            rounded-lg
                            p-4
                            items-center
                            font-bold
                            mb-2
                        "
                    >
                        <span
                            class="
                                rounded-full
                                bg-black
                                text-white
                                flex
                                items-center
                                justify-center
                                w-8
                                h-8
                                mr-4
                                flex-shrink-0
                            "
                            >4</span
                        >
                        Redeem SEEN rewards by clicking withdraw*
                    </div>

                    <div class="text-2xs text-gray-400 px-4 mt-3">
                        * All deposits are subject to a 3 day lockup period to
                        prevent sandwich attacks.
                    </div>
                </div>
            </container>
        </div>
    </div>
</template>

<script>
import { computed, onBeforeMount, reactive, watchEffect } from "vue";
import { useMeta } from "vue-meta";
import { useStore } from "vuex";

import FencedTitle from "@/components/FencedTitle.vue";
import Container from "@/components/Container.vue";
import DistributionCard from "@/views/stake/components/DistributionCard";
import StakeOrWithdrawCard from "@/views/stake/components/StakeOrWithdrawCard";
import useExchangeRate from "@/hooks/useExchangeRate";
import { useSEENContract, useStakingContract } from "@/hooks/useContract";
import useWeb3 from "@/connectors/hooks";
import { formatEther } from "@ethersproject/units";
import BigNumber from "bignumber.js";
import { Web3Provider, WebSocketProvider } from "@ethersproject/providers";

export default {
    name: "Stake",
    components: {
        FencedTitle,
        Container,
        StakeOrWithdrawCard,
        DistributionCard,
    },
    setup() {
        const { account, provider } = useWeb3();
        const { meta } = useMeta({
            title: "Stake",
        });

        const store = useStore();

        // Disable dark mode until dark mode is supported across website
        store.dispatch("application/setDarkMode", false);

        const state = reactive({
            shareOfThePool: 0,
            userSeenInPool: 0,
            totalStaked: 0,
            totalStakedUsd: 0,
            totalxSeenSupply: 0,
            contractEthBalance: 0,
            xSeenBalance: 0,
            xSeenToSeenRatio: 0,
            seenIncludingReward: 0,
        });
        const { formatCrypto, formatCurrency, convertSeenToUSDAndFormat } =
            useExchangeRate();

        const seenBalance = computed(() => {
            return store.getters["application/balance"].seen;
        });

        watchEffect(async () => {
            if (
                account.value &&
                state.totalxSeenSupply &&
                state.totalStaked &&
                state.xSeenToSeenRatio
            ) {
                const stakeContract = useStakingContract();
                let balanceOf = await stakeContract.balanceOf(account.value);
                balanceOf = formatEther(balanceOf.toString());
                state.xSeenBalance = BigNumber(balanceOf);
                let share = BigNumber(balanceOf).dividedBy(
                    state.totalxSeenSupply
                );
                state.shareOfThePool = share.multipliedBy(100);
                const stakedSeenIncludingReward = BigNumber(
                    state.xSeenToSeenRatio
                ).multipliedBy(state.xSeenBalance);
                state.seenIncludingReward =
                    stakedSeenIncludingReward.toString();
            }
        });

        onBeforeMount(async () => {
            const contract = useSEENContract();
            let balance = await contract.balanceOf(
                process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS
            );
            state.totalStaked = formatEther(balance.toString());

            const stakeContract = useStakingContract();
            let totalSupplyxSeen = await stakeContract.totalSupply();
            state.totalxSeenSupply = formatEther(totalSupplyxSeen.toString());

            const xSeenToSeenConversionRate = BigNumber(
                BigNumber(balance.toString())
            ).dividedBy(totalSupplyxSeen.toString());
            state.xSeenToSeenRatio = xSeenToSeenConversionRate.toString();

            const library = provider.value
                ? new Web3Provider(provider.value)
                : new WebSocketProvider(process.env.VUE_APP_NETWORK_URL);

            const cb = await library.getBalance(
                process.env.VUE_APP_SEEN_CONTRACT_ADDRESS
            );
            state.contractEthBalance = formatEther(cb.toString());
        });

        const totalStakedUsd = computed(() => {
            return convertSeenToUSDAndFormat(state.totalStaked);
        });

        const feesEarned = computed(() => {
            if (!state.shareOfThePool) {
                return 0;
            }
            const contractEthBalance = new BigNumber(
                state.totalStaked
            ).multipliedBy(state.shareOfThePool.dividedBy(100));
            return contractEthBalance;
        });

        return {
            formatCrypto,
            formatCurrency,
            seenBalance,
            state,
            totalStakedUsd,
            feesEarned,
        };
    },
};
</script>

<style scoped>
</style>

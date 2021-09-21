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
          'cursor-wait disabled opacity-50': !distributionEnabled
        }"
        @click="distribute"
        v-if="account"
        :disabled="state.distributing || !distributionEnabled"
      >
        {{ state.distributing ? "Distributing..." : "Distribute" }}
      </button>
      <div
        class="text-sm text-gray-400 my-2"
        v-if="latestDistributionDate && latestDistributorUsernameOrAddress"
      >
        <a href="{{ latestDistributionTransactionEtherscanUrl }}" target="_blank">
          Last distributed
          {{ 
            latestDistributionDate.toLocaleString(undefined, {
              weekday: "short",
              month: "long",
              year: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          }}{{
            " by " + latestDistributorUsernameOrAddress
          }}
        </a>
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
        {{ distributionBalance }}
      </div>

      <div class="flex-1">
        Clicking "Distribute" will swap the balance of Ether in the Distribution
        pool for SEEN and transfer it to the staking pool.
      </div>
    </div>
  </div>
</template>

<script>
import {computed, reactive, watchEffect} from "vue";
import {useStore} from "vuex";
import {Web3Provider} from "@ethersproject/providers";
import {useToast} from "primevue/usetoast";
import useWeb3 from "@/connectors/hooks";
import {useDistributionContract} from "@/hooks/useContract";
import useDistributionContractEvents from "@/hooks/useDistributionContractEvents";
import useExchangeRate from "@/hooks/useExchangeRate";
import parseError from "@/services/utils/parseError";
import {UserService} from "@/services/apiService";
import {shortenAddress} from "@/services/utils/index";
import {getEtherscanLink} from "@/services/utils";

export default {
  name: "DistributionCard",
  setup() {
    const state = reactive({
      distributing: false,
      distributionEnabled: false,
      distributionBalance: 0,
      latestDistributorUsernameOrAddress: null,
      latestDistributionDate: null,
      latestDistributionTransactionEtherscanUrl: null,
    });
    const toast = useToast();
    const store = useStore();
    const {account, provider} = useWeb3();
    const {formatCrypto} = useExchangeRate();
    const {getDistributionEvents} = useDistributionContractEvents();

    const loadLatestDistributionBalance = async () => {
      if (!account.value) {
        return;
      }

      const distributionAddress =
        process.env.VUE_APP_DISTRIBUTION_CONTRACT_ADDRESS;

      const temporaryProvider = new Web3Provider(provider.value);
      const distributionBalance = await temporaryProvider.getBalance(
        distributionAddress
      );

      if (!distributionBalance) {
        return;
      }

      state.distributionBalance = distributionBalance;
    }

    const loadLatestDistribution = async () => {
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

      const latestDistributionBlock = await latestDistributionEvent.getBlock(
        latestDistributionBlockNumber
      );

      const distributorData = UserService.get(
        latestDistributionTransaction.from.toLowerCase()
      );

      state.latestDistributionDate = new Date(
        latestDistributionBlock.timestamp * 1000
      );
      state.latestDistributorUsernameOrAddress = distributorData?.data?.user?.username ?? shortenAddress(latestDistributionTransaction.from);
      state.latestDistributionTransactionEtherscanUrl = getEtherscanLink(latestDistributionTransaction.chainId, latestDistributionTransaction.hash, 'transaction')
  
    }

    loadLatestDistributionBalance();
    loadLatestDistribution();

    const openWalletModal = () => {
      store.dispatch("application/openModal", "WalletModal");
    };

    const distributionBalance = computed(() => {
      return formatCrypto(state.distributionBalance).substr(0, 8);
    });

    const latestDistributorUsernameOrAddress = computed(() => {
      return state.latestDistributorUsernameOrAddress;
    });

    const latestDistributionDate = computed(() => {
      return state.latestDistributionDate;
    });

    const latestDistributionTransactionEtherscanUrl = computed(() => {
      return state.latestDistributionTransactionEtherscanUrl;
    });

    const distributionEnabled = computed(() => {
      return distributionBalance?.value > 0;
    });

    const distribute = async () => {
      if (distributionBalance.value === 0) {
        return;
      }

      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice().catch(e => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `You may be out of ETH`,
          life: 6000
        });
      });

      state.distributing = true;

      const contract = useDistributionContract(true);
      const tx = await contract.swap({ gasPrice }).catch(e => {
        state.distributing = false;

        toast.add({
          severity: "error",
          summary: "Error",
          detail: parseError(e.message) ?? e.message,
          life: 6000
        });

        console.error(e);
      });

      if (!tx) {
        state.distributing = false;
        return;
      }

      return tx
        .wait()
        .then(async () => {
          state.distributionBalance = "0.0000";
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "You have successfully distributed the SEEN in the pool.",
            life: 3000
          });

          await loadLatestDistribution();
          await loadLatestDistributionBalance();

          state.distributing = false;
        })
        .catch(e => {
          state.distributing = false;

          toast.add({
            severity: "error",
            summary: "Error",
            detail: parseError(e.message) ?? e.message,
            life: 6000
          });
        });
    };

    return {
      distributionEnabled,
      distributionBalance,
      latestDistributorUsernameOrAddress,
      latestDistributionDate,
      latestDistributionTransactionEtherscanUrl,
      distribute,
      state,
      account,
      openWalletModal
    };
  }
};
</script>

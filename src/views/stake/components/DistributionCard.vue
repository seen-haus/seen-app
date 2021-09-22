<template>
  <div class="stake-or-withdraw-card rounded-lg overflow-hidden shadow-lifted flex-1 flex bg-white">
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
          'cursor-wait disabled opacity-50': distributing || !distributionEnabled
        }"
        @click="distribute"
        v-if="account"
        :disabled="distributing || !distributionEnabled"
      >
        {{ distributing ? "Distributing..." : "Distribute" }}
      </button>
      <div
        class="text-sm text-gray-400 my-2"
        v-if="latestDistributionDate && latestDistributorUsernameOrAddress"
      >
        <a :href="latestDistributionTransactionEtherscanUrl" target="_blank">
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
    <div class="bg-background-gray py-7 px-10 text-gray-400 text-2xs flex-1 flex flex-col">
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
        {{ formatCrypto(distributionBalance).substr(0, 8) }}
      </div>

      <div class="flex-1">
        Clicking "Distribute" will swap the balance of Ether in the Distribution
        pool for SEEN and transfer it to the staking pool.
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref, watchEffect} from "vue";
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
    const toast = useToast();
    const store = useStore();
    const {account, provider} = useWeb3();
    const {formatCrypto} = useExchangeRate();
    const {getDistributionEvents} = useDistributionContractEvents();
    
    const distributing = ref(false);
    const distributionBalance = ref(0.0);
    const distributionEnabled = computed(() => distributionBalance.value > 0);
    const latestDistributorUsernameOrAddress = ref(null);
    const latestDistributionDate = ref(null);
    const latestDistributionTransactionEtherscanUrl = ref(null);

    const loadLatestDistributionBalance = async () => {
      if (!provider?.value) {
        return;
      }

      const distributionAddress =
        process.env.VUE_APP_DISTRIBUTION_CONTRACT_ADDRESS;

      const temporaryProvider = new Web3Provider(provider.value);
      const balance = await temporaryProvider.getBalance(
        distributionAddress
      );

      if (!balance) {
        return;
      }

      distributionBalance.value = balance.toNumber();
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

      latestDistributionDate.value = new Date(
        latestDistributionBlock.timestamp * 1000
      );
      latestDistributorUsernameOrAddress.value = distributorData?.data?.user?.username || shortenAddress(latestDistributionTransaction.from);
      latestDistributionTransactionEtherscanUrl.value = getEtherscanLink(latestDistributionTransaction.chainId, latestDistributionTransaction.hash, 'transaction')
    }

    const distribute = async () => {
      if (distributing.value || !distributionEnabled.value) {
        return;
      }

      distributing.value = true;

      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice().catch(() => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: `You may be out of ETH`,
          life: 6000
        });
      });

      const contract = useDistributionContract(true);
      const tx = await contract.swap({ gasPrice }).catch(e => {
        distributing.value = false;

        toast.add({
          severity: "error",
          summary: "Error",
          detail: parseError(e.message) || e.message,
          life: 6000
        });

        console.error(e);
      });

      if (!tx) {
        distributing.value = false;
        return;
      }

      return tx
        .wait()
        .then(async () => {
          distributionBalance.value = 0.0;
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "You have successfully distributed the SEEN in the pool.",
            life: 3000
          });

          await loadLatestDistribution();
          await loadLatestDistributionBalance();

          distributing.value = false;
        })
        .catch(e => {
          distributing.value = false;

          toast.add({
            severity: "error",
            summary: "Error",
            detail: parseError(e.message) || e.message,
            life: 6000
          });
        });
    };

    const openWalletModal = () => {
      store.dispatch("application/openModal", "WalletModal");
    };

    watchEffect(() => {
      if (!provider?.value) {
        return;
      }

      loadLatestDistributionBalance();
      loadLatestDistribution();
    });

    return {
      distributionEnabled,
      distributionBalance,
      latestDistributorUsernameOrAddress,
      latestDistributionDate,
      latestDistributionTransactionEtherscanUrl,
      distribute,
      distributing,
      account,
      formatCrypto,
      openWalletModal
    };
  }
};
</script>

<template>
  <div class="stake-or-withdraw-card rounded-lg overflow-hidden shadow-lifted flex-1 flex bg-white flex-col md:flex-row">
    <div class="p-8 px-10 flex-1">
      <div class="text-4xl font-title font-bold mb-6">Distribution Pool</div>

      <button class="button primary w-full text-xs" @click="openWalletModal" v-if="!account">Connect Wallet</button>
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
      <div class="text-sm text-gray-400 mt-6" v-if="latestDistributionDate && latestDistributorUsernameOrAddress">
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
          }}{{ " by " + latestDistributorUsernameOrAddress }}
        </a>
      </div>
    </div>
    <div class="bg-background-gray py-7 px-10 text-gray-400 text-2xs flex-1 flex flex-col">
      <div class="flex-1 text-xs font-bold uppercase mb-5">
        Distribution pool balance
        <i class="fas fa-info-circle" v-tooltip="{text: 'Staking pool balance'}"></i>
      </div>
      <div class="flex-1 mb-5 content-center text-2xl font-bold">
        <img src="@/assets/icons/icon--ethereum.svg" class="mr-2 fill-current text-purple-700 inline" alt="Ether" />
        {{ formatCrypto(distributionBalance).substr(0, 8) }} ETH
      </div>

      <div class="flex-1 text-sm font-medium">Clicking "Distribute" will swap the balance of Ether in the Distribution pool for SEEN and transfer it to the staking pool.</div>
    </div>
  </div>
</template>

<script>
import {computed, ref, watchEffect} from "vue";
import {useStore} from "vuex";
import {Web3Provider} from "@ethersproject/providers";
import {useToast} from "primevue/usetoast";
import useWeb3 from "@/connectors/hooks";
import {useDistributionContractNetworkReactive} from "@/hooks/useContract";
import useExchangeRate from "@/hooks/useExchangeRate";
import parseError from "@/services/utils/parseError";
import {UserService} from "@/services/apiService";
import {shortenAddress} from "@/services/utils/index";
import {getEtherscanLink} from "@/services/utils";
import {formatEther} from "@ethersproject/units";

export default {
  name: "DistributionCard",
  props: {
    onDistributed: async () => {},
  },
  setup(props) {
    const toast = useToast();
    const store = useStore();
    const {account, provider} = useWeb3();
    const {formatCrypto} = useExchangeRate();

    const distributing = ref(false);
    const distributionBalance = ref("0.0");
    const distributionEnabled = computed(() => distributionBalance.value > 0);
    const latestDistributorUsernameOrAddress = ref(null);
    const latestDistributionDate = ref(null);
    const latestDistributionTransactionEtherscanUrl = ref(null);
    const distributionPoolContract = ref({});

    const loadLatestDistributionBalance = async () => {

      if (!provider?.value || !distributionPoolContract?.value?.contract?.address) {
        return;
      }

      const distributionAddress = distributionPoolContract.value.contract.address;

      const temporaryProvider = new Web3Provider(provider.value);
      const balance = await temporaryProvider.getBalance(distributionAddress);

      if (!balance) {
        return;
      }

      distributionBalance.value = formatEther(balance.toString());
    };

    watchEffect(async () => {
        let contract = await useDistributionContractNetworkReactive();
        distributionPoolContract.value = contract.state;
    })

    const loadLatestDistribution = async () => {
      if(distributionPoolContract.value) {

        let events = await distributionPoolContract.value.contract.queryFilter("SwapForMinimum");

        let latestDistributionBlockNumber = null;
        let latestDistributionTransaction = null;
        let latestDistributionEvent = null;

        for (const event of events) {
          const transaction = await event.getTransaction();

          if (!latestDistributionBlockNumber || transaction.blockNumber > latestDistributionBlockNumber) {
            latestDistributionBlockNumber = transaction.blockNumber;
            latestDistributionTransaction = transaction;
            latestDistributionEvent = event;
          }
        }

        if (!latestDistributionBlockNumber) {
          return;
        }

        const latestDistributionBlock = await latestDistributionEvent.getBlock(latestDistributionBlockNumber);
        const distributorData = UserService.get(latestDistributionTransaction.from.toLowerCase());

        latestDistributionDate.value = new Date(latestDistributionBlock.timestamp * 1000);
        latestDistributorUsernameOrAddress.value = distributorData?.data?.user?.username || shortenAddress(latestDistributionTransaction.from);
        latestDistributionTransactionEtherscanUrl.value = getEtherscanLink(latestDistributionTransaction.chainId, latestDistributionTransaction.hash, "transaction");
      }
    };

    const distribute = async () => {
      if (props.onDistributed) {
        props.onDistributed();
      }
      if (distributing.value || !distributionEnabled.value || !distributionPoolContract?.value?.contract) {
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

      const tx = await distributionPoolContract.value.contract.swap({gasPrice}).catch((e) => {
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

          if (props.onDistributed) {
            await props.onDistributed();
          }  
        })
        .catch((e) => {
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
      if (!provider?.value && !distributionPoolContract?.value?.contract) {
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

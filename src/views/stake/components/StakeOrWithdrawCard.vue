<template>
  <div
      class="stake-or-withdraw-card rounded-lg overflow-hidden shadow-lifted flex-1 bg-white"
  >
    <div class="top py-7 px-10">
      <div class="text-4xl font-title font-bold mb-6 text-center">
        {{ title }}
      </div>

      <div class="flex font-bold text-sm uppercase">
        <span class="flex-1">{{ label }}</span>
        <span class="px-1 cursor-pointer" @click="setPercent(25)">25%</span>/
        <span class="px-1 cursor-pointer" @click="setPercent(50)">50%</span>/
        <span class="px-1 cursor-pointer" @click="setPercent(75)">75%</span>/
        <span class="px-1 cursor-pointer" @click="setPercent(100)">100%</span>
      </div>

      <div class="outlined-input mt-4">
        <input type="text" :placeholder="placeholder" @keypress="isNumber" v-model="state.number"/>
        <div class="icon w-5 mr-1">
          <i class="fas fa-circle text-lg text-gray-300 mr-2"></i>
        </div>
        <div class="type font-bold">SEEN</div>
      </div>

      <div class="text-sm text-gray-400 my-2">Wallet balance:
        {{ formatCrypto(typeOf === "stake" ? seenBalance : balance, true) }} SEEN
      </div>
      <button class="button primary w-full" @click="openWalletModal" v-if="!account">Connect Wallet
      </button>
      <button class="button primary w-full" @click="approve"
              v-if="account && typeOf === 'stake' && !state.isAllowed">Approve
      </button>
      <button class="button primary w-full" @click="stake"
              v-if="account && typeOf === 'stake' && state.isAllowed">Stake
      </button>
      <button class="button primary w-full" @click="withdraw"
              v-if="account && typeOf === 'withdraw'">Withdraw
      </button>
    </div>

    <div
        class="bottom h-full bg-background-gray py-7 px-10 text-gray-400 text-2xs tracking-wide border-t"
    >
      {{ description }}
    </div>
  </div>
</template>

<script>
import numberHelper from "@/services/utils/numbers"
import useExchangeRate from "@/hooks/useExchangeRate";
import {computed, reactive, watchEffect} from "vue";
import useWeb3 from "@/connectors/hooks";
import {useStore} from "vuex";
import BigNumber from "bignumber.js";
import {useSEENContract, useStakingContract} from "@/hooks/useContract";
import {parseEther} from "ethers/lib/utils";
import {Web3Provider} from "@ethersproject/providers";

export default {
  name: "StakeOrWithdrawCard",
  setup(context, props) {
    const {formatCrypto} = useExchangeRate();

    const state = reactive({
      number: 0,
      balance: 0,
      isAllowed: false,
    });

    const store = useStore();
    const {account, provider} = useWeb3();

    const typeOf = computed(() => {
      return props.attrs["type-of"];
    })

    watchEffect(async () => {
      if (account.value) {
        if (typeOf.value === "stake") {
          const contract = useSEENContract()
          const isAllowed = await contract.allowance(account.value, process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS);
          state.isAllowed = parseInt(isAllowed.toString()) > 0
        } else {
          const contract = useStakingContract()
          const balance = await contract.balanceOf(account.value)
          state.balance = parseEther(balance.toString())
        }
      }
    })
    const seenBalance = computed(() => {
      return store.getters['application/balance'].seen
    });

    const openWalletModal = () => {
      store.dispatch('application/openModal', 'WalletModal')
    }

    const setPercent = (percent) => {
      const number = props.attrs["type-of"] == 'stake' ? seenBalance.value : state.balance.value;
      if (number > 0) {
        state.number = BigNumber(number)
            .dividedBy(100)
            .multipliedBy(percent)
      }
    }

    const balance = computed(() => {
      return state.balance
    })
    const approve = async () => {
      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice();
      let amount = parseEther((new BigNumber(99999999999999999)).toString());
      const contract = useSEENContract(true)
      const tx = await contract.approve(process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS, amount, {
        gasPrice,
        from: account.value
      });
      return tx.wait()
          .then(() => {
            state.isAllowed = true;
          }).catch((e) => {
            console.error(e);
          })
    }

    const stake = async () => {
      if (state.number.value === 0) {
        return
      }
      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice();
      const contract = useStakingContract(true)
      let amount = (parseEther((new BigNumber(state.number.value)).toString()));
      const tx = contract.enter(amount, {gasPrice, from: account.value});
      return tx.wait()
          .then(() => {
            state.number.value = 0;
            window.reload();
          }).catch((e) => {
            console.error(e);
          })
    }

    const withdraw = async () => {
      if (state.number.value === 0) {
        return
      }
      const temporaryProvider = new Web3Provider(provider.value);
      const gasPrice = await temporaryProvider.getGasPrice();
      const contract = useStakingContract(true)
      let amount = (parseEther((new BigNumber(state.number.value)).toString()));
      const tx = contract.enter(amount, {gasPrice, from: account.value});
      return tx.wait()
          .then(() => {
            state.number.value = 0;
            window.reload();
          }).catch((e) => {
            console.error(e);
          })
    }

    const handleClick = () => {

    }

    const isNumber = (value) => {
      return numberHelper.isNumber(value)
    }

    return {
      balance,
      state,
      account,
      seenBalance,
      typeOf,
      approve,
      handleClick,
      isNumber,
      formatCrypto,
      openWalletModal,
      setPercent,
      stake,
      withdraw,
    }
  },
  computed: {
    title: function () {
      return this.typeOf === "stake" ? "Stake" : "Withdraw";
    },
    label: function () {
      return this.typeOf === "stake"
          ? "AMOUNT OF SEEN TO STAKE"
          : "AMOUNT OF SEEN TO WITHDRAW";
    },
    placeholder: function () {
      return this.typeOf === "stake" ? "Enter your stake" : "Enter your withdrawal amount";
    },
    description: function () {
      return this.typeOf === "stake"
          ? `
    After clicking the “Stake” button, SEEN will be sent from your wallet to
      the staking lot. After the transaction is confirmed, you will start
      earning fees generating by the SEEN protocol.
    `.trim()
          : `
    After clicking the “Withdraw" button, SEEN will be sent from the staking pool to your wallet.
    `.trim();
    },
  }
};
</script>

<style lang="scss" scoped>
.bottom {
  line-height: 1.6;
}

input {
  &:focus {
    outline: none !important;
  }
}
</style>

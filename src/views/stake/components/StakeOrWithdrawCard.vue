<template>
  <div class="stake-or-withdraw-card rounded-lg overflow-hidden shadow-lifted flex-1 bg-white">
    <div class="top p-8">
      <div class="text-4xl font-title font-bold mb-6">
        {{ title }}
      </div>

      <div class="flex font-bold text-sm">
        <span class="flex-1">{{ label }}</span>
        <span class="px-1 cursor-pointer" @click="setPercent(25)">25%</span>/ <span class="px-1 cursor-pointer" @click="setPercent(50)">50%</span>/
        <span class="px-1 cursor-pointer" @click="setPercent(75)">75%</span>/
        <span class="px-1 cursor-pointer" @click="setPercent(100)">100%</span>
      </div>

      <div class="outlined-input mt-1">
        <input type="text" :placeholder="placeholder" @keypress="isNumber" v-model="state.number" />
        <div class="icon w-5 mr-1">
          <img src="@/assets/icons/icon--seen.svg" alt="SEEN" class="mr-2" />
        </div>
        <div class="type font-bold">{{ typeOf === "stake" ? "SEEN" : "xSEEN" }}</div>
      </div>

      <div class="text-sm text-gray-400 my-2 mb-4">
        {{ typeOf === "stake" ? "Wallet balance:" : "Balance:" }}
        {{ formatCrypto(typeOf === "stake" ? seenBalance : seenDeposited, true) }} {{ typeOf === "stake" ? "SEEN" : "xSEEN" }}
      </div>
      <button class="button primary w-full text-xs" @click="openWalletModal" v-if="!account">Connect Wallet</button>
      <button
        class="button primary w-full text-xs"
        :class="{'cursor-wait disabled opacity-50': state.approving}"
        @click="approve"
        v-if="account && typeOf === 'stake' && !state.isAllowed"
        :disabled="state.approving"
      >
        {{ state.approving ? "Approving..." : "Approve" }}
      </button>
      <button class="button primary w-full" @click="stake" v-if="account && typeOf === 'stake' && state.isAllowed" :class="{'cursor-wait disabled opacity-50': state.depositing}">
        {{ state.depositing ? "Depositing..." : "Stake" }}
      </button>
      <button class="button primary w-full" @click="withdraw" v-if="account && typeOf === 'withdraw'" :class="{'cursor-wait disabled opacity-50': state.withdrawing}">
        {{ state.withdrawing ? "Withdrawing..." : "Withdraw" }}
      </button>
    </div>

    <div class="bottom h-full bg-background-gray py-7 px-10 text-gray-400 text-sm font-medium tracking-wide border-t">
      {{ description }}
    </div>
  </div>
</template>

<script>
import numberHelper from "@/services/utils/numbers"
import useExchangeRate from "@/hooks/useExchangeRate"
import {computed, reactive, watchEffect} from "vue"
import useWeb3 from "@/connectors/hooks"
import {useStore} from "vuex"
import BigNumber from "bignumber.js"
import {useSEENContract, useStakingContract} from "@/hooks/useContract"
import {parseEther, formatEther, parseUnits} from "ethers/lib/utils"
import {Web3Provider} from "@ethersproject/providers"
import {useToast} from "primevue/usetoast"
import parseError from "@/services/utils/parseError"

export default {
  name: "StakeOrWithdrawCard",
  props: {
    onStaked: async () => {},
  },
  setup(context, props) {
    const {formatCrypto} = useExchangeRate()

    const state = reactive({
      approving: false,
      withdrawing: false,
      depositing: false,

      number: 0,
      balance: 0,
      rawbalance: 0,
      isAllowed: false
    })
    const toast = useToast()
    const store = useStore()
    const {account, provider} = useWeb3()

    const typeOf = computed(() => {
      return props.attrs["type-of"]
    })

    const seenDeposited = computed(() => {
      return props.attrs.state.xSeenBalance
    })

    watchEffect(async () => {
      if (account.value) {
        if (typeOf.value === "stake") {
          const contract = useSEENContract()
          const isAllowed = await contract.allowance(account.value, process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS)
          state.isAllowed = parseInt(isAllowed.toString()) > 0
        } else {
          const contract = useStakingContract()
          const balance = await contract.balanceOf(account.value)
          state.rawbalance = balance
          state.balance = formatEther(balance.toString())
        }
      }
    })
    const seenBalance = computed(() => {
      return store.getters["application/balance"].seen
    })

    const openWalletModal = () => {
      store.dispatch("application/openModal", "WalletModal")
    }

    const setPercent = (percent) => {
      const number = props.attrs["type-of"] == "stake" ? new BigNumber(seenBalance.value) : seenDeposited.value

      if (number > 0) {
        state.number = number.dividedBy(100).multipliedBy(percent)
      }
    }

    const balance = computed(() => {
      return state.balance
    })
    const approve = async () => {
      const temporaryProvider = new Web3Provider(provider.value)
      const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
        toast.add({severity: "error", summary: "Error", detail: `You may be out of ETH`, life: 3000})
      })
      let amount = parseEther(new BigNumber(999999999999).toString()).toString()
      const contract = useSEENContract(true)
      state.approving = true
      const tx = await contract
        .approve(process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS, amount, {
          gasPrice: gasPrice.toString(),
          from: account.value
        })
        .catch((e) => {
          state.approving = false
          let message = parseError(e.message)
          toast.add({severity: "error", summary: "Error", detail: message ? message : e.message, life: 6000})
          return false
        })

      if (!tx) {
        return
      }

      return tx.wait()
        .then((response) => {
          if(response.status === 1) {
            state.isAllowed = true;
            state.approving = false;
            toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Approval was successful, now you can stake your seen by pressing STAKE.',
              life: 3000
            });
          } else {
            state.approving = false;
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Approval was unsuccessful.',
              life: 3000
            });
          }
        }).catch((e) => {
          let message = parseError(e.message)
          toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 6000});
          console.error(e);
          state.approving = false;
        })
    }

    const stake = async () => {
      if (state.number == 0) {
        return
      }
      const temporaryProvider = new Web3Provider(provider.value)
      const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
        toast.add({severity: "error", summary: "Error", detail: `You may be out of ETH`, life: 6000})
      })

      const contract = useStakingContract(true)
      let amount = parseEther(new BigNumber(state.number).toString())
      state.depositing = true

      const tx = await contract.enter(amount, {gasPrice, from: account.value}).catch((e) => {
        console.error(e)
        let message = parseError(e.message)
        state.depositing = false
        toast.add({severity: "error", summary: "Error", detail: message ? message : e.message, life: 6000})
      })
      if (!tx) {
        state.depositing = false
        return
      }
      return tx.wait()
        .then(async (response) => {
          if(response.status === 1) {
            state.number = 0;
            toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'You have successfully staked your SEEN.',
              life: 3000
            });
            setTimeout(() => {
              window.location.reload();
              state.depositing = false;
            }, 3000)
          } else {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Staking was unsuccessful.',
              life: 3000
            });

            if (props.onStaked) {
              await props.onStaked()
            }
          }
        }).catch((e) => {
          state.depositing = false;
          let message = parseError(e.message)
          toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 6000});
        })
    }

    const withdraw = async () => {
      if (state.number == 0) {
        return
      }
      if (seenDeposited.value.isLessThanOrEqualTo(0)) {
        return
      }

      const temporaryProvider = new Web3Provider(provider.value)
      const gasPrice = await temporaryProvider.getGasPrice().catch((e) => {
        toast.add({severity: "error", summary: "Error", detail: `You may be out of ETH.`, life: 6000})
      })

      const contract = useStakingContract(true)
      let amount = typeof state.number != "string" ? parseEther(state.number.dp(18).toString()) : parseEther(state.number.toString())

      state.withdrawing = true
      const tx = await contract.leave(amount, {gasPrice, from: account.value}).catch((e) => {
        console.error(e)
        state.withdrawing = false
        let message = parseError(e.message)
        toast.add({severity: "error", summary: "Error", detail: message ? message : e.message, life: 6000})
      })

      if (!tx) {
        state.withdrawing = false
        return
      }

      return tx
        .wait()
        .then(async () => {
          state.number.value = 0
          toast.add({severity: "success", summary: "Success", detail: "Your withdraw was successful.", life: 3000})
          setTimeout(() => {
            state.withdrawing = false
            window.location.reload()
          }, 3000)

          if (props.onStaked) {
            await props.onStaked()
          }
        })
        .catch((e) => {
          console.error(e)
          state.withdrawing = false
          let message = parseEther(e.message)
          toast.add({severity: "error", summary: "Error", detail: `${message}`, life: 3000})
        })
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
      seenDeposited,
      approve,
      isNumber,
      formatCrypto,
      openWalletModal,
      setPercent,
      stake,
      withdraw
    }
  },
  computed: {
    title: function () {
      return this.typeOf === "stake" ? "Stake" : "Withdraw"
    },
    label: function () {
      return this.typeOf === "stake" ? "AMOUNT OF SEEN TO STAKE" : "AMOUNT OF xSEEN TO WITHDRAW"
    },
    placeholder: function () {
      return this.typeOf === "stake" ? "Enter your stake" : "Enter your withdrawal amount"
    },
    description: function () {
      return this.typeOf === "stake"
        ? `
    After clicking the “Stake” button, SEEN will be sent from your wallet to
      the staking lot. After the transaction is confirmed, you will start
      earning fees generated by the SEEN protocol.
    `.trim()
        : `
    After clicking the “Withdraw" button, SEEN will be sent from the staking pool to your wallet.
    `.trim()
    }
  }
}
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

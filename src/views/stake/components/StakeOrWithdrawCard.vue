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
        <span class="px-1 cursor-pointer">25%</span>/
        <span class="px-1 cursor-pointer">50%</span>/
        <span class="px-1 cursor-pointer">75%</span>/
        <span class="px-1 cursor-pointer">100%</span>
      </div>

      <div class="outlined-input mt-4">
        <input type="text" :placeholder="placeholder" />
        <div class="icon w-5 mr-1">
          <i class="fas fa-circle text-lg text-gray-300 mr-2"></i>
        </div>
        <div class="type font-bold">SEEN</div>
      </div>

      <div class="text-sm text-gray-400 my-2">Wallet balance: 0 SEEN</div>
      <button class="button primary w-full">Connect Wallet</button>
    </div>

    <div
      class="bottom h-full bg-background-gray py-7 px-10 text-gray-400 text-2xs tracking-wide border-t"
    >
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  name: "StakeOrWithdrawCard",
  props: {
    type: {
      type: String, // stake, withdraw
      default: "stake",
    },
  },
  computed: {
    title: function () {
      return this.type === "stake" ? "Stake" : "Withdraw";
    },
    label: function () {
      return this.type === "stake"
        ? "AMOUNT OF SEEN TO STAKE"
        : "AMOUNT OF SEEN TO WITHDRAW";
    },
    placeholder: function () {
      return this.type === "stake" ? "Enter your stake" : "Enter your withdrawal amount";
    },
    description: function () {
      return this.type === "stake"
        ? `
    After clicking the “Stake” button, SEEN will be sent from your wallet to
      the staking lot. After the transaction is confirmed, you will start
      earning fees generating by the SEEN protocol.
    `.trim()
        : `
    After clicking the “Withdraw" button, SEEN will be sent from the staking pool to your wallet.
    `.trim();
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  line-height: 1.6;
}
</style>
<template>
  <div class="relative">
    <Chart v-if="shareOfThePool" type="doughnut" :data="chartData" :options="chartOptions" />
    <div class="chart-staked absolute text-center">
      <span class="text-2xl font-black">{{ formatCrypto(shareOfThePool, true) }}%</span>
      <br />
      <span class="text-gray-400 text-xs font-bold uppercase">staked</span>
    </div>
  </div>
</template>

<script>
import {toRefs, ref} from "vue"
import BigNumber from "bignumber.js"
import useExchangeRate from "@/hooks/useExchangeRate"

export default {
  name: "StakingChart",
  components: {},
  props: {
    shareOfThePool: BigNumber
  },
  setup(props) {
    const {shareOfThePool} = toRefs(props)
    const gradientOfChart = ref(null)
    const widthOfChart = ref(0)
    const heightOfChart = ref(0)

    const {formatCrypto} = useExchangeRate()

    const getOrCreateGradient = (ctx, chartArea) => {
      const chartWidth = chartArea.right - chartArea.left
      const chartHeight = chartArea.bottom - chartArea.top

      if (gradientOfChart.value === null || widthOfChart.value !== chartWidth || heightOfChart.value !== chartHeight) {
        widthOfChart.value = chartWidth
        heightOfChart.value = chartHeight

        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
        gradient.addColorStop(0.5, "#11998e80")
        gradient.addColorStop(1, "#38ef7d80")

        gradientOfChart.value = gradient
      }

      return gradientOfChart.value
    }

    const chartData = {
      datasets: [
        {
          data: [shareOfThePool.value + 1, 100 - shareOfThePool.value - 1],
          hoverOffset: 4,
          backgroundColor: function (context) {
            if (context.dataIndex === 0) {
              return "blue"
            }

            const chart = context.chart
            const {ctx, chartArea} = chart

            if (!chartArea) {
              return null
            }

            return getOrCreateGradient(ctx, chartArea)
          }
        }
      ]
    }

    const chartOptions = {
      cutout: 95,
      rotation: 85,
      plugins: {
        tooltip: {
          enabled: false
        }
      }
    }

    return {
      chartData,
      chartOptions,
      formatCrypto
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-staked {
  right: -5rem;
  top: calc(50% - 5rem);
  background-color: #fff;
  border-radius: 1000px;
  width: 8rem;
  height: 8rem;
  padding: 2.5rem 0;
}
</style>
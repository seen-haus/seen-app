<template>
  <div class="relative">
    <Chart ref="primeChart" v-if="shareOfThePool" type="doughnut" :data="chartData" :options="chartOptions" />
    <div v-if="shareOfThePool" class="chart-staked absolute text-center">
      <span class="text-2xl font-black">{{ formatCrypto(shareOfThePool, true) }}%</span>
      <br />
      <span class="text-gray-400 text-xs font-bold uppercase">share</span>
    </div>
  </div>
</template>

<script>
import {watchEffect, ref} from "vue"
import BigNumber from "bignumber.js"
import useExchangeRate from "@/hooks/useExchangeRate"

export default {
  name: "StakingChart",
  components: {},
  props: {
    shareOfThePool: BigNumber
  },
  setup(props) {
    const gradientOfChart = ref(null)
    const widthOfChart = ref(0)
    const heightOfChart = ref(0)
    const primeChart = ref()

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

    let chartData = {
      datasets: [
        {
          data: [100 - props.shareOfThePool, props.shareOfThePool],
          hoverOffset: 4,
          backgroundColor: function (context) {
            console.log({context})
            if (context.dataIndex === 0) {
              return "#38EF7D"
            }
            if (context.dataIndex === 1) {
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

    watchEffect(() => {
      if(!props.shareOfThePool) {
        return;
      }

      if (!primeChart.value) {
        return;
      }

      let triggerUpdate = false;
      if(props.shareOfThePool > 0) {
        if(JSON.stringify([100 - props.shareOfThePool, props.shareOfThePool]) !== JSON.stringify(chartData.datasets[0].data)) {
          chartData.datasets[0].data = [100 - props.shareOfThePool, props.shareOfThePool];
          triggerUpdate = true;
        }
      } else {
        if(JSON.stringify([100]) !== JSON.stringify(chartData.datasets[0].data)) {
          chartData.datasets[0].data = [100];
          triggerUpdate = true;
        }
      }
      if(primeChart.value && triggerUpdate) {
        primeChart.value.reinit()
      }
    })

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
      formatCrypto,
      primeChart
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-staked {
  transform: translateX(-50%)translateY(-50%);
  left: 50%;
  top: calc(50% + 5px);
  background-color: #fff;
  border-radius: 1000px;
  width: 8rem;
  height: 8rem;
  padding: 2.5rem 0;
}
</style>
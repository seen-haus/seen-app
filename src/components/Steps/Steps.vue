<template>
  <div class="steps-row">
      <div class="edge-border edge-left"/>
      <div class="step-and-inner-edge-container" v-for="(step, index) in steps" :key="step">
        <div v-if="index !== 0" class="edge-inner" />
        <div class="step-container">
            <div v-if="index < useCurrentStep" class="step-number-container" :class="index === useCurrentStep && 'active-step-number'"><i class="fas fa-check done-step-icon"></i></div>
            <div v-if="index >= useCurrentStep" class="step-number-container" :class="index === useCurrentStep && 'active-step-number'">{{index + 1}}</div>
            <div class="step-label-container" :class="index === useCurrentStep && 'active-step-label'">{{step.label}}</div>
        </div>
      </div>
      <div class="edge-border edge-right"/>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "Steps",
  components: {
    
  },
  props: {
    steps: Object,
    currentStep: Number,
  },
  setup(props) {

    const useCurrentStep = computed(() => {
      return props.currentStep || 0;
    });

    return {
        useCurrentStep,
    };
  },
};
</script>

<style lang="scss" scoped>

.edge-border {
    width: 100%;
    border-top: 2px solid #e6e5e4;
    height: 2px;
}

.edge-left {
    margin-top: 16px;
    margin-right: 15px;
}

.edge-right {
    margin-top: 16px;
    margin-left: 15px;
}

.edge-inner {
    width: 50px;
    border-top: 2px solid #e6e5e4;
    height: 2px;
    margin-right: 15px;
    margin-left: 15px;
    align-self: flex-start;
    margin-top: 16px;
}

.steps-row {
    display: flex;
    justify-content: center;
}

.step-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.step-number-container {
    color: #666666;
    height: 35px;
    width: 35px;
    border: 2px solid #e6e5e4;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.step-label-container {
    position: absolute;
    margin-top: 65px;
    font-weight: bold;
    opacity: 0.6;
}

.step-and-inner-edge-container {
    display: flex;
    align-items: center;
}

.active-step-number {
    opacity: 1;
    border: 2px solid #10BE84;
    background-color: #10BE84;
    color: white;
}

.active-step-label {
    opacity: 1;
}

.done-step-icon {
    margin-left: 1px;
    color: #3fbe84;
}

</style>
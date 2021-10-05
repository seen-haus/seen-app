<template>
  <div class="steps-row">
    <div 
        class="step-container"
        :class="index < (steps.length - 1) && 'mr-4'"
        v-for="(step, index) in steps"
        :key="step"
    >
        <div
            class="step-label-container pl-4"
            :class="[
                index === useCurrentStep && 'active-step-number',
                index < useCurrentStep && 'completed-step clickable',
            ]"
            @click="(index < useCurrentStep) && setStep(index + stepOffset)"
        >
            <div v-if="index < useCurrentStep" class="mr-4 check-container">
                <img src="@/assets/icons/check-circle-green.svg">
            </div>
            <div class="step-label">
                <div>
                    <sub-title
                        class="hidden lg:flex"
                        text-align="left"
                        font-size="14px"
                    >
                        {{step.label}}
                    </sub-title>
                </div>
                <div>
                    <light-typography
                        textAlign="left"
                        font-size="13px"
                    >
                        {{step.helperText}}
                    </light-typography>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
  name: "Steps",
  components: {
    SubTitle,
    LightTypography,
  },
  props: {
    steps: Object,
    currentStep: Number,
    setStep: Function,
    stepOffset: Number,
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
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    flex-direction: column;
}

.step-label-container {
    color: #666666;
    height: 56px;
    width: 100%;
    border: 2px solid #e6e5e4;
    border-radius: 4px;
    display: flex;
    justify-content: left;
    align-items: center;
}

.check-container {
    width: 17px;
    height: 16px;
}

.step-and-inner-edge-container {
    display: flex;
    align-items: center;
}

.active-step-number {
    opacity: 1;
    border: none;
    background: #130B27;
    color: white;
}

.completed-step {
    border-color: #4bdf7f;
}

.active-step-label {
    opacity: 1;
}

.done-step-icon {
    margin-left: 1px;
    color: #3fbe84;
}

</style>
<template>
  <div class="steps-row">
    <div 
        class="step-container"
        :class="index < (useSteps.length - 1) && 'mr-4'"
        v-for="(step, index) in useSteps"
        :key="step"
    >
        <div
            class="pl-4"
            :class="[
                darkMode ? 'step-label-container-dark-mode' : 'step-label-container',
                (index === useCurrentStep) && (darkMode ? 'active-step-number-dark-mode' : 'active-step-number'),
                ((index < useCurrentStep) || (forceCompletedSteps.indexOf(index) > -1) || (index === (useSteps.length - 1) && markFinalStepComplete)) && (darkMode ? 'completed-step-dark-mode' : 'completed-step'),
                ((index < useCurrentStep) || (forceCompletedSteps.indexOf(index) > -1) || (index === (useSteps.length - 1) && markFinalStepComplete)) && dimCompleted && 'opacity-0-6',
                ((index < useCurrentStep) || (forceCompletedSteps.indexOf(index) > -1) || (index === (useSteps.length - 1) && markFinalStepComplete)) && setStep && 'clickable',
            ]"
            @click="setStep && (index < useCurrentStep) && setStep(index + stepOffset)"
        >
            <div v-if="(index < useCurrentStep || (forceCompletedSteps.indexOf(index) > -1) || (index === (useSteps.length - 1) && markFinalStepComplete)) && !hideCompletedIcons" class="mr-4 check-container">
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
    darkMode: {
        type: Boolean,
        default: false
    },
    hideCompletedIcons: {
        type: Boolean,
        default: false
    },
    dimCompleted: {
        type: Boolean,
        default: false
    },
    forceCompletedSteps: {
        type: Array,
        default: () => []
    },
    markFinalStepComplete: {
        type: Boolean,
        default: false
    }
  },
  setup(props) {

    const useCurrentStep = computed(() => {
      return props.currentStep || 0;
    });
    const useSteps = computed(() => props.steps.filter((step) => step.label));

    return {
        useCurrentStep,
        useSteps,
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

.step-label-container-dark-mode {
    color: white;
    height: 56px;
    width: 100%;
    border: 2px solid #e6e5e4ab;
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

.active-step-number-dark-mode {
    opacity: 1;
    border-color: #4bdf7f;
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
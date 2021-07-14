<template>
    <div class="type-selection-step-container auto-margins">
        <sub-title
            class="text-black hidden lg:flex pb-6 pt-12"
            text-align="center"
        >
            Select type of your NFT
        </sub-title>
        <div class="section-description auto-margins pb-12">
            <light-typography>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </light-typography>
        </div>
        <div class="selection-container">
            <div class="mb-6" :class="selectedType === 'nft' ? 'active-selection-option' : 'inactive-selection-option'">
                <div
                    class="selection-option cursor-pointer"
                    @click="setSelectedType('nft')"
                >
                    <div 
                        class="icon-container flex-center"
                        :class="selectedType === 'nft' ? 'active-icon-container' : 'inactive-icon-container'"
                    >
                        <img src="@/assets/icons/type-mint-nft-icon.svg" alt="Type NFT Only Icon">
                    </div>
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden lg:flex mb-2 mt-1"
                            text-align="center"
                            font-size="24px"
                        >
                            Mint NFT
                        </sub-title>
                        <light-typography
                            text-align="left"
                            font-size="14px"
                            font-weight="400"
                        >
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </light-typography>
                    </div>
                </div>
            </div>
            <div :class="selectedType === 'nft-physical' ? 'active-selection-option' : 'inactive-selection-option'">
                <div 
                    class="selection-option cursor-pointer"
                    @click="setSelectedType('nft-physical')"
                >
                    <div 
                        class="icon-container flex-center"
                        :class="selectedType === 'nft-physical' ? 'active-icon-container' : 'inactive-icon-container'"
                    >
                        <img src="@/assets/icons/type-mint-nft-physical-icon.svg" alt="Type NFT Only Icon">
                    </div>
                    <div class="selection-option-text-container">
                        <sub-title
                            class="text-black hidden lg:flex mb-2 mt-1"
                            text-align="center"
                            font-size="24px"
                        >
                            Mint NFT + Physical
                        </sub-title>
                        <light-typography
                            text-align="left"
                            font-size="14px"
                            font-weight="400"
                        >
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </light-typography>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed } from "vue";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";

export default {
    name: "TypeSelection",
    data() {
        return {
            selectedType: null,
        }
    },
    methods: {
        setSelectedType(type) {
            this.selectedType = type;
        },
    },
    components: {
        SubTitle,
        LightTypography,
    },
    setup() {

    }
};
</script>

<style lang="scss" scoped>
    .type-selection-step-container {
        max-width: 800px;
    }
    .section-description {
        display: flex;
        max-width: 600px;
    }
    .selection-option {
        display: flex;
        align-items: center;
        padding: 34px;
        border-radius: 8px;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        background-color: white;
    }
    .icon-container {
        width: 64px;
        height: 64px;
        margin-right: 24px;
        border-radius: 35px;
    }
    .inactive-icon-container {
        @apply bg-black;
    }
    .active-icon-container {
        background: linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%);
    }
    .selection-option-text-container {
        align-items: flex-start;
        max-width: calc(100% - 88px);
        display: flex;
        flex-direction: column;
    }
    .active-selection-option {
        background: linear-gradient(to right, #11998E, #38EF7D);
        border-radius: 10px;
        padding: 2px;
    }
    .inactive-selection-option {
        background-color: white;
        border-radius: 10px;
        padding: 2px;
    }
</style>

<template>
    <div class="flex w-full mt-8">
        <div class="mint-info-form-container">
            <sub-title
                class="light-self-create-back-button light-mode-text-washed disable-text-transform clickable hidden lg:flex mb-1 mt-2"
                text-align="left"
                font-size="13px"
                @click="prevStep"
            >
                <i class="fas fa-chevron-left mr-1"></i>Go Back
            </sub-title>
            <div :class="data.isMarketHandlerAssigned && 'cursor-not-allowed'">
                <div :class="data.nftTokenId && 'disabled opacity-0-6'">
                    <div class="fc mb-3">
                        <label class="font-semibold uppercase text-md text-black">Type</label>
                    </div>
                    <div class="selection-container mb-6">
                        <div class="selection-option-wrapper" :class="data.selectedType === 'auction' ? 'active-selection-option' : 'inactive-selection-option'">
                            <div
                                class="selection-option cursor-pointer"
                                @click="setSelectedType('auction', unitCountField)"
                            >
                                <div class="selection-option-text-container">
                                    <sub-title
                                        class="text-black hidden uppercase lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                    >
                                        Auction
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                                </div>
                            </div>
                        </div>
                        <div class="selection-option-wrapper" :class="data.selectedType === 'sale' ? 'active-selection-option' : 'inactive-selection-option'">
                            <div 
                                class="selection-option cursor-pointer"
                                @click="setSelectedType('sale', unitCountField)"
                            >
                                <div class="selection-option-text-container">
                                    <sub-title
                                        class="text-black hidden uppercase lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                    >
                                        Sale
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`}"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div 
                        v-if="marketTypeData === 'secondary'"
                        class="fc mb-4"
                        :class="{
                            'invalid-outline': unitCountField.errors[0],
                            'disabled': data.selectedType === 'auction',
                            'opacity-0-6': data.selectedType === 'auction',
                        }"
                    >
                        <div class="flex-space-between">
                            <label class="font-semibold uppercase text-md text-black" for="unit-count">
                                Unit Count
                            </label>
                        </div>
                        <div>
                            <input
                                type="number"
                                @wheel="$event.target.blur()"
                                id="unit-count"
                                class="w-full outlined-input mt-2"
                                :placeholder="`Number of units to include in ${data.selectedType ? data.selectedType : 'sale'}`"
                                :disabled="data.selectedType === 'auction'"
                                v-model="unitCountField.value"
                            />
                        </div>
                        <span class="input-helper" v-if="!unitCountField.errors[0]">Balance: {{secondaryBalanceData}}</span>
                        <span class="error-notice">{{ unitCountField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-4">
                        <div class="flex-space-between">
                            <label class="font-semibold uppercase text-md text-black" for="price">
                                {{data.selectedType === 'sale' ? `Sale Price` : null}}
                                {{data.selectedType === 'auction' ? `Reserve Price` : null}}
                                {{['auction', 'sale'].indexOf(data.selectedType) === -1  ? `Price` : null}}
                            </label>
                        </div>
                        <div class="input-inner-label">
                            <div class="input-icon-label" style="width: 50px;height: 20px;">
                                <img src="@/assets/icons/ethereum-icon.svg"  class="" alt="Ethereum logo">
                                <sub-title
                                    class="text-black hidden uppercase lg:flex light-mode-text-washed"
                                    text-align="center"
                                    font-size="15px"
                                >
                                    ETH
                                </sub-title>
                            </div>
                            <input
                                type="number"
                                @wheel="$event.target.blur()"
                                id="price"
                                class="w-full outlined-input mt-2"
                                placeholder="Minimum acceptable price"
                                :class="priceField.errors[0] && 'invalid-outline'"
                                v-model="priceField.value"
                            />
                        </div>
                        <span v-if="!ethereum"><i class="fas fa-spinner fa-spin"></i></span>
                        <span class="input-helper" v-else-if="!priceField.errors[0] && priceField.value">Approximately {{ formatCurrency(ethereum * priceField.value) }}</span>
                        <span class="input-helper" v-else-if="!priceField.errors[0] && !priceField.value">Price Estimated Upon Entering Value</span>
                        <span class="error-notice">{{ priceField.errors[0] }}</span>
                    </div>
                    <div class="fc mb-3">
                        <label class="font-semibold uppercase text-md text-black">Opening Time</label>
                    </div>
                    <div class="selection-container mb-4">
                        <div class="selection-option-wrapper" :class="openingTimeTypeData === 'immediate' ? 'active-selection-option' : 'inactive-selection-option'">
                            <div
                                class="selection-option cursor-pointer"
                                @click="setOpeningTimeTypeInternal('immediate')"
                            >
                                <div class="selection-option-text-container">
                                    <sub-title
                                        class="text-black hidden uppercase lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                    >
                                        Immediate
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Users will be able to immediately ${data.selectedType === 'sale' ? 'purchase' : 'bid on'} your piece.`}" :key="`immediate-tooltip-${data.selectedType}`"></i>
                                </div>
                            </div>
                        </div>
                        <div class="selection-option-wrapper" :class="openingTimeTypeData === 'schedule' ? 'active-selection-option' : 'inactive-selection-option'">
                            <div 
                                class="selection-option cursor-pointer"
                                @click="setOpeningTimeTypeInternal('schedule')"
                            >
                                <div class="selection-option-text-container">
                                    <sub-title
                                        class="text-black hidden uppercase lg:flex"
                                        text-align="center"
                                        font-size="15px"
                                    >
                                        Schedule
                                    </sub-title>
                                    <i class="fas fa-info-circle light-mode-text-washed ml-2" tooltip-ignore-click="true" v-tooltip="{text: `Users will be able to see your listing, but will not be able to ${data.selectedType === 'sale' ? 'purchase' : 'bid on'} your piece until the scheduled time.`}" :key="`schedule-tooltip-${data.selectedType}`"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fc mb-6">
                        <div class="p-field p-col-12 p-md-4">
                            <Calendar :disabled="openingTimeTypeData === 'immediate'" :class="openingTimeTypeData === 'immediate' ? 'disabled' : null" placeholder="Opening Time" class="w-full outlined-input mt-2" id="opening-time" v-model="data.openingTime" :showTime="true" hourFormat="12" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="marketTypeData === 'primary' && !data.isMarketHandlerAssigned">
                <button v-if="!data.isMarketHandlerAssigned" :class="'primary'" class="button mt-6 w-full" @click="deployListingOnChain">
                    Deploy on-chain {{data.selectedType}}
                </button>
            </div>
            <div v-if="marketTypeData === 'secondary' && !data.isMarketHandlerAssigned">
                <button v-if="!processData.hasApprovedMarketPlaceAsOperator" :class="'primary'" class="button mt-6 w-full" @click="approveMarketOperator">
                    Approve Market Operator
                </button>
                <button :disabled="!processData.hasApprovedMarketPlaceAsOperator" :class="processData.hasApprovedMarketPlaceAsOperator ? 'primary' : 'disabled'" class="button mt-6 w-full" @click="deployListingOnChain">
                    Deploy on-chain {{data.selectedType}}
                </button>
            </div>
            <button v-if="data.isMarketHandlerAssigned" :class="'primary'" class="button mt-6 w-full" @click="nextStep">
                Continue
            </button>
        </div>
        <div class="preview-container">
            <drop-card-preview 
                :autoMargins="true"
                :sticky="true"
                :listingType="listingTypeData"
                :startTime="openingTimeUnixData ? openingTimeUnixData * 1000 : null"
                :units="unitData"
                :items="unitData"
                :itemsOf="unitData"
                :price="priceData"
                :priceType="priceTypeData"
                :tangibility="tangibilityData"
                :tags="tagData"
                :titleText="titleData"
                :creatorAccount="creatorData.account"
                :creatorProfilePicture="creatorData.profilePicture"
                :creatorUsername="creatorData.username"
                :mediaUrl="mediaUrl"
                :collectableState="collectableState"
                :updateProgress="updateProgress"
                :progress="100"
                :timerState="timerState"
                :liveStatus="liveStatus"
            />
        </div>
    </div>
</template>

<script>

import { ref, reactive, computed, watchEffect } from "vue";
import {useField, useForm} from "vee-validate";
import {useStore} from "vuex";

import { useToast } from "primevue/usetoast";

import Calendar from 'primevue/calendar';
import Chips from 'primevue/chips';

import {parseEther} from "ethers/lib/utils";

import SubTitle from "@/components/SubTitle.vue";
import LightTypography from "@/components/LightTypography.vue";
import DropCardPreview from "@/components/DropCardPreview/DropCardPreview.vue";

import parseError from "@/services/utils/parseError";
import useWeb3 from "@/connectors/hooks"
import useExchangeRate from "@/hooks/useExchangeRate.js";

import {
    useV3NftContractNetworkReactive,
    useV3AuctionBuilderContractNetworkReactive,
    useV3SaleBuilderContractNetworkReactive,
} from '@/hooks/useContract.js';

import {
    chainIdToMarketDiamond
} from '@/constants/ContractAddressesV3';

import { parseConsignmentRegisteredEventData } from "@/services/utils";

export default {
    name: "TypeSelection",
    created() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);

        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today,invalidDate];
    },
    props: {
        nextStep: Function,
        prevStep: Function,
        setStep: Function,
        setListingTypeData: Function,
        listingTypeData: String,
        setPriceData: Function,
        priceData: String,
        setPriceTypeData: Function,
        priceTypeData: String,
        mediaUrl: String,
        tangibilityData: String,
        titleData: String,
        tagData: Array,
        unitData: String,
        setUnitData: Function,
        openingTimeTypeData: String,
        setOpeningTimeType: Function,
        openingTimeUnixData: String,
        setOpeningTimeUnix: Function,
        setNftTokenIdData: Function,
        nftTokenIdData: String,
        nftTokenAddressData: String,
        setNftConsignmentIdData: Function,
        nftConsignmentIdData: String,
        isMarketHandlerAssignedData: Boolean,
        setIsMarketHandlerAssignedData: Function,
        collectableState: [String, Boolean],
        updateProgress: Function,
        timerState: [String, Boolean],
        liveStatus: [String, Boolean],
        marketTypeData: String,
        secondaryBalanceData: [Number, Boolean],
    },
    methods: {
        setSelectedType(type, unitCountField) {
            let { resetField } = unitCountField;
            this.data.selectedType = type;
            console.log({resetField, 'this.marketTypeData': this.marketTypeData})
            this.setListingTypeData(type);
            if(type === 'auction') {
                this.setPriceTypeData('Reserve Price');
                if(this.marketTypeData === 'secondary') {
                    // resetField("1");
                    this.setUnitData(1)
                }
            } else if(type === 'sale') {
                this.setPriceTypeData('Sale Price');
                if(this.marketTypeData === 'secondary') {
                    this.setUnitData(this.secondaryBalanceData);
                    // resetField(this.secondaryBalanceData);
                }
            }
        },
        setOpeningTimeTypeInternal(type) {
            this.setOpeningTimeType(type);
            if(type === 'immediate') {
                let unixTimeNow = Math.floor(new Date().setSeconds(0) / 1000);
                this.setOpeningTimeUnix(unixTimeNow);
                this.data.openingTimeType = 'immediate';
                this.data.openingTime = new Date(unixTimeNow * 1000);
            } else if (type === 'schedule' && document.getElementById('opening-time')) {
                setTimeout(() => {
                    document.getElementById('opening-time').focus();
                }, 100)
            }
        },
    },
    components: {
        SubTitle,
        LightTypography,
        DropCardPreview,
        Chips,
        Calendar,
    },
    setup(props) {

        const store = useStore();
        const { formatCurrency, ethereum } = useExchangeRate();
        const toast = useToast();
        
        const userLocal = computed(() => store.getters['user/user']);

        const creatorData = ref({
            account: false,
            profilePicture: false,
            username: false,
        });

        const processData = reactive({
            lastCheckedAccountForApproval: false,
            hasApprovedMarketPlaceAsOperator: false,
        })

        watchEffect(() => {
            let userStoreData = store.getters['user/user'];
            if(userStoreData) {
                if(userStoreData?.username?.length > 0) {
                    creatorData.value.username = userStoreData.username;
                } else {
                    creatorData.value.username = false;
                }
                if(userStoreData?.wallet?.length > 0) {
                    creatorData.value.account = userStoreData.wallet;
                } else {
                    creatorData.value.account = false;
                }
                if(userStoreData?.image?.length > 0) {
                    creatorData.value.profilePicture = userStoreData.image;
                } else {
                    creatorData.value.profilePicture = false;
                }
            } else if(account) {
                creatorData.value.profilePicture = false;
                creatorData.value.username = false;
                creatorData.value.account = account.value;
            }
        })

        const { account, chainId } = useWeb3();

        const data = reactive({
            selectedType: props.listingTypeData ? props.listingTypeData : null,
            price: false,
            isNextStepReady: false,
            openingTime: props.openingTimeUnixData && new Date(props.openingTimeUnixData * 1000) || false,
            openingTimeType: props.openingTimeTypeData || false,
            consignmentId: props.consignmentIdData || false,
            isMarketHandlerAssigned: props.isMarketHandlerAssignedData || false,
            unitData: props.unitData,
            marketType: props.marketTypeData,
        })

        watchEffect(() => {
            data.isMarketHandlerAssigned = props.isMarketHandlerAssignedData;
        })

        const priceField = reactive(useField("price", `required|min:1|min_value:0.00001`));

        watchEffect(() => {
            let { resetField } = priceField;
            if(priceField?.value && (props.priceData !== priceField.value)) {
                props.setPriceData(priceField.value)
            } else if (priceField?.value === "" && props.priceData !== false) {
                props.setPriceData(false)
            } else if(props.priceData !== false && priceField?.value !== props.priceData) {
                resetField({
                    value: props.priceData
                })
            } else if (priceField?.value === "") {
                props.setPriceData(false)
            }
        })

        const unitCountField = reactive(useField("unit-count", `required|min:1|min_value:1|max_value:${props.secondaryBalanceData}`));

        watchEffect(() => {
            let { resetField } = unitCountField;
            console.log({'props.unitData': props.unitData, 'data.unitData': data.unitData, 'unitCountField.value': unitCountField.value, 'props.listingTypeData': props.listingTypeData})
            if(unitCountField?.value && (props.unitData !== unitCountField.value)) {
                console.log("Here 1")
                if(props.marketTypeData === 'secondary' && (typeof unitCountField?.value !== 'string' || props.listingTypeData === 'auction')) {
                    if(props.listingTypeData === 'auction') {
                        props.setUnitData(1)
                        resetField({
                            value: 1
                        })
                    }else{
                        props.setUnitData(props.unitData)
                        resetField({
                            value: props.unitData
                        })
                    }
                } else {
                    props.setUnitData(unitCountField.value)
                }
            } else if (unitCountField?.value === "" && props.unitData !== false) {
                console.log("Here 2")
                props.setUnitData(false)
            } else if(props.unitData !== false && unitCountField?.value !== props.unitData) {
                console.log("Here 3")
                resetField({
                    value: props.unitData
                })
            } else if (unitCountField?.value === "") {
                console.log("Here 4")
                if(props.marketTypeData === 'secondary' && (typeof unitCountField?.value !== 'string' || props.listingTypeData === 'auction')) {
                    if(props.listingTypeData === 'auction') {
                        props.setUnitData(1)
                        resetField({
                            value: 1
                        })
                    }else{
                        props.setUnitData(props.unitData)
                        resetField({
                            value: props.unitData
                        })
                    }
                } else {
                    props.setUnitData(false)
                }
            }
        })

        watchEffect(() => {
            if(data.openingTime && data.openingTime.getTime && data.openingTime.getTime()) {
                data.openingTime.setSeconds(0);
                if(Math.floor(data.openingTime.getTime() / 1000) !== props.openingTimeUnixData) {
                    props.setOpeningTimeUnix(Math.floor(data.openingTime.getTime() / 1000));
                    if(!props.openingTimeTypeData && !data.openingTimeType) {
                        props.setOpeningTimeType('schedule');
                    }
                }
            } else if (data.openingTime) {
                let fragments = data.openingTime.split(' ');
                if(fragments.length === 3) {
                    if((fragments[0].length === 9) && (fragments[1].length === 5) && (fragments[2].length === 2)) {
                        let date = new Date(data.openingTime).setSeconds(0);
                        if(date.getTime()) {
                            data.openingTime = date;
                            this.setOpeningTimeUnix(Math.floor(date.getTime() / 1000));
                        }
                    }
                }
            }
        })

        watchEffect(() => {
            // This doesn't actually handle validation, it's just meant to check if there are validation errors

            // Required fields
            let isValidType = data.openingTimeType;
            let isValidPrice = priceField?.value && !priceField.errors[0];
            let isValidOpeningTimeType = data.openingTimeType;
            let isValidOpeningTime = data.openingTime && !isNaN(new Date(data.openingTime));

            if(
                isValidType
                && isValidPrice
                && isValidOpeningTimeType
                && isValidOpeningTime
            ) {
                // if(JSON.stringify(data.preparedMetaDataLocal) !== JSON.stringify(props.preparedMetaData)) {
                //     props.setMetaDataIpfsHashData(false);
                // }
            } else {
                // data.preparedMetaDataLocal = false;
                // props.setMetaDataIpfsHashData(false);
            }
        })

        const seenNFTContract = ref({});
        const seenAuctionBuilderContract = ref({});
        const seenSaleBuilderContract = ref({});

        watchEffect(async () => {
            let contract = await useV3AuctionBuilderContractNetworkReactive(true);
            seenAuctionBuilderContract.value = contract.state;
        })

        watchEffect(async () => {
            let contract = await useV3SaleBuilderContractNetworkReactive(true);
            seenSaleBuilderContract.value = contract.state;
        })

        watchEffect(async () => {
            let contract = await useV3NftContractNetworkReactive(true);
            seenNFTContract.value = contract.state;
        })

        watchEffect(async () => {
            // Assume no access
            if(account?.value && (account?.value !== processData.lastCheckedAccountForApproval)) {
                processData.hasApprovedMarketPlaceAsOperator = false;
                if(seenNFTContract.value.contract && (Number(chainId.value) > 0)) {
                    processData.lastCheckedAccountForApproval = account?.value;
                    // Check that current user has approved the marketplace diamond as an operator for their SEEN NFTs
                    console.log(account?.value, chainIdToMarketDiamond(Number(chainId.value)), Number(chainId.value))
                    let hasApprovedMarketPlaceAsOperator = await seenNFTContract.value.contract.isApprovedForAll(account?.value, chainIdToMarketDiamond(Number(chainId.value)));
                    console.log({hasApprovedMarketPlaceAsOperator})
                    processData.hasApprovedMarketPlaceAsOperator = hasApprovedMarketPlaceAsOperator;
                }
            } else if (!account?.value) {
                processData.lastCheckedAccountForApproval = false;
                processData.hasApprovedMarketPlaceAsOperator = false;
            }
        })

        const approveMarketOperator = async () => {
            if(seenNFTContract.value.contract && (Number(chainId.value) > 0 && account?.value)) {
                let nftContract = seenNFTContract.value.contract;
                store.dispatch('application/openModal', 'TransactionModal')
                try {
                    let tx = await nftContract.setApprovalForAll(chainIdToMarketDiamond(Number(chainId.value)), true);
                    store.dispatch('application/setPendingTransactionHash', tx.hash)
                    tx.wait()
                        .then((response) => {
                            if(response.status === 1) {
                                toast.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: `Successfully approved market operator.`,
                                    life: 3000
                                });
                                processData.hasApprovedMarketPlaceAsOperator = true;
                                store.dispatch('application/closeModal')
                                store.dispatch('application/clearPendingTransactionHash')
                            } else {
                                throw new Error('Transaction Reverted');
                            }
                        }).catch((e) => {
                            let message = parseError(e.message)
                            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                            store.dispatch('application/closeModal')
                            store.dispatch('application/clearPendingTransactionHash')
                        })
                } catch (e) {
                    let message = e?.message ? parseError(e.message) : e;
                    toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                    store.dispatch('application/closeModal')
                    store.dispatch('application/clearPendingTransactionHash')
                }
            }
        }

        const deployListingOnChain = async () => {
            if(
                (
                    (data.selectedType === 'auction' && seenAuctionBuilderContract.value.contract) ||
                    (data.selectedType === 'sale' && seenSaleBuilderContract.value.contract)
                )
                && account?.value
            ) {
                let useListingContract;
                if(data.selectedType === 'auction') {
                    useListingContract = seenAuctionBuilderContract.value.contract;
                } else if (data.selectedType === 'sale') {
                    useListingContract = seenSaleBuilderContract.value.contract;
                }
                store.dispatch('application/openModal', 'TransactionModal')
                try {
                    let tx;
                    let audience = 0; // Open
                    let priceWei = parseEther(priceField?.value).toString();
                    if(data.selectedType === 'auction') {
                        // function createPrimaryAuction (
                        //     uint256 _consignmentId,
                        //     uint256 _start,
                        //     uint256 _duration,
                        //     uint256 _reserve,
                        //     SeenTypes.Audience _audience,
                        //     SeenTypes.Clock _clock
                        // )
                        let duration = 120; // 24 hours
                        let clock = 1; // Triggered when reserve is hit
                        if(props.marketTypeData === 'secondary') {
                            tx = await useListingContract.createSecondaryAuction(account?.value, props.nftTokenAddressData, props.nftTokenIdData, props.openingTimeUnixData, duration, priceWei, audience, clock);
                        } else {
                            tx = await useListingContract.createPrimaryAuction(props.nftConsignmentIdData, props.openingTimeUnixData, duration, priceWei, audience, clock);
                        }
                    } else if(data.selectedType === 'sale') {
                        // function createPrimarySale (
                        //     uint256 _consignmentId,
                        //     uint256 _start,
                        //     uint256 _price,
                        //     uint256 _perTxCap,
                        //     Audience _audience
                        // )
                        if(props.marketTypeData === 'secondary') {
                            tx = await useListingContract.createSecondarySale(account?.value, props.nftTokenAddressData, props.nftTokenIdData, props.openingTimeUnixData, props.unitData, priceWei, props.unitData, audience);
                        } else {
                            tx = await useListingContract.createPrimarySale(props.nftConsignmentIdData, props.openingTimeUnixData, priceWei, props.unitData, audience);
                        }
                    }
                    store.dispatch('application/setPendingTransactionHash', tx.hash)
                    tx.wait()
                        .then((response) => {
                            if(response.status === 1) {
                                if(props.marketTypeData === 'secondary') {
                                    const consignmentId = Number(response.events[3].args.consignmentId);
                                    props.setNftConsignmentIdData(consignmentId);
                                }
                                toast.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: `Successfully deployed ${data.selectedType}.`,
                                    life: 3000
                                });
                                store.dispatch('application/closeModal')
                                store.dispatch('application/clearPendingTransactionHash')
                                props.setIsMarketHandlerAssignedData(true);
                                props.nextStep();
                            } else {
                                throw new Error('Transaction Reverted');
                            }
                        }).catch((e) => {
                            let message = e?.message ? parseError(e.message) : e;
                            console.error({error: e})
                            props.setIsMarketHandlerAssignedData(false);
                            toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                            store.dispatch('application/closeModal')
                            store.dispatch('application/clearPendingTransactionHash')
                        })
                } catch (e) {
                    let message = e?.message ? parseError(e.message) : e;
                    console.error({error: e})
                    props.setIsMarketHandlerAssignedData(false);
                    toast.add({severity: 'error', summary: 'Error', detail: `${message}`, life: 3000});
                    store.dispatch('application/closeModal')
                    store.dispatch('application/clearPendingTransactionHash')
                }
            }
        }

        return {
            priceField,
            unitCountField,
            data,
            creatorData,
            ethereum,
            formatCurrency,
            deployListingOnChain,
            approveMarketOperator,
            processData,
        }

    }
};
</script>

<style lang="scss" scoped>
    .mint-info-form-container {
        max-width: 800px;
        width: calc(100% - 368px);
        margin-right: 20px;
        position: relative;
    }
    .preview-container {
        width: 348px;
    }
    .selection-container {
        display: flex;
        justify-content: space-between;
    }
    .selection-option-wrapper {
        width: calc(50% - 8px);
    }
    .section-description {
        display: flex;
        max-width: 600px;
    }
    .selection-option {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        padding-top: 33px;
        padding-bottom: 33px;
        border-radius: 8px;
        box-shadow: 0px 6px 20px rgba(142, 152, 160, 0.2);
        background-color: white;
    }
    .icon-container {
        width: 48px;
        height: 48px;
        margin-right: 20px;
        border-radius: 35px;
    }
    .inactive-icon-container {
        @apply bg-black;
    }
    .active-icon-container {
        background: linear-gradient(94.05deg, #11998E 1.74%, #38EF7D 100%);
    }
    .selection-option-text-container {
        max-width: calc(100% - 88px);
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .active-selection-option {
        background: linear-gradient(to right, #11998E, #38EF7D);
        border-radius: 10px;
        padding: 2px;
        .selection-option {
            background: #eafbf3;
        }
    }
    .inactive-selection-option {
        background-color: white;
        border-radius: 10px;
        padding: 2px;
    }
</style>

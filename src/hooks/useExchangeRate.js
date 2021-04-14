import {computed} from 'vue';
import {useStore} from "vuex"

export default function useExchangeRate() {
    const store = useStore();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const formatterCrypto = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 4
    });
    const formatterCrypto2 = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
    });
    const formatCurrency = function (value) {
        return formatter.format(value);
    };

    const formatCrypto = function (value, currency = false) {
        return currency ? formatterCrypto2.format(value) : formatterCrypto.format(value);
    };

    const convertEthToUSDAndFormat = function (numOfEth) {
        return formatCurrency((currencies.value ? currencies.value.ethereum : 0) * parseFloat(numOfEth, 10))
    }

    const convertSeenToUSDAndFormat = function (numOfSeen) {
        return formatCurrency((currencies.value ? currencies.value.seen : 0) * parseFloat(numOfSeen, 10))
    }

    const converEthToUSD = (numOfEth) => (currencies.value ? currencies.value.ethereum : 0) * parseFloat(numOfEth, 10);

    const currencies = computed(() => store.getters['application/currencies']);
    const seen = computed(() => currencies.value ? currencies.value.seen : null);
    const bitcoin = computed(() => currencies.value ? currencies.value.bitcoin : null);
    const ethereum = computed(() => currencies.value ? currencies.value.ethereum : null);

    return {
        currencies,
        seen,
        bitcoin,
        ethereum,
        formatCurrency,
        formatCrypto,
        convertEthToUSDAndFormat,
        convertSeenToUSDAndFormat,
        converEthToUSD,
    };
}

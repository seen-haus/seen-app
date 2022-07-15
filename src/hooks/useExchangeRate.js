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

    const formatCrypto = function (value, currency = false, decimals = false) {
        if(!decimals) {
            return currency ? formatterCrypto2.format(value) : formatterCrypto.format(value);
        }else{
            const formatterCryptoCustom = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimals
            });
            return formatterCryptoCustom.format(value)
        }
    };

    const convertEthToUSDAndFormat = function (numOfEth) {
        return formatCurrency((currencies.value ? currencies.value.ethereum : 0) * parseFloat(numOfEth, 10))
    }

    const convertCustomPaymentTokenToUSDAndFormat = function (numOfToken, coingeckoId) {
        return formatCurrency((currencies.value ? currencies.value[coingeckoId] : 0) * parseFloat(numOfToken, 10))
    }

    const convertSeenToUSDAndFormat = function (numOfSeen) {
        return formatCurrency((currencies.value ? currencies.value.seen : 0) * parseFloat(numOfSeen, 10))
    }

    const converEthToUSD = (numOfEth) => (currencies.value ? currencies.value.ethereum : 0) * parseFloat(numOfEth, 10);

    const convertCustomPaymentTokenToUSD = (numOfToken, coingeckoId) => (currencies.value ? currencies.value[coingeckoId] : 0) * parseFloat(numOfToken, 10);

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
        convertCustomPaymentTokenToUSD,
        convertCustomPaymentTokenToUSDAndFormat,
        converEthToUSD,
    };
}

import { computed } from 'vue';
import {useStore} from "vuex"

export default function useExchangeRate() {
  const store = useStore();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const formatCurrency = function(value) {
    return formatter.format(value);
  };

  const convertEthToUSDAndFormat = function(numOfEth) {
    return formatCurrency((currencies.value ? currencies.value.ethereum : 0) * parseFloat(numOfEth, 10))
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
    convertEthToUSDAndFormat,
    converEthToUSD,
  };
}
import {
    useV3MarketClerkContract,
} from "@/hooks/useContract";
import { ref, onBeforeUnmount} from 'vue';

const useConsignmentRecoveryList = () => {

    const recoveryList = ref([]);

    let marketClerkContract = null;

    const fetchRecoveryList = async (account) => {
        try {

          const marketClerkContractRaw = await useV3MarketClerkContract();
          marketClerkContract = marketClerkContractRaw;

          // Get registered consignments
          let registeredConsignmentsFilter = marketClerkContract.filters.ConsignmentRegistered(account, null, null);
          const registeredConsignments = await marketClerkContract.queryFilter(registeredConsignmentsFilter);

          // Get marketed consignments
          let marketedConsignmentsFilter = marketClerkContract.filters.ConsignmentMarketed(account, null, null);
          const marketedConsignments = await marketClerkContract.queryFilter(marketedConsignmentsFilter);
          let marketedConsignmentIds = marketedConsignments.map(item => Number(item?.args?.consignmentId));

          const recoveryConsignments = registeredConsignments.filter(item => marketedConsignmentIds.indexOf(Number(item?.args?.consignment?.id)) === -1);

          recoveryList.value = recoveryConsignments;
          return true;
        }catch(e){
            recoveryList.value = [];
            console.log({'fetchRecoveryList error': e})
        }
    };

    onBeforeUnmount(() => {
        if (marketClerkContract) {
          marketClerkContract.removeAllListeners();
        }
    });

    return [recoveryList, fetchRecoveryList];
}

export default useConsignmentRecoveryList;

import { useDistributionContract } from "@/hooks/useContract";

const useDistributionContractEvents = () => {
    // TODO in a way that works with useDistributionContractNetworkReactive
    const contract = useDistributionContract(false);
    const getDistributionEvents = async () => {
        return await contract.queryFilter("SwapForMinimum");
    }

    return { getDistributionEvents }
}

export default useDistributionContractEvents;

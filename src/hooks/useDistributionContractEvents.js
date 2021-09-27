import { useDistributionContract } from "@/hooks/useContract";

const useDistributionContractEvents = () => {
    const contract = useDistributionContract(false);
    const getDistributionEvents = async () => {
        return await contract.queryFilter("SwapForMinimum");
    }

    return { getDistributionEvents }
}

export default useDistributionContractEvents;

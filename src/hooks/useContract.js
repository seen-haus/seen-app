import useWeb3 from "@/connectors/hooks"
import {getContract} from "@/services/utils"
import ERC20_ABI from "@/constants/abis/erc20.json"
import {Web3Provider, WebSocketProvider} from "@ethersproject/providers";

function useContract(address, ABI, withSignerIfPossible = true) {
    const {account, provider} = useWeb3()
    const library = provider.value
        ? new Web3Provider(provider.value)
        : new WebSocketProvider(process.env.VUE_APP_NETWORK_URL)

    try {
        return getContract(address, ABI, library, withSignerIfPossible && account.value ? account.value : undefined)
    } catch (error) {
        console.error('Failed to get contract', error)
        return null
    }
}

export function useTokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}


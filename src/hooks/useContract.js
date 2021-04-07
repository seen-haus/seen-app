import useWeb3 from "@/connectors/hooks"
import {getContract} from "@/services/utils"
import ERC20_ABI from "@/constants/abis/erc20.json"
import TANGIBLE_V1_ABI from "@/constants/abis/tangibleABI.json"
import ENGLISH_AUCTION_V1_ABI from "@/constants/abis/englishAuctionABI.json"
import NFT_SALE_V1_ABI from "@/constants/abis/NFTSaleABI.json"
import {Web3Provider, WebSocketProvider} from "@ethersproject/providers"

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

export function useV1AuctionContract(contract, withSignerIfPossible) {
    return useContract(contract, ENGLISH_AUCTION_V1_ABI, withSignerIfPossible)
}

export function useV1NftContract(contract, withSignerIfPossible) {
    return useContract(contract, NFT_SALE_V1_ABI, withSignerIfPossible)
}

export function useV1TangibleContract(contract, withSignerIfPossible) {
    return useContract(contract, TANGIBLE_V1_ABI, withSignerIfPossible)
}

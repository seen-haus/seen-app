import useWeb3 from "@/connectors/hooks"
import {getContract} from "@/services/utils"
import ERC20_ABI from "@/constants/abis/erc20.json"
import TANGIBLE_V1_ABI from "@/constants/abis/tangibleABI.json"
import ENGLISH_AUCTION_V1_ABI from "@/constants/abis/englishAuctionABI.json"
import ENGLISH_AUCTION_V2_ABI from "@/constants/abis/englishAuctionV2ABI.json"
import OPEN_EDITION_V2_ABI from "@/constants/abis/openEditionV2ABI.json"
import NFT_SALE_V1_ABI from "@/constants/abis/NFTSaleABI.json"
import XSEEN_ABI from "@/constants/abis/xseenABI.json"
import CLAIM_ABI from "@/constants/abis/claimABI.json"
import SEEN_NFT_ABI from "@/constants/abis/SeenNFT.json"
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

export function useV2AuctionContract(contract, withSignerIfPossible) {
    return useContract(contract, ENGLISH_AUCTION_V2_ABI, withSignerIfPossible)
}

export function useV2OpenEditionContract(contract, withSignerIfPossible) {
    return useContract(contract, OPEN_EDITION_V2_ABI, withSignerIfPossible)
}

export function useV1NftContract(contract, withSignerIfPossible) {
    return useContract(contract, NFT_SALE_V1_ABI, withSignerIfPossible)
}

export function useV1TangibleContract(contract, withSignerIfPossible) {
    return useContract(contract, TANGIBLE_V1_ABI, withSignerIfPossible)
}

export function useStakingContract(withSignerIfPossible) {
    const contractAddress = process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS
    return useContract(contractAddress, XSEEN_ABI, withSignerIfPossible)
}

export function useSEENContract(withSignerIfPossible) {
    const contractAddress = "0xca3fe04c7ee111f0bbb02c328c699226acf9fd33";
    return useContract(contractAddress, ERC20_ABI, withSignerIfPossible)
}

export function useSeenNFTContract(contract, withSignerIfPossible) {
    return useContract(contract, SEEN_NFT_ABI, withSignerIfPossible)
}

export function useClaimContract(contractAddress, withSignerIfPossible) {
    return useContract(contractAddress, CLAIM_ABI, withSignerIfPossible);
}


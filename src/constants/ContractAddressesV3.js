export const chainIdToAccessController = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0xfc1c1eCE11FCe7e60E0Dc57a49E258a04D69Abb2'
        }
    }
}

export const chainIdToSeenNFT = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0x6C03e12153De621aa7213A22b6FaA60aC0bAA3EF'
        }
    }
}

export const chainIdToMarketDiamond = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0x9A571BC17F3a1bFE9010901a7d85Cb269610D9C2'
        }
    }
}
export const chainIdToAccessController = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0xc1167D4F4989e283A6ABEab8fDA30f88C455D754'
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
            return '0x419951ac4A7B497F965dA2769b27AC5ce5aBFDa0'
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
            return '0xAb4D437B16a8636e0775D4938B74cb1D53Ed51eB'
        }
    }
}
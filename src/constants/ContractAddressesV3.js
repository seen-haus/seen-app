export const chainIdToAccessController = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0x412dA1252525120CF19B856501e9CDB28584BF9d'
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
            return '0x1Ae79bc51137D54689d8eA640ED2f5F0A334aC79'
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
            return '0x32207f46334e41A7745416D4287984b6f9Fe24b2'
        }
    }
}

export const chainIdToDistributionPool = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return '0x1c436a02ea4C17522E656f730537D68f71fab92c';
        } else if(useChainId === 4) {
            return null;
        }
    }
}
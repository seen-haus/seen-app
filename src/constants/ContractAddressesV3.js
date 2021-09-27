export const chainIdToAccessController = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === 1) {
            return null;
        } else if(useChainId === 4) {
            return '0x4Df17b603cFc656B82b7B8909Ca6012f67cEBDF5'
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
            return '0x2f59374b282C9eb3619544c8d83EC9b81928ffFE'
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
            return '0x5e56Fc9b88fd6E354a4f6E4b0cB4D565DE6ceFC7'
        }
    }
}
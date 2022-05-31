import {CHAIN_ID_ETHEREUM_MAINNET, CHAIN_ID_ETHEREUM_RINKEBY} from "@/constants/ChainIds";

export const chainIdToAccessController = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return '0xe6f6962AD9f159353B8BC81f76A7FD19A0F686Bd';
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return '0x412dA1252525120CF19B856501e9CDB28584BF9d'
        }
    }
}

export const chainIdToSeenNFT = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return '0x93104324A0516BAE778Ce91F6109A65b45167B7a';
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return '0x1Ae79bc51137D54689d8eA640ED2f5F0A334aC79'
        }
    }
}

export const chainIdToMarketDiamond = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return '0x7C7Cb155A0ad629Cd0FCb4d2D7C5009C23bF39A3';
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return '0x32207f46334e41A7745416D4287984b6f9Fe24b2'
        }
    }
}

export const chainIdToDistributionPool = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return '0x1c436a02ea4C17522E656f730537D68f71fab92c';
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return null;
        }
    }
}

export const chainIdToItemsTicketer = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return '0xaD91240B3211Fa46dA471Cb6014F796Ec98d33F8';
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return '0xfa96c834734fe6422547d075cf162f95cf000d00';
        }
    }
}

export const chainIdToItemsTicketerClaimHelper = (chainId = false) => {
    if(chainId) {
        // Cast to number
        let useChainId = Number(chainId);
        if(useChainId === CHAIN_ID_ETHEREUM_MAINNET) {
            return null;
        } else if(useChainId === CHAIN_ID_ETHEREUM_RINKEBY) {
            return '0xA0dE22b1EC90BCADBc0E42A4fD2302D929656523';
        }
    }
}
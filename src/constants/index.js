const ethers = require('ethers');
const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;

import {CHAIN_ID_ETHEREUM_MAINNET, CHAIN_ID_ETHEREUM_RINKEBY} from "@/constants/ChainIds";

export const roleToBytes = {
	"SELLER": keccak256(toUtf8Bytes("SELLER")),
	"MINTER": keccak256(toUtf8Bytes("MINTER")),
	"ESCROW_AGENT": keccak256(toUtf8Bytes("ESCROW_AGENT")),
}

export const marketHandlerToListingType = {
	0: false, // unhandled
	1: 'auction',
	2: 'sale',
}

export const selfUrl = () => {
	if(process.env.NODE_ENV === 'development') {
		return 'http://localhost:8080/'
	} else {
		return 'https://seen.haus/'
	}
}

export const useOpenSeaBaseAPI = (chainId = CHAIN_ID_ETHEREUM_MAINNET) => {
	if(Number(chainId) === CHAIN_ID_ETHEREUM_RINKEBY) {
		return 'https://testnets-api.opensea.io/api/v1/';
	}
	return 'https://api.opensea.io/api/v1/';
}

export const useOpenSeaCollectionV3 = (chainId = CHAIN_ID_ETHEREUM_MAINNET) => {
	if(Number(chainId) === CHAIN_ID_ETHEREUM_RINKEBY) {
		return ['unidentified-contract-tc3us6vc5g', 'seen-haus-v2'];
	}
	return ['seen-haus'];
}
const ethers = require('ethers');
const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;

export const roleToBytes = {
	"SELLER": keccak256(toUtf8Bytes("SELLER")),
	"MINTER": keccak256(toUtf8Bytes("MINTER")),
	"ESCROW_AGENT": keccak256(toUtf8Bytes("ESCROW_AGENT")),
}
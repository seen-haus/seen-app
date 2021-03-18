const NFT = 'nft';
const TANGIBLE = 'tangible';
const TANGIBLE_NFT = 'tangible_nft';
const NONE = 'none'


export const COLLECTABLE_TYPE = Object.freeze({
    NFT,
    TANGIBLE,
    TANGIBLE_NFT,
    NONE,
});


export const COLLECTABLE_STATE = Object.freeze({
    WAITING: 'WAITING',
    IN_PROGRESS: 'IN_PROGRESS',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    DONE: 'DONE',
});
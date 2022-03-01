
export const CHAIN_ID_ETHEREUM_MAINNET = 1;
export const CHAIN_ID_ETHEREUM_ROPSTEN = 3;
export const CHAIN_ID_ETHEREUM_RINKEBY = 4;
export const CHAIN_ID_ETHEREUM_GOERLI = 5;
export const CHAIN_ID_ETHEREUM_KOVAN = 42;

export const DEFAULT_CHAIN_ID = CHAIN_ID_ETHEREUM_MAINNET;
// export const DEFAULT_CHAIN_ID = CHAIN_ID_ETHEREUM_RINKEBY;

export const CHAIN_ID_TO_NETWORK = {
  [CHAIN_ID_ETHEREUM_MAINNET]: 'mainnet',
  [CHAIN_ID_ETHEREUM_ROPSTEN]: 'ropsten',
  [CHAIN_ID_ETHEREUM_RINKEBY]: 'rinkeby',
  [CHAIN_ID_ETHEREUM_KOVAN]: 'kovan',
  [CHAIN_ID_ETHEREUM_GOERLI]: 'goerli',

  100: 'xdai',
  30: 'orchid',
  31: 'orchidTestnet',
  99: 'core',
  77: 'sokol',
  61: 'classic',
  8: 'ubiq',
  108: 'thundercore',
  18: 'thundercoreTestnet',
  163: 'lightstreams',
  122: 'fuse',
  15001: 'maticTestnet'
}


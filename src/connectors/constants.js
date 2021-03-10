import {
    walletConnect,
    injected,
    portis,
    walletlink,
    fortmatic
} from "@/connectors/index"

export const SUPPORTED_WALLETS = {
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D'
    },
    WALLET_CONNECT: {
        connector: walletConnect,
        name: 'WalletConnect',
        iconName: 'walletConnectIcon.svg',
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
    },
    WALLET_LINK: {
        connector: walletlink,
        name: 'Coinbase Wallet',
        iconName: 'coinbaseWalletIcon.svg',
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5'
    },
    // LATTICE: {
    //     connector: lattice,
    //     name: 'Lattice',
    //     iconName: 'gridPlusWallet.png',
    //     description: 'Connect to GridPlus Wallet.',
    //     href: null,
    //     color: '#315CF5',
    // },
    FORMATIC: {
        connector: fortmatic,
        name: 'Fortmatic',
        iconName: 'fortmaticIcon.png',
        description: 'Login using Fortmatic hosted wallet',
        href: null,
        color: '#6748FF',
    },
    PORTIS: {
        connector: portis,
        name: 'Portis',
        iconName: 'portisIcon.png',
        description: 'Login using Portis hosted wallet',
        href: null,
        color: '#4A6C9B',
    }
}

import AbstractConnector from "@/connectors/abstract-connector";
import {CHAIN_ID_ETHEREUM_MAINNET} from "@/constants/ChainIds";

const CHAIN_ID = CHAIN_ID_ETHEREUM_MAINNET

// const __DEV__ = !window.appIsInProductionMode;

export default class WalletLinkConnector extends AbstractConnector {

    constructor({url, appName, appLogoUrl, darkMode}) {
        super({supportedChainIds: CHAIN_ID})

        this.url = url
        this.appName = appName;
        this.appLogoUrl = appLogoUrl
        this.darkMode = darkMode || false
        this.name = 'WalletLink';
        // this.handleChainChanged = this.handleChainChanged.bind(this)
        // this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
        // this.handleDisconnect = this.handleDisconnect.bind(this)
    }
    //
    // handleChainChanged(chainId) {
    //     if (__DEV__) {
    //         console.log("Handling 'chainChanged' event with payload", chainId)
    //     }
    //     this.emitUpdate({chainId})
    // }
    //
    // handleAccountsChanged(accounts) {
    //     if (__DEV__) {
    //         console.log("Handling 'accountsChanged' event with payload", accounts)
    //     }
    //     this.emitUpdate({account: accounts[0]})
    // }
    //
    // handleDisconnect() {
    //     if (__DEV__) {
    //         console.log("Handling 'disconnect' event")
    //     }
    //     this.emitDeactivate()
    //     // we have to do this because of a @walletconnect/web3-provider bug
    //     if (this.walletConnectProvider) {
    //         this.walletConnectProvider.stop()
    //         this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
    //         this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
    //         this.walletConnectProvider = undefined
    //     }
    //
    //     this.emitDeactivate()
    // }

    async activate() {
        if (!this.walletLink) {
            const WalletLink = await import('walletlink').then(m => m?.default ?? m)
            this.walletLink = new WalletLink({
                appName: this.appName,
                darkMode: this.darkMode,
                ...(this.appLogoUrl ? {appLogoUrl: this.appLogoUrl} : {})
            })
            this.provider = this.walletLink.makeWeb3Provider(this.url, CHAIN_ID)
        }

        const account = await this.provider.send('eth_requestAccounts').then((accounts) => accounts[0])

        return {provider: this.provider, chainId: CHAIN_ID, account: account}
    }

    async getProvider() {
        return this.provider
    }

    async getChainId() {
        return CHAIN_ID
    }

    async getAccount() {
        return this.provider.send('eth_accounts').then((accounts) => accounts[0])
    }

    deactivate() {
    }

    async close() {
        this.provider.close()
        this.emitDeactivate()
    }
}

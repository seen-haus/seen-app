import AbstractConnector from "@/connectors/abstract-connector";
import {isProduction} from "@/connectors/mode";

export const URI_AVAILABLE = 'URI_AVAILABLE'

export class UserRejectedRequestError extends Error {
    constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'The user rejected the request.'
    }
}

const __DEV__ = !isProduction;

export default class WalletConnectConnector extends AbstractConnector {

    constructor({rpc, bridge, qrcode, pollingInterval, options}) {
        if (Object.keys(rpc).length === 1) {
            new Error('@walletconnect/web3-provider is broken with >1 chainId, please use 1');
        }

        super({supportedChainIds: Object.keys(rpc).map(k => Number(k))})

        this.rpc = rpc
        this.bridge = bridge
        this.qrcode = qrcode
        this.options = options;
        this.pollingInterval = pollingInterval
        this.name = 'WalletConnect';
        this.handleChainChanged = this.handleChainChanged.bind(this)
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
        this.handleDisconnect = this.handleDisconnect.bind(this)
    }

    handleChainChanged(chainId) {
        if (__DEV__) {
            console.log("Handling 'chainChanged' event with payload", chainId)
        }
        this.emitUpdate({chainId})
    }

    handleAccountsChanged(accounts) {
        if (__DEV__) {
            console.log("Handling 'accountsChanged' event with payload", accounts)
        }
        this.emitUpdate({account: accounts[0]})
    }

    handleDisconnect() {
        if (__DEV__) {
            console.log("Handling 'disconnect' event")
        }
        this.emitDeactivate()
        // we have to do this because of a @walletconnect/web3-provider bug
        if (this.walletConnectProvider) {
            this.walletConnectProvider.stop()
            this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
            this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
            this.walletConnectProvider = undefined
        }

        this.emitDeactivate()
    }

    async activate() {
        if (!this.walletConnectProvider) {
            const WalletConnectProvider = await import('@walletconnect/web3-provider').then(m => m?.default ?? m)
            this.walletConnectProvider = new WalletConnectProvider({
                bridge: this.bridge,
                rpc: this.rpc,
                qrcode: this.qrcode,
                // pollingInterval: this.pollingInterval,
            })
        }

        // ensure that the uri is going to be available, and emit an event if there's a new uri
        if (!this.walletConnectProvider.wc.connected) {
            await this.walletConnectProvider.wc.createSession({chainId: Number(Object.keys(this.rpc)[0])})
            this.emit(URI_AVAILABLE, this.walletConnectProvider.wc.uri)
        }

        const account = await this.walletConnectProvider
            .enable()
            .then((accounts) => accounts[0])
            .catch((error) => {
                this.walletConnectProvider = null;
                // TODO ideally this would be a better check
                if (error.message === 'User closed modal') {
                    throw new UserRejectedRequestError()
                }

                throw error
            })

        this.walletConnectProvider.on('disconnect', this.handleDisconnect)
        this.walletConnectProvider.on('chainChanged', this.handleChainChanged)
        this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)

        return {provider: this.walletConnectProvider, account}
    }

    async getProvider() {
        return this.walletConnectProvider
    }

    async getChainId() {
        return this.walletConnectProvider.send('eth_chainId')
    }

    async getAccount() {
        return this.walletConnectProvider.send('eth_accounts').then((accounts) => accounts[0])
    }

    deactivate() {
        if (this.walletConnectProvider) {
            this.walletConnectProvider.stop()
            this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect)
            this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
            this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
        }
    }

    async close() {
        await this.walletConnectProvider?.close()
    }
}

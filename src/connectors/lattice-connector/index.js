import AbstractConnector from "@/connectors/abstract-connector"
import Web3ProviderEngine from 'web3-provider-engine'
import {LatticeSubprovider} from '@0x/subproviders/lib/src/subproviders/lattice'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache.js'
import {RPCSubprovider} from '@0x/subproviders/lib/src/subproviders/rpc_subprovider'

export default class LatticeConnector extends AbstractConnector {

    constructor({chainId, url, pollingInterval, requestTimeoutMs, appName}) {
        super({supportedChainIds: chainId})

        this.chainId = chainId
        this.url = url
        this.pollingInterval = pollingInterval
        this.requestTimeoutMs = requestTimeoutMs
        this.appName = appName
        this.name = 'Lattice';
        // this.handleChainChanged = this.handleChainChanged.bind(this)
        // this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
        // this.handleDisconnect = this.handleDisconnect.bind(this)
    }

    async activate() {
        if (!this.provider) {
            const LatticeKeyring = await import('eth-lattice-keyring').then(m => m?.default ?? m)
            const engine = new Web3ProviderEngine({pollingInterval: this.pollingInterval})
            const opts = {
                appName: this.appName,
                latticeConnectClient: LatticeKeyring,
                networkId: this.chainId
            }
            engine.addProvider(new LatticeSubprovider(opts))
            engine.addProvider(new CacheSubprovider())
            engine.addProvider(new RPCSubprovider(this.url, this.requestTimeoutMs))
            this.provider = engine
        }

        this.provider.start()

        return {provider: this.provider, chainId: this.chainId}
    }

    async getProvider() {
        return this.provider
    }

    async getChainId() {
        return this.chainId
    }

    async getAccount() {
        return this.provider._providers[0].getAccountsAsync(1).then((accounts) => accounts[0])
    }

    deactivate() {
        this.provider.stop()
    }

    async close() {
        this.emitDeactivate()
        // Due to limitations in the LatticeSubprovider API, we use this code with `getAccounts`
        // as a hack to allow us to close out the connection and forget data.
        // It will get handled in `eth-lattice-keyring`, which will forget the device and return
        // an empty array (whose first element will be null/undefined)
        const CLOSE_CODE = -1000
        // this.deactivate()
        return this.provider._providers[0].getAccountsAsync(CLOSE_CODE).then((accounts) => accounts[0])
    }
}

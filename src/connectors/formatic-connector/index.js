import AbstractConnector from "@/connectors/abstract-connector"
import invariant from 'tiny-invariant'
import {CHAIN_ID_TO_NETWORK, CHAIN_ID_ETHEREUM_MAINNET, CHAIN_ID_ETHEREUM_RINKEBY} from "@/constants/ChainIds";

export default class FormaticConnector extends AbstractConnector {

    constructor({apiKey, chainId}) {
        invariant(Object.keys(CHAIN_ID_TO_NETWORK).includes(chainId.toString()), `Unsupported chainId ${chainId}`)
        super({supportedChainIds: [chainId]})
        this.name = 'Fortmatic';
        this.apiKey = apiKey
        this.chainId = chainId
    }

    async activate() {
        if (!this.fortmatic) {
            const Fortmatic = await import('fortmatic').then(m => m?.default ?? m)
            this.fortmatic = new Fortmatic(
                this.apiKey,
                this.chainId === CHAIN_ID_ETHEREUM_MAINNET || this.chainId === CHAIN_ID_ETHEREUM_RINKEBY ? undefined : CHAIN_ID_TO_NETWORK[this.chainId]
            )
        }

        const account = await this.fortmatic
            .getProvider()
            .enable()
            .then((accounts) => accounts[0])

        return {provider: this.fortmatic.getProvider(), chainId: this.chainId, account}
    }

    async getProvider() {
        return this.fortmatic.getProvider()
    }

    async getChainId() {
        return this.chainId
    }

    async getAccount() {
        return this.fortmatic
            .getProvider()
            .send('eth_accounts')
            .then((accounts) => accounts[0])
    }

    deactivate() {
    }

    async close() {
        await this.fortmatic.user.logout()
        this.emitDeactivate()
    }
}

import AbstractConnector from "@/connectors/abstract-connector";
import invariant from 'tiny-invariant';
import {isProduction} from "@/connectors/mode";
import {CHAIN_ID_TO_NETWORK} from "@/constants/ChainIds";

const __DEV__ = !isProduction;

export default class PortisConnector extends AbstractConnector {

    constructor({dAppId, networks, config = {}}) {
        const chainIds = networks.map((n) => (typeof n === 'number' ? n : Number(n.chainId)))
        super({supportedChainIds: chainIds})
        invariant(
            chainIds.every((c) => !!CHAIN_ID_TO_NETWORK[c]),
            `One or more unsupported networks ${networks}`
        )

        this.dAppId = dAppId
        this.networks = networks
        this.config = config
        this.name = 'Portis';

        this.handleOnLogout = this.handleOnLogout.bind(this)
        this.handleOnActiveWalletChanged = this.handleOnActiveWalletChanged.bind(this)
        this.handleOnError = this.handleOnError.bind(this)
    }

    handleOnLogout() {
        if (__DEV__) {
            console.log("Handling 'onLogout' event")
        }
        this.emitDeactivate()
    }

    handleOnActiveWalletChanged(account) {
        if (__DEV__) {
            console.log("Handling 'onActiveWalletChanged' event with payload", account)
        }
        this.emitUpdate({account})
    }

    handleOnError(error) {
        if (__DEV__) {
            console.log("Handling 'onError' event")
        }
        this.emitError(error)
    }

    async activate() {
        if (!this.portis) {
            const Portis = await import('@portis/web3').then(m => m?.default ?? m)
            this.portis = new Portis(
                this.dAppId,
                typeof this.networks[0] === 'number' ? CHAIN_ID_TO_NETWORK[this.networks[0]] : (this.networks[0]),
                this.config
            )
        }

        this.portis.onLogout(this.handleOnLogout)
        this.portis.onActiveWalletChanged(this.handleOnActiveWalletChanged)
        this.portis.onError(this.handleOnError)

        const account = await this.portis.provider.enable().then((accounts) => accounts[0])

        return {provider: this.portis.provider, account}
    }

    async getProvider() {
        return this.portis.provider
    }

    async getChainId() {
        return this.portis.provider.send('eth_chainId')
    }

    async getAccount() {
        return this.portis.provider.send('eth_accounts').then((accounts) => accounts[0])
    }

    deactivate() {
        this.portis.onLogout(() => {})
        this.portis.onActiveWalletChanged(() => {})
        this.portis.onError(() => {})
    }

    async changeNetwork(newNetwork, isGasRelayEnabled) {
        if (typeof newNetwork === 'number') {
            invariant(!!CHAIN_ID_TO_NETWORK[newNetwork], `Invalid chainId ${newNetwork}`)
            this.portis.changeNetwork(CHAIN_ID_TO_NETWORK[newNetwork], isGasRelayEnabled)
            this.emitUpdate({chainId: newNetwork})
        } else {
            this.portis.changeNetwork(newNetwork, isGasRelayEnabled)
            this.emitUpdate({chainId: Number(newNetwork.chainId)})
        }
    }

    async close() {
        await this.portis.logout()
        this.emitDeactivate()
    }
}

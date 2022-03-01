
import AbstractConnector from "@/connectors/abstract-connector";
import {isProduction} from "@/connectors/mode";

function parseSendReturn(sendReturn) {
    // eslint-disable-next-line no-prototype-builtins
    return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
    constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'No Ethereum provider was found on window.ethereum.'
    }
}

export class UserRejectedRequestError extends Error {
    constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'The user rejected the request.'
    }
}
const __DEV__ = !isProduction;

export default class InjectedConnector extends AbstractConnector {
    constructor(kwargs) {
        super(kwargs)
        this.name = 'MetaMask';
        this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
        this.handleChainChanged = this.handleChainChanged.bind(this)
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.getChainId = this.getChainId.bind(this);
    }

    handleChainChanged(chainId) {
        if (__DEV__) {
            console.log("Handling 'chainChanged' event with payload", chainId)
        }
        this.emitUpdate({chainId, provider: window.ethereum})
    }

    handleAccountsChanged(accounts) {
        if (__DEV__) {
            console.log("Handling 'accountsChanged' event with payload", accounts)
        }
        if (accounts.length === 0) {
            this.emitDeactivate()
        } else {
            this.emitUpdate({account: accounts[0]})
        }
    }

    handleClose(code, reason) {
        if (__DEV__) {
            console.log("Handling 'close' event with payload", code, reason)
        }
        this.emitDeactivate()
    }

    handleNetworkChanged(networkId) {
        if (__DEV__) {
            console.log("Handling 'networkChanged' event with payload", networkId)
        }
        this.emitUpdate({chainId: networkId, provider: window.ethereum})
    }

    async activate() {
        if (!window.ethereum) {
            throw new NoEthereumProviderError()
        }

        if (window.ethereum.on) {
            window.ethereum.on('chainChanged', this.handleChainChanged)
            window.ethereum.on('accountsChanged', this.handleAccountsChanged)
            window.ethereum.on('close', this.handleClose)
            window.ethereum.on('networkChanged', this.handleNetworkChanged)
        }

        if ((window.ethereum).isMetaMask) {
            (window.ethereum).autoRefreshOnNetworkChange = false
        }

        // try to activate + get account via eth_requestAccounts
        let account
        try {
            account = await (window.ethereum.send)('eth_requestAccounts').then(
                sendReturn => parseSendReturn(sendReturn)[0]
            )
        } catch (error) {
            if ((error).code === 4001) {
                throw new UserRejectedRequestError()
            }
            // warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
        }

        // if unsuccessful, try enable
        if (!account) {
            // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
            account = await window.ethereum.enable().then(sendReturn => sendReturn && parseSendReturn(sendReturn)[0])
        }

        return {provider: window.ethereum, ...(account ? {account} : {})}
    }

    async getProvider() {
        return window.ethereum
    }

    async getChainId() {
        if (!window.ethereum) {
            throw new NoEthereumProviderError()
        }

        let chainId
        try {
            chainId = await (window.ethereum.send)('eth_chainId').then(parseSendReturn)
        } catch {
            // warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
        }

        if (!chainId) {
            try {
                chainId = await (window.ethereum.send)('net_version').then(parseSendReturn)
            } catch {
                // warning(false, 'net_version was unsuccessful, falling back to net version v2')
            }
        }

        if (!chainId) {
            try {
                chainId = parseSendReturn((window.ethereum.send)({method: 'net_version'})
                )
            } catch {
                // warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
            }
        }

        if (!chainId) {
            if ((window.ethereum).isDapper) {
                chainId = parseSendReturn((window.ethereum).cachedResults.net_version)
            } else {
                chainId =
                    (window.ethereum).chainId ||
                    (window.ethereum).netVersion ||
                    (window.ethereum).networkVersion ||
                    (window.ethereum)._chainId
            }
        }

        return chainId
    }

    async getAccount() {
        if (!window.ethereum) {
            throw new NoEthereumProviderError()
        }

        let account
        try {
            account = await (window.ethereum.send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
        } catch {
            // warning(false, 'eth_accounts was unsuccessful, falling back to enable')
        }

        if (!account) {
            try {
                account = await window.ethereum.enable().then(sendReturn => parseSendReturn(sendReturn)[0])
            } catch {
                // warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
            }
        }

        if (!account) {
            account = parseSendReturn((window.ethereum.send)({method: 'eth_accounts'}))[0]
        }

        return account
    }

    deactivate() {
        if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener('chainChanged', this.handleChainChanged)
            window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
            window.ethereum.removeListener('close', this.handleClose)
            window.ethereum.removeListener('networkChanged', this.handleNetworkChanged)
        }
    }

    async isAuthorized() {
        if (!window.ethereum) {
            return false
        }

        try {
            return await (window.ethereum.send)('eth_accounts').then(sendReturn => {
                if (parseSendReturn(sendReturn).length > 0) {
                    return true
                } else {
                    return false
                }
            })
        } catch {
            return false
        }
    }
}

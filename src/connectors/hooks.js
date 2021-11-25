import Web3Connector from './connector'
import {toRefs} from 'vue'

export default function useWeb3() {
    const {
        provider,
        chainId,
        account,
        error,
        connector,
        connecting,
    } = toRefs(Web3Connector.state);
    return {
        activate: Web3Connector.activate,
        deactivate: Web3Connector.deactivate,
        eagerConnect: Web3Connector.eagerConnect,
        connector,
        provider,
        chainId,
        error,
        account,
        connecting,
    }
}

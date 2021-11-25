import {
    injected,
} from "@/connectors/index"
import {reactive} from 'vue'
import {ConnectorEvent} from "./types"
import {SUPPORTED_WALLETS} from "./constants"
import {DEFAULT_CHAIN_ID} from "@/constants/ChainIds";


const state = reactive({
    connector: null,
    provider: null,
    chainId: null,
    account: null,
    onError: null,
    error: null,
    connecting: null
})

const handleError = (payload) => {
    setError(payload.message ? payload.message : 'Error. Please refresh your page.')
    if (state.onError) {
        state.onError();
    }
}

// const setNetworkLibrary = () => {
//   state.library = state.provider ? new Web3Provider(state.provider) : new WebSocketProvider(process.env.VUE_APP_NETWORK_URL)
// }

const handleUpdate = (payload) => {
    update(payload);
}

const handleDeactivate = () => {
    deactivate();
}

const activate = async (connector) => {
    setError(null);
    state.connecting = connector
    const result = await connector.activate()
        .catch(e => {
            state.error = e.message
            return false
        })

    if (!result) {
        return
    }

    state.provider = result.provider
    state.chainId = result.provider.chainId
    connector.on(ConnectorEvent.Deactivate, handleDeactivate)
    connector.on(ConnectorEvent.Error, handleError)
    connector.on(ConnectorEvent.Update, handleUpdate)
    state.connector = connector
    state.account = result.account
    state.connecting = null
    console.log(state.provider)

}
const deactivate = () => {
    if (state.connector) {
        state.connector.removeListener(ConnectorEvent.Deactivate, handleDeactivate)
        state.connector.removeListener(ConnectorEvent.Error, handleError)
        state.connector.removeListener(ConnectorEvent.Update, handleUpdate)
        state.connector.deactivate()
        state.connector = null
    }
    state.account = null
    state.provider = null
    state.connecting = null

}

const setError = (error) => {
    state.error = error;
}
const update = (payload) => {
    if(payload.account) {
        state.account = payload.account
    }
    if(payload.provider) {
        state.provider = payload.provider
    }
    if(payload.chainId) {
        state.chainId = payload.chainId
    }
}


const eagerConnect = () => {
    injected
        .isAuthorized()
        .then(async (isAuthorized) => {
            if (isAuthorized) {
                let chainId = await injected.getChainId();
                // Only autoconnect to wallet if it is on the default network
                if(chainId && Number(chainId) === DEFAULT_CHAIN_ID) {
                    activate(SUPPORTED_WALLETS.METAMASK.connector)
                }
            }
        });
}


export default {
    state,
    activate,
    deactivate,
    eagerConnect
}

import {
    injected,
} from "@/connectors/index"
import {reactive} from 'vue'
import {ConnectorEvent} from "./types"
import {SUPPORTED_WALLETS} from "./constants"



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
    state.account = payload.account
    state.provider = payload.provider
}


const eagerConnect = () => {
    injected
        .isAuthorized()
        .then(isAuthorized => {
            if (isAuthorized) {
                activate(SUPPORTED_WALLETS.METAMASK.connector)
            }
        });
}


export default {
    state,
    activate,
    deactivate,
    eagerConnect
}

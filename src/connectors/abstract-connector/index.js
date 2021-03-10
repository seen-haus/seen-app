import {ConnectorEvent} from '@/connectors/types';
import { EventEmitter } from 'events';

const __DEV__ = !window.appIsInProductionMode;

export default class AbstractConnector extends EventEmitter {

    constructor({supportedChainIds} = {}) {
        super()
        this.supportedChainIds = supportedChainIds
    }

    // async activate()
    // async getProvider()
    // async getChainId()
    // async getAccount()
    // deactivate()

    emitUpdate(update) {
        if (__DEV__) {
            console.log(`Emitting '${ConnectorEvent.Update}' with payload`, update)
        }
        this.emit(ConnectorEvent.Update, update)
    }

    emitError(error) {
        if (__DEV__) {
            console.log(`Emitting '${ConnectorEvent.Error}' with payload`, error)
        }
        this.emit(ConnectorEvent.Error, error)
    }

    emitDeactivate() {
        if (__DEV__) {
            console.log(`Emitting '${ConnectorEvent.Deactivate}'`)
        }
        this.emit(ConnectorEvent.Deactivate)
    }
}

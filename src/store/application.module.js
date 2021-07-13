import {ExchangeRateService} from "@/services/apiService";

const state = {
    openModal: null,
    mobileMenu: null,
    currencies: null,
    darkMode: false,
    balance: {
        eth: null,
        seen: null,
        xSeen: null,
        xSeenTotalSupply: null,
        xSeenTotalSeenBalance: null,
        xSeenToSeenRatio: null,
    },
};

const mutations = {
    SET_OPEN_MODAL(state, modal) {
        state.openModal = modal
    },
    CLOSE_MODAL(state) {
        state.openModal = null
    },
    OPEN_MOBILE_MENU(state) {
        state.mobileMenu = true
    },
    CLOSE_MOBILE_MENU(state) {
        state.mobileMenu = false
    },
    SET_EXCHANGE_RATES(state, exchangeRates) {
        state.currencies = exchangeRates;
    },
    SET_BALANCE(state, balance) {
        state.balance = balance;
    },
    SET_DARK_MODE(state, status) {
        state.darkMode = status;
    }
};

const actions = {
    openModal(context, modal) {
        context.commit('SET_OPEN_MODAL', modal)
    },
    closeModal(context) {
        context.commit('CLOSE_MODAL')
    },
    async getExchangeRates(context) {
        ExchangeRateService.get()
            .then((data) => {
                context.commit('SET_EXCHANGE_RATES', {
                    seen: parseFloat(data.seen.usd, 10),
                    bitcoin: parseFloat(data.bitcoin.usd, 10),
                    ethereum: parseFloat(data.ethereum.usd, 10)
                })
            }).catch(e => {
            console.log("ERROR")
            context.commit('SET_EXCHANGE_RATES', {
                seen: parseFloat("1.0", 10),
                bitcoin: parseFloat("1.0", 10),
                ethereum: parseFloat("1.0", 10)
            });
            console.log(e)
        });
    },
    setBalance(context, balance) {
        context.commit('SET_BALANCE', balance);
    },
    setDarkMode(context, status) {
        context.commit('SET_DARK_MODE', status);
    }
};

const getters = {
    openModal(state) {
        return state.openModal
    },
    mobileMenu(state) {
        return state.mobileMenu
    },
    currencies(state) {
        return state.currencies;
    },
    balance(state) {
        return state.balance;
    },
    darkMode(state) {
        return state.darkMode;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

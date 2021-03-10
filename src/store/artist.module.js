const state = {
    openModal: null,
    mobileMenu: null,
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
    }
};

const actions = {
    openModal(context, modal) {
        context.commit('SET_OPEN_MODAL', modal)
    },
    closeModal(context) {
        context.commit('CLOSE_MODAL')
    }

}

const getters = {
    openModal(state) {
        return state.openModal
    },
    mobileMenu(state) {
        return state.mobileMenu
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

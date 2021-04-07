const state = {
    openModal: null,
    mobileMenu: null,
    user: null,
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
    SET_USER(state, user) {
        state.user = user
    },
};

const actions = {
    openModal(context, modal) {
        context.commit('SET_OPEN_MODAL', modal)
    },
    closeModal(context) {
        context.commit('CLOSE_MODAL')
    },
    setUser(context, user) {
        context.commit('SET_USER', user)
    },
    deleteUser(context) {
        context.commit('SET_USER', null)
    }

}

const getters = {
    openModal(state) {
        return state.openModal
    },
    mobileMenu(state) {
        return state.mobileMenu
    },
    user(state) {
        return state.user
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

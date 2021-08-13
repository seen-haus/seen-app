const state = {
    openModal: null,
    mobileMenu: null,
    user: null,
    userEmailPreferences: null,
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
    SET_USER_EMAIL_PREFERENCES(state, userEmailPreferences) {
        state.userEmailPreferences = userEmailPreferences
    }
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
    },
    setUserEmailPreferences(context, userEmailPreferences) {
        context.commit('SET_USER_EMAIL_PREFERENCES', userEmailPreferences)
    },
    deleteUserEmailPreferences(context) {
        context.commit('SET_USER_EMAIL_PREFERENCES', null)
    },
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
    },
    userEmailPreferences(state) {
        return state.userEmailPreferences
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

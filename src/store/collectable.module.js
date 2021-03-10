import {CollectablesService} from "@/services/apiService"

const state = {
    filter: {
      nft_tangible: true,
      nft: true,
    },
    pagination: {
        page: 1,
        perPage: 6,
    },
    collectables: [],
};

const mutations = {
    SET_COLLECTABLES(state, collectables) {
        state.collectables = collectables
    },
    SET_COLLECTABLE(state, item) {
        let indexOfItem = state.options
            .filter(x => x)
            .findIndex(collectable => collectable.id === item.id)

        if (indexOfItem >= 0) {
            state.collectables = state.collectables
                .filter((x, indexKey) => {
                    return indexKey !== indexOfItem;
                });
        }
        state.collectables.push(item)
    }
};

const actions = {
    setCollectables(context, pagination) {
        return new Promise((resolve, reject) => {
            CollectablesService.list(pagination)
                .then(({data}) => {
                    context.commit('SET_COLLECTABLES', data);
                    resolve(data);
                }).catch((e) => {
                reject(e);
            });
        });
    },

}

const getters = {
    collectables(state) {
        return state.collectables
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

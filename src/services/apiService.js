import {$axios} from './api/axios';

$axios.defaults.baseURL = `${process.env.VUE_APP_API_URL}/`;
export const ApiService = {

    query(resource, params) {
        return $axios.get(resource, {params}).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    get(resource, slug = "") {
        return $axios.get(`${resource}/${slug}`).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },

    post(resource, params, config = null) {
        return $axios.post(`${resource}`, params, config);
    },

    update(resource, slug, params) {
        return $axios.put(`${resource}/${slug}`, params);
    },

    put(resource, params) {
        return $axios.put(`${resource}`, params);
    },

    delete(resource) {
        return $axios.delete(resource).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    }
};

export const UserService = {
    create(payload) {
        return ApiService.post('users/' + payload.wallet, payload);
    },
    getAccount(walletAddress, payload) {
        return ApiService.post(`users/${walletAddress}/account`, payload);
    },
    saveAccount(walletAddress, payload) {
        return ApiService.put(`users/${walletAddress}/account`, payload);
    },
    get(walletAddress) {
        return ApiService.get('users/' + walletAddress);
    },
    update(walletAddress, payload) {
        return ApiService.put('users/' + walletAddress, payload);
    },
};

export const LeaderboardService = {
    get() {
        return ApiService.get('leaderboard');
    },
};

export const CollectablesService = {
    list(pagination = {perPage: 6, page: 1}, filter = {}) {
        // serializeđ
        return ApiService.query('collectables', {...pagination, ...filter});
    },
    show(contractAddress) {
        return ApiService.get(`collectables/${contractAddress}`);
    },
    winner(contractAddress, payload) {
        return ApiService.post(`collectables/${contractAddress}/winner`, payload);
    },
};

export const SpotlightService = {
    submit(payload) {
        return ApiService.post('spotlight', payload);
    },
};

export const ArtistService = {
    list(pagination = {perPage: 6, page: 1}) {
        // serializeđ
        return ApiService.query('artists', pagination);
    },
    show(id) {
        return ApiService.get(`artists/${id}`);
    }
};

export const ExchangeRateService = {
    get() {
        return $axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbitcoin%2Cseen&vs_currencies=USD').catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    }
};

export const OpenSeaAPIService = {
    getProfileEntries(owner) {
        const url = `https://api.opensea.io/api/v1/assets?owner=${owner}&collection=seen-haus`;
        return $axios.get(url);
    }
}
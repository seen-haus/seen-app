import {$axios} from './api/axios';

import { useV3NftContract } from '@/hooks/useContract.js';
import { useOpenSeaBaseAPI, useOpenSeaCollectionV3 } from '@/constants';

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
    getEmailAddressAndPreferences(walletAddress, payload) {
        return ApiService.post(`users/${walletAddress}/get-email-address-and-preferences/`, payload);
    },
    updateEmailAddressAndPreferences(walletAddress, payload) {
        return ApiService.post(`users/${walletAddress}/update-email-address-and-preferences/`, payload);
    },
    deleteEmailAddress(walletAddress, payload) {
        return ApiService.post(`users/${walletAddress}/delete-email-address/`, payload);
    },
    getExtendedUserData(payload) {
        return ApiService.post(`users/usernames/`, payload);
    },
    avatar(payload) {
        return ApiService.post(`users/avatars/`, payload);
    },
    banner(payload) {
        return ApiService.post(`users/banners/`, payload);
    },
};

export const LeaderboardService = {
    get() {
        return ApiService.get('leaderboard');
    },
};

export const CollectablesService = {
    list(pagination = {perPage: 6, page: 1}, filter = {}) {
        // serialize
        return ApiService.query('collectables', {...pagination, ...filter});
    },
    hero() {
        return ApiService.query('hero');
    },
    show(slug) {
        return ApiService.get(`collectables/${slug}`);
    },
    showSecondary(slug) {
        return ApiService.get(`collectables/secondary/${slug}`);
    },
    winner(contractAddress, payload) {
        return ApiService.post(`collectables/${contractAddress}/winner`, payload);
    },
    publishConsignmentByConsignmentId(consignmentId) {
        return ApiService.post(`/collectables/publish-consignment`, {consignment_id: consignmentId});
    },
};

export const BidRegistrationService = {
    isRegistered(walletAddress, collectableId) {
        return ApiService.get(`bid-registration-status/${walletAddress}/${collectableId}`);
    },
    register(payload) {
        return ApiService.post(`bid-registration`, payload);
    }
};

export const ClaimsService = {
    show(contractAddress) {
        return ApiService.get(`claims/${contractAddress}`);
    },
    claim(contractAddress, payload) {
        return ApiService.post(`claims/${contractAddress}/claim`, payload);
    }
}

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
    show(slug) {
        return ApiService.get(`artists/${slug}`);
    },
    requestAccessToSelfCreate(payload) {
        return ApiService.post(`artists/self-create/requests`, payload);
    },
};

export const ExchangeRateService = {
    get() {
        return $axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbitcoin%2Cseen&vs_currencies=USD').catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },
    getEthExchangeRate() {
        return $axios.get(`https://api.coinpaprika.com/v1/tickers/eth-ethereum/historical?start=${parseInt(Date.now() / 1000) - 1100000}&limit=1&quote=usd&interval=5m`)
            .catch(error => {
                throw new Error(`[RWV] ApiService ${error}`);
            });
    }
};

export const IPFSService = {
    get(hash) {
        return $axios.get(`https://cloudflare-ipfs.com/ipfs/${hash}`).catch(error => {
            throw new Error(`[RWV] ApiService ${error}`);
        });
    },
    pinFile(payload, onProgressPercentCallback = false, fullFileSize = false) {
        return ApiService.post(`ipfs/pin/file/`, payload, onProgressPercentCallback && fullFileSize && {
            onUploadProgress: progressEvent => {
                if(fullFileSize) {
                    let progressPercent = Math.floor(progressEvent.loaded * 100 / fullFileSize);
                    onProgressPercentCallback(progressPercent)
                }
            }
        });
    },
    pinJSON(payload) {
        return ApiService.post(`ipfs/pin/json/`, payload);
    },
};

export const OpenSeaAPIService = {
    async getProfileEntries(owner, limit = 6, offset = 0) {
        const url = `https://api.opensea.io/api/v1/assets?owner=${owner}&collection=seen-haus&limit=${limit}&offset=${offset}`;
        const data = await $axios.get(url);

        if (!data) return [];

        const assets = data.assets;

        if (!assets.length) {
            return [];
        }

        const tokenIds = assets.map(v => v.token_id);
        const collectables = await ApiService.post('collectables/map', {tokenIds});
        const mapped = [];

        assets.forEach(a => {
            const match = collectables.data.find(c => c.nft_token_id === a.token_id);
            if (match) {
                mapped.push({asGift: false, data: match});
            } else {
                // First token was not minted properly,  so exclude it
                if(!(a.token_id !== "1" && a.asset_contract.address !== '0x13bab10a88fc5f6c77b87878d71c9f1707d2688a')) {
                    mapped.push({asGift: true, data: a});
                }
            }
        });

        return mapped;
    },
    async getProfileEntriesV3(chainId, owner, limit = 6, offset = 0) {

        const openSeaBaseAPI = useOpenSeaBaseAPI(chainId);
        const openSeaCollections = useOpenSeaCollectionV3(chainId);

        let mayHaveMore = false;

        let groupedAssets = [];
        
        for(let openSeaCollection of openSeaCollections) {

            const url = `${openSeaBaseAPI}assets?owner=${owner}&collection=${openSeaCollection}&limit=${limit}&offset=${offset}`;
            const collectionData = await $axios.get(url);

            if(collectionData?.assets?.length > 0) {
                groupedAssets = [...groupedAssets, ...collectionData?.assets]
                if(collectionData.assets.length === limit) {
                    mayHaveMore = true;
                }
            }

        }

        const assets = groupedAssets;

        if (!assets.length) {
            return [[], false];
        }

        const tokenContractAddressesToIds = {};

        for(let asset of assets) {
            if(!tokenContractAddressesToIds[asset.asset_contract.address]) {
                tokenContractAddressesToIds[asset.asset_contract.address] = [asset.token_id];
            } else {
                tokenContractAddressesToIds[asset.asset_contract.address].push(asset.token_id);
            }
        }

        const collectables = await ApiService.post('collectables/mapWithTokenContractAddress', {tokenContractAddressesToIds});
        const mapped = [];

        let v3NftContract = await useV3NftContract(true);

        for(let asset of assets) {
            const match = collectables.data.find(c => {
                if(!Array.isArray(c.nft_token_id) && parseInt(c.nft_token_id) === parseInt(asset.token_id)) {
                    return true;
                } else if (Array.isArray(c.nft_token_id) && (c.nft_token_id.indexOf(parseInt(asset.token_id)) > -1)) {
                    return true;
                }
            });
            if (match) {
                let tokenBalance = await v3NftContract.balanceOf(owner, match.nft_token_id);
                mapped.push({
                    data: {
                        ...match,
                        balance: Number(tokenBalance),
                    },
                });
            }
        }

        // Remove duplicates that could arise from multiples being owned of a multitoken drop
        let consolidatedData = [];
        let idTracker = [];
        for(let item of mapped) {
            if(idTracker.indexOf(item.data.id) === -1) {
                consolidatedData.push(item);
                idTracker.push(item.data.id);
            }
        }

        return [consolidatedData, mayHaveMore];
    }
};

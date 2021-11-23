import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/home/Home.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/about/About.vue')
    },
    {
        path: '/faq',
        name: 'faq',
        component: () => import(/* webpackChunkName: "faq" */ '../views/faq/Faq.vue')
    },
    {
        path: '/drops/first-real-estate-nft',
        name: 'collectablePropyDrop',
        component: () => import(/* webpackChunkName: "collectablePropyDrop" */ '../views/collectable/propy/Collectable.vue')
    },
    {
        path: '/drops/v2/:slug',
        name: 'collectableDropV2',
        component: () => import(/* webpackChunkName: "collectableDropV2" */ '../views/collectable/Collectable.vue')
    },
    {
        path: '/drops/secondary/:slug',
        name: 'secondaryCollectableDropV3',
        component: () => import(/* webpackChunkName: "secondaryCollectableDropV3" */ '../views/collectable/v3/SecondaryCollectable.vue')
    },
    {
        path: '/drops/:slug',
        name: 'collectableDropV3',
        component: () => import(/* webpackChunkName: "collectableDropV3" */ '../views/collectable/v3/Collectable.vue')
    },
    {
        path: '/claims/:contractAddress',
        name: 'claims',
        component: () => import(/* webpackChunkName: "claims" */ '../views/claim/Claim.vue')
    },
    {
        path: '/drops',
        name: 'drops',
        component: () => import(/* webpackChunkName: "drops" */ '../views/drops/Drops.vue')
    },
    {
        path: '/auctions/:slug',
        name: 'collectableAuction',
        redirect: to => `/drops/${to.params.slug}`,
        component: () => import(/* webpackChunkName: "collectableAuction" */ '../views/collectable/Collectable.vue')
    },
    {
        path: '/creators/:artistSlug',
        name: 'artistProfile',
        component: () => import(/* webpackChunkName: "artistProfile" */ '../views/profile/ArtistProfile.vue')
    },
    {
        path: '/creators',
        name: 'artists',
        component: () => import(/* webpackChunkName: "artists" */ '../views/artists/Artists.vue')
    },
    {
        path: '/team',
        name: 'team',
        component: () => import(/* webpackChunkName: "team" */ '../views/team/Team.vue')
    },
    {
        path: '/editions/:slug',
        name: 'collectableEdition',
        redirect: to => `/drops/${to.params.slug}`,
        component: () => import(/* webpackChunkName: "collectableEdition" */ '../views/collectable/Collectable.vue')
    },
    {
        path: '/collectors',
        name: 'collectors',
        component: () => import(/* webpackChunkName: "collectors" */ '../views/leaderboard/Leaderboard.vue')
    },
    {
        path: '/profile/:userAddress',
        name: 'profileWithAddress',
        component: () => import(/* webpackChunkName: "profileWithAddress" */ '../views/profile/Profile.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '../views/profile/Profile.vue')
    },
    {
        path: '/spotlight',
        name: 'spotlight',
        component: () => import(/* webpackChunkName: "spotlight" */ '../views/spotlight/Spotlight.vue')
    },
    {
        path: '/stake',
        name: 'stake',
        component: () => import(/* webpackChunkName: "stake" */ '../views/stake/Stake.vue')
    },
    {
        path: '/space-nft',
        name: 'space-nft',
        component: () => import(/* webpackChunkName: "spaceNFT" */ '../views/massDrops/SpaceNFT.vue')
    },
    {
        path: '/create',
        name: 'create',
        component: () => import(/* webpackChunkName: "SelfCreateWithoutStep" */ '../views/selfCreate/SelfCreate.vue')
    },
    {
        path: '/create/:stepName/:consignmentId',
        name: 'selfCreateWithConsignmentId',
        component: () => import(/* webpackChunkName: "SelfCreate" */ '../views/selfCreate/SelfCreate.vue')
    },
    {
        path: '/create/:stepName',
        name: 'selfCreate',
        component: () => import(/* webpackChunkName: "SelfCreate" */ '../views/selfCreate/SelfCreate.vue')
    },
    {
        path: '/collection/:collectionName',
        name: 'collection',
        component: () => import(/* webpackChunkName: "collection" */ '../views/collection/Collection.vue')
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import(/* webpackChunkName: "notifications" */ '../views/notifications/Notifications.vue')
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: () => import(/* webpackChunkName: "privacy" */ '../views/privacy/Privacy.vue')
    },
]

const router = createRouter({
    scrollBehavior(navigationEvent) {
        if(navigationEvent?.name === 'selfCreate') {
            let currentScrollTop = document.body.scrollTop = document.documentElement.scrollTop;
            if(currentScrollTop > 240) {
                return { top: 240 }
            }
        }else{
            return {top: 0}
        }
    },
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

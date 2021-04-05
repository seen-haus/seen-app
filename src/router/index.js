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
        path: '/drops/:contractAddress',
        name: 'collectableDrops',
        component: () => import(/* webpackChunkName: "collectableDrops" */ '../views/collectable/Collectable.vue')
    },
    {
        path: '/drops',
        name: 'drops',
        component: () => import(/* webpackChunkName: "drops" */ '../views/drops/Drops.vue')
    },
    {
        path: '/auctions/:contractAddress',
        name: 'collectableAuction',
        redirect: to => `/drops/${to.params.contractAddress}`,
        component: () => import(/* webpackChunkName: "collectableAuction" */ '../views/collectable/Collectable.vue')
    },
    {
        path: '/artists/:artistSlug',
        name: 'artistProfile',
        component: () => import(/* webpackChunkName: "artistProfile" */ '../views/profile/ArtistProfile.vue')
    },
    {
        path: '/artists',
        name: 'artists',
        component: () => import(/* webpackChunkName: "artists" */ '../views/artists/Artists.vue')
    },
    {
        path: '/editions/:contractAddress',
        name: 'collectableEdition',
        redirect: to => `/drops/${to.params.contractAddress}`,
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
        component: () => import(/* webpackChunkName: "profile" */ '../views/profile/Profile.vue')
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
        path: '/spaaaaace',
        name: 'spaaaaace',
        component: () => import(/* webpackChunkName: "spaaaaace" */ '../views/spaaaaace/Spaaaaace.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

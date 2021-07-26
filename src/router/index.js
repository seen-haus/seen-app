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
        path: '/drops/:slug',
        name: 'collectableDrops',
        component: () => import(/* webpackChunkName: "collectableDrops" */ '../views/collectable/Collectable.vue')
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
        component: () => import(/* webpackChunkName: "Create" */ '../views/selfCreate/SelfCreate.vue')
    },
]

const router = createRouter({
    scrollBehavior() {
        return {top: 0}
    },
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

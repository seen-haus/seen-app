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
        path: '/auctions',
        name: 'auctions',
        component: () => import(/* webpackChunkName: "auctions" */ '../views/auctions/Auctions.vue')
    },
    {
        path: '/artists',
        name: 'artists',
        component: () => import(/* webpackChunkName: "artists" */ '../views/artists/Artists.vue')
    },
    {
        path: '/editions',
        name: 'editions',
        component: () => import(/* webpackChunkName: "editions" */ '../views/editions/Editions.vue')
    },
    {
        path: '/leaderboard',
        name: 'leaderboard',
        component: () => import(/* webpackChunkName: "leaderboard" */ '../views/leaderboard/Leaderboard.vue')
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
        component: () => import(/* webpackChunkName: "stake" */ '../views/spaaaaace/Spaaaaace.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

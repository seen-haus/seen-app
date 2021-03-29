import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/index.scss'
import PrimeVue from 'primevue/config';
import Dialog from "primevue/dialog";


createApp(App)
    .use(store)
    .use(router)
    .use(PrimeVue)
    .component("Dialog", Dialog)
    .mount('#app')

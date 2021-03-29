import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/index.scss'
import { defineRule } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import PrimeVue from 'primevue/config';
import Dialog from "primevue/dialog";

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

createApp(App)
    .use(store)
    .use(router)
    .use(PrimeVue)
    .component("Dialog", Dialog)
    .mount('#app')

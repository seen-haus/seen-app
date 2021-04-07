import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/index.scss';
import { defineRule } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import PrimeVue from 'primevue/config';
import Dialog from "primevue/dialog";
import { createMetaManager, defaultConfig, useMeta, deepestResolver } from 'vue-meta';

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css";

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

const metaManager = createMetaManager(defaultConfig, deepestResolver);

useMeta({}, metaManager);

createApp(App)
    .use(store)
    .use(router)
    .use(PrimeVue)
    .use(metaManager)
    .use(ToastService)
    .component("Toast", Toast)
    .component("Dialog", Dialog)
    .mount('#app');

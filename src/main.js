import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/index.scss';
import {defineRule} from 'vee-validate';
import {required, email, min} from '@vee-validate/rules';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import PrimeVue from 'primevue/config';
import Dialog from "primevue/dialog";
import {createMetaManager, defaultConfig, useMeta, deepestResolver} from 'vue-meta';
import VueGoogleMaps from '@fawmi/vue-google-maps'

import directives from "@/directives"
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css";

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
const metaManager = createMetaManager(defaultConfig, deepestResolver);

useMeta({}, metaManager);
const app = createApp(App)
directives(app);
app.use(store)
app.use(router)
app.use(PrimeVue)
app.use(metaManager)
app.use(ToastService)
app.use(VueGoogleMaps, {
    load: {
        key: process.env.VUE_APP_GOOGLE_MAPS_KEY
    },
})
app.component("Toast", Toast)
app.component("Dialog", Dialog)
app.mount('#app');

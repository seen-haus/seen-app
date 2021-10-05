import {createApp} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import Slider from 'primevue/slider';
import {defineRule} from 'vee-validate';
import {required, email, min, max, min_value, max_value, integer} from '@vee-validate/rules';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import PrimeVue from 'primevue/config';
import Dialog from "primevue/dialog";
import Chart from "primevue/chart";
import {createMetaManager, defaultConfig, useMeta, deepestResolver} from 'vue-meta';
import VueGoogleMaps from '@fawmi/vue-google-maps'

import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css";

import App from './App.vue';
import router from './router';
import store from './store';

import directives from "@/directives"

import './assets/scss/index.scss';

defineRule('required', required);
defineRule('email', email);
defineRule('integer', integer);
defineRule('min', min);
defineRule('max', max);
defineRule('min_value', min_value);
defineRule('max_value', max_value);
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
app.component("ProgressSpinner", ProgressSpinner)
app.component("Slider", Slider)
app.component("Toast", Toast)
app.component("Dialog", Dialog)
app.component("Chart", Chart)
app.mount('#app');

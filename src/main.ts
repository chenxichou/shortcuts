import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routers/router'
import './assets/main.css'

const _pinia = createPinia();
const head = createHead()

createApp(App)
    .use(_pinia)
    .use(router)
    .use(head)
    .mount('#app')

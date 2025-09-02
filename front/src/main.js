import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'


import vuetify from './plugins/vuetify'  // импорт объекта Vuetify

import '@mdi/font/css/materialdesignicons.css'  // обязательно

const app = createApp(App);

app.use(vuetify).use(router).mount('#app')

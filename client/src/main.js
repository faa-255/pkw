import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css'; //Tailwind CSS

const app = createApp(App);

app.use(createPinia()); //Pinia
app.use(router);        //Router

app.mount('#app');
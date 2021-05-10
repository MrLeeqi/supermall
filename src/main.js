import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

app.config.globalProperties.$bus = new mitt()

app.mount('#app')

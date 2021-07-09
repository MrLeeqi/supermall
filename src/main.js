import { createApp } from 'vue'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'

const app = createApp(App)
app.use(router)
app.use(store)
// 安装自定义插件toast
app.use(toast)

app.config.globalProperties.$bus = new mitt()

app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import mitt from 'mitt'
import FastClick from 'fastclick';

import toast from 'components/common/toast'

const app = createApp(App)
app.use(router)
app.use(store)

// 添加事件总线对象
app.config.globalProperties.$bus = new mitt()

// 安装自定义插件toast
app.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

app.mount('#app')

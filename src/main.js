import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import mitt from 'mitt'
import FastClick from 'fastclick'
import lazyPlugin from 'vue3-lazy'

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

// 使用图片懒加载的插件
app.use(lazyPlugin, {
  loading: require('./assets/img/common/placeholder.png')
})

app.mount('#app')

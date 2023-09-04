import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { registerMicroApps, start, initGlobalState } from 'qiankun'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const actions = initGlobalState({ msg: '状态初始化' })
actions.onGlobalStateChange((state, prev) => {
  console.log('base:', state, '←', prev)
})
// actions.setGlobalState({ msg: '基座改变状态' })
// actions.offGlobalStateChange()

registerMicroApps([
  {
    name: 'app0', // app name registered
    entry: '//localhost:5000',
    container: '#yourContainer',
    activeRule: '/app0'
  }
])

start()

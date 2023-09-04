import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import createRouter from './router'

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const qiankunEjected = qiankunWindow.__POWERED_BY_QIANKUN__

let app
function render(container) {
  app = createApp(App)
  app.use(createPinia())
  app.use(createRouter(qiankunEjected ? '/app0' : '/'))
  app.mount(container ? container.querySelector('#app') : '#app')
}
// eslint-disable-next-line no-undef
console.log(qiankunEjected, '子应用注入qiankun')
if (!qiankunEjected) {
  render()
} else {
  const initQianKun = () => {
    renderWithQiankun({
      // 当前应用在主应用中的生命周期
      // 文档 https://qiankun.umijs.org/zh/guide/getting-started#
      mount(props) {
        render(props.container) //  可以通过props读取主应用的参数：msg
        // 监听主应用传值
        props.onGlobalStateChange((state, prev) => {
          console.log('app0:', state, '←', prev)
        })
        props.setGlobalState({
          msg: '子应用改变状态'
        })
      },
      bootstrap() {},
      unmount() {},
      update: function (props) {
        console.log(props, 'update')
        throw new Error('Function not implemented.')
      }
    })
  }
  initQianKun()
}

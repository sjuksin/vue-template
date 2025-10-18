import './assets/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const app = createApp(App)

const pinia =  createPinia()
pinia.use(createPersistedStatePlugin({
  persist: false // По-умолчанию не сохраняем store
}))

app.use(pinia)
app.use(router)

app.mount('#app')

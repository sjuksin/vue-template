import './assets/main.scss'
import '@/helpers/setup-globals'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createLoader } from '@/helpers/loader'
import { preloadImages } from '@/helpers/preloadImages'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

try {
  const bar = document.getElementById('load-bar')!
  const loader = createLoader({ bar })
  loader.start()

  const imagesLoaded = preloadImages([], percent => loader.setRealProgress(percent))

  // Грузим всё, что нужно перед маунтом
  const promises: Promise<any>[] = [imagesLoaded]

  await Promise.all(promises)
  await loader.finish() // Добиваем прогресс до 100%

  app.use(router)
  app.mount('#app')

} catch (e) {
  let errMessage = 'Ошибка загрузки'
  if (e instanceof Error) errMessage += '<br>' + e.message

  const root = document.getElementById('app')
  if (root) root.innerHTML = errMessage

  console.error('Ошибка загрузки:', e)
}

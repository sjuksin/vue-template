import './assets/main.scss'
import '@/helpers/setup-globals'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createLoader } from '@/helpers/loader'
import { preloadImages } from '@/helpers/preloadImages'
import { useUiStore } from '@/stores/ui'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

useUiStore().init()

// Создаём загрузчик
const bar = document.getElementById('load-bar')!
const loader = createLoader({ bar })

try {
  loader.start()

  // Заранее подгружаем шрифт, если нужно
  // const fontsLoaded = document.fonts.load('16px Roboto')
  const imagesLoaded = preloadImages([], percent => loader.setRealProgress(percent))

  // Грузим всё, что нужно перед маунтом
  await Promise.all([imagesLoaded])
  await loader.finish() // Добиваем прогресс до 100%

  // Запускаем приложение
  // eruda.init()
  app.use(router)
  app.mount('#app')
} catch (e) {
  void loader.finish() // Завершаем лоадер

  let errMessage = 'Ошибка загрузки'
  if (e instanceof Error) errMessage += '<br>' + e.message

  const root = document.getElementById('app')
  if (root) root.innerHTML = errMessage

  console.error('Ошибка загрузки:', e)
}

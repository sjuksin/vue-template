/**
 * Предварительно загружает массив изображений в кэш браузера.
 *
 * Функция запускает параллельное скачивание всех переданных ссылок.
 * Она отслеживает прогресс выполнения и гарантирует успешное завершение
 * промиса даже в случае ошибок загрузки отдельных картинок.
 *
 * @param urls Массив URL-адресов изображений, которые нужно загрузить.
 * @param onProgress Необязательный колбэк, возвращающий текущий процент выполнения (0-100).
 * @returns Промис, который резолвится, когда все изображения загружены или завершились ошибкой.
 *
 * @example
 * const images = ['img1.png', 'img2.png'];
 * await preloadImages(images, (percent) => console.log(`Загружено: ${percent}%`));
 * console.log('Все картинки в кэше!');
 */
export async function preloadImages (
  urls: string[],
  onProgress?: (p: number) => void
): Promise<void> {
  let loaded = 0
  const total = urls.length

  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image()

        const done = () => {
          loaded++
          onProgress?.(Math.round((loaded / total) * 100))
          resolve()
        }

        img.onload = done
        img.onerror = () => {
          console.warn(`Не удалось загрузить изображение по адресу: ${url}`)
          done() // Всё равно вызываем done, чтобы не вешать лоадер
        }

        img.src = url
      })
    })
  ).then(() => {})
}

/** Настройки для инициализации загрузчик прогресс-бара. */
type LoaderOptions = {
  /** HTML-элемент шкалы индикатора, у которого будет меняться ширина (`width`). */
  bar: HTMLElement

  /** Задержка перед стартом анимации в миллисекундах, чтобы избежать мерцания на быстрых запросах. */
  delayMs?: number

  /** Максимальный процент (0-100), до которого лоадер может "доползти" в режиме ожидания (фейковый прогресс). */
  fakeTo?: number

  /** Шаг увеличения фейкового прогресса на каждой итерации таймера. */
  step?: number

  /** Интервал обновления анимации в миллисекундах. */
  intervalMs?: number
}

type Loader = {
  /** Запускает таймер отложенного старта и последующую анимацию прогресса. */
  start: () => void

  /** Устанавливает реальный текущий процент выполнения (например, при загрузке файлов). */
  setRealProgress: (p: number) => void

  /** Принудительно заполняет шкалу до 100%, завершает анимацию и возвращает промис по окончании отрисовки. */
  finish: () => Promise<void>
}

/**
 * Создаёт загрузчик (индикатор прогресса).
 *
 * Эмулирует плавный («фейковый») прогресс до лимита `fakeTo`, чтобы у пользователя
 * была иллюзия активной загрузки, пока реальные данные еще не получены.
 * Имеет встроенную задержку старта для предотвращения мерцания интерфейса на быстрых запросах.
 *
 * @param options Настройки конфигурации и целевой HTML-элемент.
 * @returns Объект управления методами загрузчика.
 *
 * @example
 * const loader = createLoader({ bar: document.getElementById('progress-bar') });
 * loader.start();
 * // ...какие-то асинхронные действия...
 * await loader.finish();
 */
export function createLoader(options: LoaderOptions): Loader {
  const {
    bar,
    delayMs = 300,
    fakeTo = 90,
    step = 0.3,
    intervalMs = 100,
  } = options

  let realProgress = 0
  let displayProgress = 0

  let interval: number | null = null
  let delayTimer: number | null = null
  let started = false
  let finished = false

  const start = () => {
    delayTimer = window.setTimeout(() => {
      if (finished) return

      started = true

      interval = window.setInterval(() => {
        if (displayProgress < realProgress) {
          displayProgress = realProgress
        } else if (displayProgress < fakeTo) {
          displayProgress += step
        }

        bar.style.width = displayProgress + '%'
      }, intervalMs)
    }, delayMs)
  }

  const setRealProgress = (p: number) => {
    realProgress = p
  }

  const finish = async () => {
    finished = true

    if (delayTimer) {
      clearTimeout(delayTimer)
    }

    // если loader так и не стартовал — просто выходим
    if (!started) {
      return
    }

    if (interval) {
      clearInterval(interval)
    }

    bar.style.width = '100%'

    await new Promise<void>((resolve) => {
      // даём браузеру реально отрисовать
      setTimeout(resolve, 100)
    })
  }

  return {
    start,
    setRealProgress,
    finish
  }
}

import { readonly, ref } from 'vue'
import { SOUNDS } from './sounds'

/** Плавность переключения тишины, секунды: мгновенный скачок громкости слышен щелчком */
const MUTE_RAMP = 0.02

const MUTED_KEY = 'audio-muted'

interface Sound {
  url: string
  volume: number

  /** Скачанный файл, пустой - если скачать не удалось. Лежит до разблокировки: раскодировать его не в чем */
  data: Promise<ArrayBuffer | undefined>

  /** Раскодированная запись. Пусто до разблокировки и у битого файла */
  buffer?: AudioBuffer
}

/** Адрес файла и громкость от 0 до 1, по умолчанию 1 */
export type SoundEntry = [url: string, volume?: number]

type SoundName = keyof typeof SOUNDS

let context: AudioContext | undefined

/**
 * Общая громкость. Через неё приложение замолкает, не переставая играть: иначе пришлось бы
 * помнить, что и с какого места возобновлять
 */
let masterGain: GainNode | undefined

/** Хранилище бывает недоступно, например в приватном режиме: тогда звук просто включён */
function readMuted (): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Тишина по кнопке. Помним и между запусками: звук выключают, например, в транспорте, и включённый сам собой
 * он застанет врасплох. Флаг отдельно от узлов: переключить могли до того, как создан контекст
 */
const muted = ref(readMuted())

/** Тишина для интерфейса, реактивная. Только для чтения: переключение мимо плавного перехода было бы слышно щелчком */
export const isMuted = readonly(muted)

/**
 * Звучащие прямо сейчас источники. Каждое проигрывание одноразовое, поэтому остановить
 * их можно только по списку
 */
let playing: AudioScheduledSourceNode[] = []

async function fetchData (url: string): Promise<ArrayBuffer | undefined> {
  try {
    const response = await fetch(url)
    return await response.arrayBuffer()
  } catch (error) {
    console.warn(`Звук не скачан: ${url}`, error)
    return undefined
  }
}

async function decode (sound: Sound, audioContext: AudioContext): Promise<void> {
  const data = await sound.data
  if (data === undefined) return

  try {
    // Копия нужна потому, что декодирование забирает исходный массив себе и опустошает его
    sound.buffer = await audioContext.decodeAudioData(data.slice(0))
  } catch (error) {
    console.warn(`Звук не раскодирован: ${sound.url}`, error)
  }
}

function createSound (url: string, volume = 1): Sound {
  // Качаем сразу, не дожидаясь разрешения: к моменту разблокировки файл уже будет в памяти
  return { url, volume, data: fetchData(url) }
}

const sounds = Object.fromEntries(
  Object.entries<SoundEntry>(SOUNDS).map(([name, entry]) => [name, createSound(...entry)]),
) as Record<SoundName, Sound>

const all: Sound[] = Object.values(sounds)

function createMasterGain (audioContext: AudioContext): GainNode {
  const gain = audioContext.createGain()
  gain.gain.value = muted.value ? 0 : 1
  gain.connect(audioContext.destination)
  return gain
}

/**
 * Вносит источник в звучащие, и общая остановка оборвёт его вместе с остальными.
 * Нужно каждому источнику, собранному вне движка
 */
export function trackSource (source: AudioScheduledSourceNode): void {
  source.onended = () => {
    playing = playing.filter(item => item !== source)
  }
  playing.push(source)
}

/** Контекст и общий выход для звуков, которые проект собирает сам, а не берёт из файла. Пусто до разблокировки */
export function getAudioOutput (): { context: AudioContext, output: GainNode } | undefined {
  if (context === undefined || masterGain === undefined) return undefined
  return { context, output: masterGain }
}

/**
 * Проигрывает запись через общую громкость и возвращает источник, чтобы проигрывание можно было оборвать.
 * До разблокировки ничего не играет и возвращает пустоту.
 * Каждое проигрывание получает свой источник: перематывать нечего, поэтому звук начинается
 * той же миллисекундой, а два подряд накладываются, а не обрывают друг друга
 */
export function startBuffer (buffer: AudioBuffer, volume: number, rate = 1): AudioBufferSourceNode | undefined {
  if (context === undefined || masterGain === undefined) return

  const source = context.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = rate

  const gain = context.createGain()
  gain.gain.value = volume

  source.connect(gain).connect(masterGain)
  source.start()
  trackSource(source)
  return source
}

function play (sound: Sound, rate = 1): void {
  if (sound.buffer) startBuffer(sound.buffer, sound.volume, rate)
}

/** До разблокировки и пока файл не раскодирован, молчит: вызов не ждёт и не откладывается */
export function playSound (name: SoundName, rate = 1): void {
  play(sounds[name], rate)
}

/**
 * Ждёт, пока скачаются все звуки. Скачивание стартует само при подключении модуля, функция его не запускает.
 * Не падает: файл, который не удалось скачать, считается готовым. Зависший запрос держит ожидание - таймаута нет
 */
export async function waitSoundsLoaded (): Promise<void> {
  await Promise.all(all.map(sound => sound.data))
}

/**
 * Снимает запрет браузера на воспроизведение. Без этого молчит всё, что приложение пытается
 * проиграть само, потому что касание экрана действием пользователя не считается - им считается только нажатие.
 *
 * Требования к месту вызова, оба обязательные:
 *  - из обработчика нажатия, иначе разрешения не будет вовсе;
 *  - первой строкой и синхронно, потому что разрешение живёт до конца обработчика,
 *    и любая тяжёлая работа перед вызовом успевает его потерять.
 *
 * Повторный вызов безвреден: он только будит контекст, если тот успел заснуть
 */
export function unlockAudio (): void {
  if (context !== undefined) {
    void context.resume()
    return
  }

  // iOS в беззвучном режиме глушит такой контекст, хотя элемент audio там звучит. Если звук нужен
  // и в беззвучном режиме: navigator.audioSession.type = 'playback' (iOS 16.4+)
  context = new AudioContext()
  void context.resume()

  masterGain = createMasterGain(context)

  for (const sound of all) {
    void decode(sound, context)
  }
}

/** Ставит весь звук на паузу: недоигранное продолжится с того же места */
export function suspendSounds (): void {
  void context?.suspend()
}

/** После сворачивания iOS может не разбудить контекст без нажатия: тогда звук вернёт ближайшая разблокировка */
export function resumeSounds (): void {
  void context?.resume()
}

function rampGain (gain: GainNode, value: number): void {
  const now = gain.context.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(value, now + MUTE_RAMP)
}

/**
 * Глушит или возвращает весь звук и запоминает выбор между запусками. Звук не останавливается, а уходит в ноль:
 * вернувшись, он звучит с текущего места, а не с начала
 */
export function setSoundsMuted (value: boolean): void {
  muted.value = value
  if (masterGain) rampGain(masterGain, value ? 0 : 1)

  try {
    localStorage.setItem(MUTED_KEY, String(value))
  } catch {
    // Без хранилища тишина просто не переживёт перезапуск
  }
}

export function stopSounds (): void {
  for (const source of playing) {
    source.stop()
  }

  playing = []
}

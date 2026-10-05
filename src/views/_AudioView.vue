<!-- Дев-страница: все звуки проекта с длительностью, чтобы послушать и выбрать -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getAudioOutput, isMuted, setSoundsMuted, type SoundEntry, startBuffer, unlockAudio } from '@/audio/core'
import { SOUNDS } from '@/audio/sounds'

// --------------- State -----------------------

interface SoundRow {
  name: string
  url: string

  /** Секунды. Пусто, пока файл не прочитан */
  duration?: number

  /** Громкость, с которой звук зарегистрирован. Пусто у кандидатов, которые не подключены */
  volume?: number
}

// Берём файлы из папки. Таким образом получаем все файлы, включая те, которые в приложении не подключены в SOUNDS
const files = import.meta.glob<string>('@/assets/audio/*.{mp3,ogg,m4a,wav}', {
  eager: true,
  import: 'default',
  query: '?url',
})

/** Громкость каждого звука приложения по адресу файла */
const volumes = new Map(Object.values<SoundEntry>(SOUNDS).map(([url, volume = 1]) => [url, volume]))

const rows = ref<SoundRow[]>(Object.entries(files)
  .map(([path, url]) => ({ name: path.split('/').pop()!.replace(/\.\w+$/, ''), url, volume: volumes.get(url) }))
  .sort((a, b) => a.name.localeCompare(b.name)))

/** Раскодированные файлы для прослушивания: среди них есть кандидаты, которых нет в списке приложения */
const buffers = new Map<string, Promise<AudioBuffer | undefined>>()

let current: AudioBufferSourceNode | undefined

// --------------- Handlers --------------------

/**
 * Проигрываем файл. Функция
 * Делаем это намеренно тем же способом, что и звуки приложения, т.е. через Web Audio, а не элемент audio,
 *  иначе возможны расхождения в звучании (например на Android)
 * Следующее прослушивание обрывает предыдущее, иначе при сравнении они накладываются.
 * Вызывать из обработчика нажатия, как и разблокировку звука
 */
async function play (row: SoundRow, volume = 1) {
  unlockAudio()
  const { context } = getAudioOutput()!

  let buffer = buffers.get(row.url)
  if (buffer === undefined) {
    buffer = fetch(row.url)
      .then(response => response.arrayBuffer())
      .then(data => context.decodeAudioData(data))
      .catch((error) => {
        console.warn(`Звук не раскодирован: ${row.url}`, error)
        return undefined
      })
    buffers.set(row.url, buffer)
  }

  const decoded = await buffer
  if (decoded === undefined) return

  current?.stop()
  current = startBuffer(decoded, volume)
}

// --------------- Lifecycle -------------------

onMounted(() => {
  // Длительность из раскодированной записи: метаданные элемента audio iOS может так и не отдать.
  // Офлайн-контексту разрешение на звук не нужно, поэтому длительности видны до первого нажатия
  const decoder = new OfflineAudioContext(1, 1, 44100)
  for (const row of rows.value) {
    fetch(row.url)
      .then(response => response.arrayBuffer())
      .then(data => decoder.decodeAudioData(data))
      .then((buffer) => { row.duration = buffer.duration })
      .catch(error => console.warn(`Длительность не прочитана: ${row.url}`, error))
  }
})
</script>

<template>
  <div class="audio">
    <button class="audio__play audio__mute" type="button" @click="setSoundsMuted(!isMuted)">
      {{ isMuted ? 'Звук выкл.' : 'Звук вкл.' }}
    </button>

    <table class="audio__table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Длит.</th>
          <th>Файл</th>
          <th>Громк.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td class="audio__name">{{ row.name }}</td>
          <td class="audio__duration">{{ row.duration ? `${row.duration.toFixed(2)} с` : '…' }}</td>
          <td><button class="audio__play" type="button" @click="play(row)">▶</button></td>
          <td>
            <button
                v-if="row.volume !== undefined"
                class="audio__play"
                type="button"
                @click="play(row, row.volume)"
            >
              ▶ {{ row.volume.toFixed(2) }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.audio {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #000;

  &__table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 8px 4px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
  }

  &__name {
    user-select: text;
  }

  &__duration {
    white-space: nowrap;
  }

  &__play {
    min-width: 36px;
    height: 36px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #f4f4f4;
    cursor: pointer;
    white-space: nowrap;
  }

  &__mute {
    margin-bottom: 8px;
    padding: 0 12px;
  }
}
</style>

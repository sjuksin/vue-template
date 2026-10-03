import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import JavaScriptObfuscator from 'javascript-obfuscator'

const SRC_DIR = 'dist'
const OUT_DIR = 'dist_obf'

// Удалим OUT_DIR, если есть
rmSync(OUT_DIR, { recursive: true, force: true })

// Копируем все содержимое, кроме source-файлов (*.js.map)
cpSync(SRC_DIR, OUT_DIR, { recursive: true, filter: (src) => !src.endsWith('.js.map') })

// Обфусцируем все .js файлы внутри копии (кроме файлов, содержащих в названии 'vendor')
for (const name of readdirSync(OUT_DIR, { recursive: true })) {
  if (!name.endsWith('.js') || name.includes('vendor')) continue

  const file = join(OUT_DIR, name)
  writeFileSync(file, JavaScriptObfuscator.obfuscate(readFileSync(file, 'utf8')).getObfuscatedCode())
}

#!/bin/bash

# Проверка аргументов
if [ $# -ne 2 ]; then
  read -p "❌ Использование: $0 <SRC_DIR> <OUT_DIR>"
  exit 1
fi

SRC_DIR="$1"
OUT_DIR="$2"

printf "Копируем из $SRC_DIR в $OUT_DIR и обфусцируем JS-файлы.\n"
printf "НЕ копируем source-файлы (*.map.js)\n"
printf "НЕ обфусцируем vendor-файлы"
printf "\n--------\n\n"

# Проверка, существует ли SRC_DIR
if [ ! -d "$SRC_DIR" ]; then
  read -p "❌ Папка источника '$SRC_DIR' не найдена."
  exit 1
fi

# Удалим OUT_DIR, если есть
rm -rf "$OUT_DIR"

# Копируем все содержимое
cp -r "$SRC_DIR/" "$OUT_DIR/"

# Удаляем source-файлы
find "$OUT_DIR" -type f -name "*.js.map" | while read file; do
  echo "Удаляем source-файл: $file"
  rm $file
done

# Обфусцируем все .js файлы внутри копии (кроме содержащих vendor)
find "$OUT_DIR" -type f -name "*.js" | while read file; do
  if [[ "$file" = *vendor* ]]; then
     echo "Не обфусцируем vendor-файл: $file"
     continue
  else
     echo "Обфусцируем $file"
     javascript-obfuscator "$file" --output "$file"
  fi
done

printf "\n\n--------\n"
printf "Обфускация кода завершена.\n"
read -p "Нажмите Enter для завершения..."






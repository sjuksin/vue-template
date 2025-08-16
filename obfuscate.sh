#!/bin/bash

# Проверка аргументов
if [ $# -ne 2 ]; then
  read -p "❌ Использование: $0 <SRC_DIR> <OUT_DIR>"
  exit 1
fi

SRC_DIR="$1"
OUT_DIR="$2"

printf "Копируем из $SRC_DIR в $OUT_DIR и обфусцируем JS-файлы.\n"
printf "При этом:\n"
printf "  НЕ копируем source-файлы (*.js.map)\n"
printf "  НЕ обфусцируем vendor-файлы"
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
  echo ">> Удаляем: $file (source-файл)"
  rm $file
done

# Обфусцируем все .js файлы внутри копии (кроме файлов, содержащих в названии 'vendor')
while IFS= read -r file; do
  if [[ "$file" == *vendor* ]]; then
    echo ">> Пропускаем: $file (vendor-файл)"
    continue
  fi

  echo ">> Обфусцируем: $file"
  # Обфусцуируем через библиотеку "javascript-obfuscator", игнорируем все сообщения кроме ошибок
  if ! javascript-obfuscator "$file" --output "$file" >/dev/null; then
    printf "\n❌ Ошибка при обфускации: $file.\n"
    read -p "Нажмите Enter для выхода..." </dev/tty
    exit 1
  fi
done < <(find "$OUT_DIR" -type f -name "*.js")

printf "\n\n--------\n"
printf "Обфускация кода завершена.\n"
read -p "Нажмите Enter для завершения..." </dev/tty






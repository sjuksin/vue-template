import stringify from 'json-stringify-pretty-compact'

// Компактный вывод объекта
(globalThis as any).stringify = (data: any) => stringify(data).replace(/"(\w+)":/g, '$1:')

import stringify from 'json-stringify-pretty-compact'

(globalThis as any).stringify = (data: any) => data && stringify(data).replace(/"(\w+)":/g, '$1:')

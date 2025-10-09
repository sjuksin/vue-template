/**
 * Здесь находятся "общие", кросс-проектные функции
 */


export function validateEmail (value: string) {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  return validRegex.test(value)
}

export function isMobile (): boolean {
  const userAgent = navigator.userAgent
  const mobileRegex = /android|iphone|ipod|ipad|windows phone|blackberry|mobile.+firefox|opera m(ob|in)i/i
  return mobileRegex.test(userAgent)
}

export function isTouchDevice (): boolean {
  return (
    'ontouchstart' in window ||
    (navigator.maxTouchPoints ?? 0) > 0 ||
    ('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints > 0)
  )
}

/**
 * Множественное числов существительного
 * @param n
 * @param forms - [яблоко, яблока, яблок]
 */
export function pluralForm (n: number, forms: [string, string, string]): string {
  const absN = Math.abs(n) % 100
  const lastDigit = absN % 10

  if (absN > 10 && absN < 20) {
    return forms[2] // например, "яблок"
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1] // например, "яблока"
  }
  if (lastDigit === 1) {
    return forms[0] // например, "яблоко"
  }
  return forms[2] // например, "яблок"
}

export function copyToClipboard (text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Clipboard write failed:', err)
      fallbackCopy(text)
    })
  } else {
    fallbackCopy(text)
  }
}

function fallbackCopy (text: string): void {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

export function assertNever (data: never): never {
  console.error('assertNever', data)
  throw new Error('This should never happen.')
}

export function generateId (length: number, numbersOnly: boolean): string {
  const firstChars = numbersOnly
    ? '123456789'
    : 'abcdefghijklmnopqrstuvwxyz'
  const otherChars = numbersOnly
    ? '0123456789'
    : 'abcdefghijklmnopqrstuvwxyz0123456789'

  let id = firstChars[Math.floor(Math.random() * firstChars.length)]
  for (let i = 1; i < length; i++) {
    id += otherChars[Math.floor(Math.random() * otherChars.length)]
  }

  return id
}

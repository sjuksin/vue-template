/**
 * Здесь находятся специфичные для проекта функции
 */


export function ymGoal (param: string) {
  if (location.hostname === 'localhost') {
    // console.log('ymGoal', param)
  } else {
    // @ts-ignore
    ym(777777777, 'reachGoal', param)
  }
}

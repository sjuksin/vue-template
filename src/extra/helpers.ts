/***** Хелперы, вспомогательные функции для данного проекта *****/

/**
 * Цель для Яндекс Метрики
 * @param param
 */
export function ymGoal (param: string) {
  if (location.hostname === 'localhost') {
    // console.log('ymGoal', param)
  } else {
    // @ts-ignore
    ym(777777777, 'reachGoal', param)
  }
}

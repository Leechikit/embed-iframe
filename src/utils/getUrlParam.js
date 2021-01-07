/*
 * @Description: 获取url参数
 * @Autor: Lizijie
 * @Date: 2021-01-07 14:39:07
 * @LastEditors: Lizijie
 * @LastEditTime: 2021-01-07 14:41:12
 */

export default function getUrlParam(url = window.location.href) {
  let paramsArr = url.split('?')
  if (paramsArr.length < 2) {
    return ''
  }
  let paramsStr = paramsArr[paramsArr.length - 1]
  return paramsStr
}

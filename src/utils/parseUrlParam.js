/*
 * @Description: 获取地址栏参数
 * @Autor: Lizijie
 * @Date: 2020-12-04 15:00:56
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-12-04 15:03:48
 */
/**
 * 获取地址栏参数
 *
 * @param: {String} paramName 参数名
 */
export default function parseUrlParam(paramName, url = window.location.href) {
  let result = {}
  let paramsArr = url.split('?')
  if (paramsArr.length < 2) {
    return ''
  }
  let paramsStr = paramsArr[paramsArr.length - 1]
  let params = paramsStr.split('&')
  params.forEach(param => {
    let [key, value] = param.split('=')
    if (value) {
      value = decodeURIComponent(value)
    }
    result[key] = value
    result[key.toLowerCase()] = value
  })
  return paramName ? result[paramName] : ''
}

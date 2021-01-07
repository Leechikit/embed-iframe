/*
 * @Description: 获取地址栏参数
 * @Autor: Lizijie
 * @Date: 2020-12-04 15:00:56
 * @LastEditors: Lizijie
 * @LastEditTime: 2021-01-07 14:40:50
 */
import getUrlParam from './getUrlParam'
/**
 * 获取地址栏参数
 *
 * @param: {String} paramName 参数名
 */
export default function parseUrlParam(paramName, url = window.location.href) {
  let result = {}
  let paramsStr = getUrlParam(url)
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

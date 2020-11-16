/*
 * @Description: 
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:15:34
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-16 18:02:02
 */

import { IframeComm } from './lib/core'

function init(options, selector) {
  let iframeComm = new IframeComm()
  iframeComm.create(options, selector)
  return iframeComm
}
const parent = window.parent === window ? null : new IframeComm()

export default {
  init,
  parent
}
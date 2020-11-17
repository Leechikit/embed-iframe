/*
 * @Description: 
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:15:34
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-17 14:51:47
 */

import { EmbedIframe } from './lib/core'

function init(options, selector) {
  let iframeComm = new EmbedIframe()
  iframeComm.create(options, selector)
  return iframeComm
}
const parent = window.parent === window ? null : new EmbedIframe()

export default {
  init,
  parent
}
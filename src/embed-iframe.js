/*
 * @Description:
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:15:34
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-26 16:14:11
 */

import { EmbedIframe } from './lib/core'

const VERSION = '0.1.0'

const childFrameAPI = ['emit','resize', 'off', 'on'].reduce(
  (total, curr) => {
    total[curr] = () => {}
    return total
  },
  {}
)

function init(options, selector) {
  let iframeComm = new EmbedIframe()
  iframeComm.create(options, selector)
  return iframeComm
}
const parent = window.parent === window ? childFrameAPI : new EmbedIframe()

export default {
  init,
  parent,
  version: VERSION
}

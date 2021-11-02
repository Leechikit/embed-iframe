/*
 * @Description:
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:15:34
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-30 16:59:46
 */

import { EmbedIframe } from './lib/core'
import packageJson from '../package.json'

const childFrameAPI = ['emit', 'resize', 'ready', 'off', 'on'].reduce(
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

const globalExport = {
  init,
  parent,
  version: packageJson.version
}

window.EmbedIframe = globalExport

export default globalExport

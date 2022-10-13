/*
 * @Description:
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:24:26
 * @LastEditors: Lizijie
 * @LastEditTime: 2021-01-27 11:29:42
 */

import getUid from '../utils/getUid'
import parseUrlParam from '../utils/parseUrlParam'
import getUrlParam from '../utils/getUrlParam'
import packageJson from '../../package.json'

const IFRAME_EVENT = {
  resize: 'iframe_resize',
  ready: 'iframe_ready'
}

export class EmbedIframe {
  constructor() {
    this._uid = getUid()
    this._events = new Map()
    this._isParentFrame = window.parent === window
    this._selfOrign = location.origin
    this._targetOrigin = this._isParentFrame
      ? this._selfOrign
      : this._getOrigin(document.referrer)
    this._iframe
    this._resetHeight

    this._contentWindow = this._isParentFrame ? null : window.parent

    // 子框架加载后通知父框架
    if (!this._isParentFrame) {
      window.addEventListener('load', this._loadEventHandler.bind(this))
    }

    window.addEventListener('message', this._messageEventHandler.bind(this))
  }

  create(options, selector = '.embed-iframe') {
    if (!selector || !options.url) throw new Error('params is not right!')
    // 解析子框架URL
    this._targetOrigin = this._getOrigin(options.url)

    this._selector = selector
    let containerEl =
      typeof selector === 'string' ? document.querySelector(selector) : selector
    if (containerEl) {
      this._iframe = document.createElement('iframe')
      this._iframe.id = this._uid
      this.load(options)
      if (this._iframe.attachEvent) {
        this._iframe.attachEvent(
          'onload',
          event => this._onLoad && this._onLoad.call(null, event)
        )
      } else {
        this._iframe.addEventListener(
          'load',
          event => this._onLoad && this._onLoad.call(null, event)
        )
      }
      this._iframe.addEventListener(
        'error',
        event => this._onError && this._onError.call(null, event)
      )
      containerEl.appendChild(this._iframe)

      this._contentWindow = this._iframe.contentWindow
    }
  }

  destroy() {
    if (!this._iframe) return
    this._iframe.parentNode.removeChild(this._iframe)
  }

  load({ url, height, minHeight, maxHeight, border }) {
    if (!url) throw new Error('params is not right!')
    this._resetHeight = height
    this._iframe.src = this._addUrlParam(url, [
      { name: 'iframe_id', value: this._iframe.id, hash: true }
    ])
    this._iframe.setAttribute('frameborder', '0')
    this._iframe.style.width = '100%'
    this._iframe.style.height = this._resetHeight ? this._resetHeight : '100%'
    minHeight && (this._iframe.style.minHeight = minHeight)
    maxHeight && (this._iframe.style.maxHeight = maxHeight)
    border && (this._iframe.style.border = border)
  }

  resize(width, height) {
    if (this._isParentFrame) {
      width && (this._iframe.style.width = width + 'px')
      height && (this._iframe.style.height = height + 'px')
    } else {
      this.emit(IFRAME_EVENT.resize, {
        width,
        height
      })
    }
  }

  ready() {
    this.emit(IFRAME_EVENT.ready)
  }

  emit(event, ...args) {
    if (!this._contentWindow) return

    this._contentWindow.postMessage(
      {
        type: packageJson.libraryName,
        _iframeEvent: event,
        _iframeId: parseUrlParam('iframe_id'),
        args
      },
      this._targetOrigin
    )
  }

  on(event, cb) {
    for (let key in IFRAME_EVENT) {
      if (IFRAME_EVENT[key] === event)
        throw new Error(`Unexpected token '${event}'`)
    }
    this._events.set(event, cb)
  }

  off(event) {
    this._events.delete(event)
  }

  onLoad(cb) {
    this._onLoad = typeof cb === 'function' ? cb : () => void 0
  }

  onError(cb) {
    this._onError = typeof cb === 'function' ? cb : () => void 0
  }

  onReady(cb) {
    console.log('embedIframe onReady')
    this._onReady = typeof cb === 'function' ? cb : () => void 0
  }

  _loadEventHandler() {
    this.resize(null, document.documentElement.scrollHeight)
  }

  _messageEventHandler(event) {
    console.log(`embebIframe message：${event.data._iframeEvent}`)
    if (event.data.type !== packageJson.libraryName) return
    if (
      this._isHTTP(this._selfOrign) &&
      this._isHTTP(this._targetOrigin) &&
      event.origin !== this._targetOrigin
    ) {
      throw new Error('event must be from parent frame or child frame')
    }

    const { _iframeEvent, _iframeId, args } = event.data

    if (this._iframe && this._iframe.id !== _iframeId) return

    switch (_iframeEvent) {
      // 处理子框架调整尺寸事件
      case IFRAME_EVENT.resize:
        // 没有配置高度按文档高度设置
        this._iframe &&
          !this._resetHeight &&
          args[0].height &&
          (this._iframe.style.height = args[0].height + 'px')
        break
      // 处理子框架准备就绪事件
      case IFRAME_EVENT.ready:
        this._onReady && this._onReady.call(null)
        break
    }

    let cb = this._events.get(_iframeEvent)
    typeof cb === 'function' && cb.call(null, ...args)
  }

  _isHTTP(url) {
    let result = false
    try {
      let protocol = new URL(url).protocol
      result = ['http:', 'https:'].includes(protocol)
    } catch (error) {}
    return result
  }

  _getOrigin(url) {
    let origin = '*'
    if (this._isHTTP(url)) {
      try {
        origin = new URL(url).origin
      } catch (error) {}
    }
    console.log(`_getOrigin： ${url}, ${origin}`)
    return '*'
  }

  _addUrlParam(url, arrs) {
    // arrs = { name: key值, value: value值, hash: 是否hash模式 }
    let result = url
    try {
      let urlObj = new URL(url)
      let paramsStr = getUrlParam(url)
      let extendParams = ''
      arrs.forEach(({ name, value, hash = false }) => {
        if (hash) {
          if (paramsStr.indexOf(name) === -1) {
            extendParams += `${extendParams ? '&' : ''}${name}=${value}`
          }
        } else {
          if (urlObj.search.indexOf(name) === -1) {
            urlObj.search += `${urlObj.search ? '&' : '?'}${name}=${value}`
          }
        }
      })
      result = `${urlObj.href}${paramsStr ? '&' : '?'}${extendParams}`
    } catch (error) {}
    return result
  }
}

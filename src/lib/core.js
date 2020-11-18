/*
 * @Description:
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:24:26
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-18 10:00:13
 */

const getUid = require('../utils/getUid')

const IFRAME_EVENT = {
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

      this._iframe.addEventListener(
        'load',
        event => this._onLoad && this._onLoad.call(null, event)
      )
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
    this._iframe.src = url
    this._iframe.style.border = border ? border : '1px solid #ccc'
    this._iframe.style.width = '100%'
    this._iframe.style.height = this._resetHeight ? this._resetHeight : '100%'
    minHeight && (this._iframe.style.minHeight = minHeight)
    maxHeight && (this._iframe.style.maxHeight = maxHeight)
  }

  emit(event, ...args) {
    if (!this._contentWindow) return
    this._contentWindow.postMessage(
      {
        _iframeEvent: event,
        _iframeSrc: location.href,
        args
      },
      this._targetOrigin
    )
  }

  on(event, cb) {
    for (let key in IFRAME_EVENT) {
      if (IFRAME_EVENT[key] === event) throw new Error(`Unexpected token '${event}'`)
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
    this._onReady = typeof cb === 'function' ? cb : () => void 0
  }

  _loadEventHandler(event) {
    this.emit(IFRAME_EVENT.ready, {
      height: document.documentElement.scrollHeight
    })
  }

  _messageEventHandler(event) {
    if (
      this._isHTTP(this._selfOrign) &&
      this._isHTTP(this._targetOrigin) &&
      event.origin !== this._targetOrigin
    )
      return

    const { _iframeEvent, _iframeSrc, args } = event.data

    if (this._iframe && this._iframe.src !== _iframeSrc) return

    // 子框架渲染完毕
    if (this._isParentFrame && _iframeEvent === IFRAME_EVENT.ready) {
      // 没有配置高度按文档高度设置
      !this._resetHeight && (this._iframe.style.height = args[0].height + 'px')
      // 回调
      this._onReady && this._onReady.call(null, ...args)
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
    return origin
  }
}

/*
 * @Description:
 * @Autor: Lizijie
 * @Date: 2020-11-12 15:24:26
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-16 18:03:11
 */

const IFRAME_EVENT = {
  resize: 'iframe_resize'
}

export class IframeComm {
  constructor() {
    this._events = []
    this._isParentFrame = window.parent === window
    this._selfOrign = location.origin
    this._targetOrigin = this._isParentFrame
      ? this._selfOrign
      : this._getOrigin(document.referrer)
    this._iframe
    this._resetHeight

    this._contentWindow = this._isParentFrame ? null : window.parent

    // 子框架发送子框架高度
    if (!this._isParentFrame) {
      window.addEventListener('load', this._loadEventHandler.bind(this))
    }

    window.addEventListener('message', this._messageEventHandler.bind(this))
  }

  create({ url, height, minHeight, maxHeight }, selector = '.iframe-comm') {
    if (!selector || !url) throw new Error('params is not right!')
    // 解析子框架URL
    this._targetOrigin = this._getOrigin(url)

    this._resetHeight = height
    this._selector = selector
    let containerEl =
      typeof selector === 'string' ? document.querySelector(selector) : selector
    if (containerEl) {
      this._iframe = document.createElement('iframe')
      this._iframe.src = url
      this._iframe.style.width = '100%'
      this._iframe.style.height = this._resetHeight ? this._resetHeight : '100%'
      minHeight && (this._iframe.style.minHeight = minHeight)
      maxHeight && (this._iframe.style.maxHeight = maxHeight)
      this._iframe.addEventListener(
        'load',
        event => this._onReady && this._onReady.call(null, event)
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

  load(url) {
    if (!url) return
    this._iframe.src = url
  }

  send(event, ...args) {
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
    this._events[event] = cb
  }

  onReady(cb) {
    this._onReady = typeof cb === 'function' ? cb : () => {}
  }

  onError(cb) {
    this._onError = typeof cb === 'function' ? cb : () => {}
  }

  _loadEventHandler(event) {
    this.send(IFRAME_EVENT.resize, {
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

    // 父框架设置子框架高度
    if (
      this._isParentFrame &&
      _iframeEvent === IFRAME_EVENT.resize &&
      !this._resetHeight
    ) {
      this._iframe.style.height = args[0].height + 'px'
    }

    let cb = this._events[_iframeEvent]
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

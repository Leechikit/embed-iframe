# embed-iframe

A tool for embedding iframe and iframe communication
## Options

### `init` 创建内嵌的协同

```
let embed = EmbedIframe.init(options, selector)
```

* `selector`：插入元素选择器或DOM，可选，默认为：`.ctg-embed`
* `options`：
    -  `url`：协同页面URL
    -  `height`：页面高度
    -  `minHeight`
    -  `maxHeight`

## Attribute

### `parent` 
内嵌协同的父框架的EmbedIframe实例，可使用 API 和 Events

## API

### `destory` 销毁内嵌
```
embed.destory()
```

### `load` 重新加载内嵌页面
```
embed.load(options)
```

### `emit` 发送消息
```
embed.emit(event, value)
```

## Events

### `on` 自定义监听事件
```
embed.on(event, function(value){})
```

### `onLoad` 监听嵌入页面加载成功
```
embed.onLoad(event, function(){})
```

### `onError` 监听嵌入页面加载失败
```
embed.onError(event, function(){})
```

### `onReady` 监听嵌入页面渲染完成

返回页面高度
```
embed.onReady(event, function({height}){})
```

## Example

### 父页面
```
<template>
  <div>
    <div class="embed-iframe"></div>
    <button @click="onClick">button</button>
  </div>
</template>
<script>
import EmbedIframe from 'embed-iframe'

export default {
  data() {
    return {
      embed: null
    }
  },
  mounted() {
    this.embed = EmbedIframe.init({ url: "http://xxx" })

    this.embed.onLoad(() => {
      this.embed.emit("message", "iframe loaded")
    })

    this.embed.on('form:submit', () => {
      console.log('form:submit')
    })
  },
  methods: {
    onClick() {
      this.embed.emit("message", "send some message to iframe")
    }
  }
}
</script>
```

### 内嵌子页面
```
<template>
  <div>
    <button @click="onClick('form:submit')">button</button>
  </div>
</template>
<script>
import EmbedIframe from 'embed-iframe'

export default {
  mounted() {
    EmbedIframe.parent.on("message", value => {
      console.log(value)
    })
  },
  methods: {
    onClick(event) {
      EmbedIframe.parent.emit(event)
    }
  }
}
</script>
```

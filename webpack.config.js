/*
 * @Description: webpack配置文件
 * @Autor: Lizijie
 * @Date: 2020-07-22 15:16:04
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-17 15:12:02
 */

const Path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'embed-iframe': Path.resolve(__dirname, './src/embed-iframe.js')
  },
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: '[name].min.js',
    library: 'EmbedIframe',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}

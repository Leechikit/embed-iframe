/*
 * @Description: webpack配置文件
 * @Autor: Lizijie
 * @Date: 2020-07-22 15:16:04
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-12 15:13:16
 */

const Path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    IframeComm: Path.resolve(__dirname, './src/iframe-comm.js')
  },
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: '[name].min.js',
    library: 'IframeComm',
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

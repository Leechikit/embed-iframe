/*
 * @Description: webpack配置文件
 * @Autor: Lizijie
 * @Date: 2020-07-22 15:16:04
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-12-04 15:22:44
 */

const Path = require('path')
const packageJson = require('./package.json')

module.exports = {
  mode: 'production',
  entry: {
    'embed-iframe': Path.resolve(__dirname, './src/embed-iframe.js')
  },
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: '[name].min.js',
    library: packageJson.libraryName,
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

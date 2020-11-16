/*
 * @Description: uuid
 * @Autor: Lizijie
 * @Date: 2020-11-16 15:04:42
 * @LastEditors: Lizijie
 * @LastEditTime: 2020-11-16 15:07:20
 */
const uuid = require('uuid')

module.exports = function getUid() {
  return 'iframe-' + uuid.v4().split('-')[0]
}
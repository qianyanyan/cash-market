var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.1.212:8088"',
  IMG_SERVER: '"http://192.168.1.212:8090"'
})

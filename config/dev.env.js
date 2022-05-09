'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AUTH_URL: '"http://localhost:8000"',
  BASE_URL: '"http://localhost:8001"',
  SLEF_URL: '"http://localhost:8002"',
})

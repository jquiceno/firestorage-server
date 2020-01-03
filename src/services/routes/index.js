'use strict'

const fs = require('fs')

const routes = {}

fs.readdirSync(__dirname).map(f => {
  if (f === 'index.js') return
  routes[f] = require(`./${f}`)
})

module.exports = routes

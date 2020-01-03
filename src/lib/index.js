'use strict'

const fs = require('fs')

const libs = {}

fs.readdirSync(__dirname).map(f => {
  if (f === 'index.js') return
  libs[`${f.charAt(0).toUpperCase()}${f.slice(1).toLowerCase()}`] = require(`./${f}`)
})

module.exports = libs

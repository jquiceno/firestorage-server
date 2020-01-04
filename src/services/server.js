'use strict'

/**
 * server.js start express server
 * export express app pre configured
 * init enviroment vars using dotenv
*/

const express = require('express')
const Boom = require('@hapi/boom')
const cors = require('cors')
const routes = require('./routes')
const helmet = require('helmet')
const fileUpload = require('express-fileupload');

require('dotenv').config()

const app = express()

app.use(helmet())
app.use(fileUpload())

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}))

app.use(express.json())

Object.keys(routes).map(routeName => {
  app.use(`/${routeName !== 'home' ? routeName : ''}`, routes[routeName])
})

app.use((err, req, res, next) => {
  if (!err) return next()

  console.error(err, `Error in : ${req.method}:${req.url}`)
  const { output } = Boom.boomify(err)
  return res.status(output.statusCode).json(output.payload)
})

// if (module === require.main) {
//   app.listen(PORT, (err) => {
//     if (err) throw err
//     console.log(`Server start in port: ${process.env.PORT}`)
//   })
// }

module.exports = app

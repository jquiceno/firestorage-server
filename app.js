'use strict'

const { Server } = require('./')

const PORT = process.env.PORT || 3000

Server.listen(PORT, function () {
  console.log(`Server start in port ${PORT}`)
})

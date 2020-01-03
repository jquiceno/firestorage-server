'use strict'

const { Router } = require('express')
const router = Router()

router.route('/')
  .get(async (req, res, next) => {
    return res.json({}).status(200)
  })

module.exports = router

'use strict'

const { Router } = require('express')
const router = Router()
const { File } = require('../../../lib')

router.route('/')
  .get(async (req, res, next) => {
    try {
      const files = await File.getAll()

      const response = {
        data: files,
        statusCode: 200
      }

      return res.json(response).status(response.statusCode)
    } catch (error) {
      return next(error)
    }
  })
  .post(async (req, res, next) => {
    try {
      let filesArray = []
      const { files } = req

      const keyFiles = Object.keys(files)

      keyFiles.forEach(key => {
        const f = Array.isArray(files[key]) ? files[key] : [files[key]]
        filesArray = filesArray.concat(f)
      })

      const fileRemoteData = await Promise.all(filesArray.map(file => {
        return File.add(file.data, {
          name: file.name,
          type: file.mimetype
        })
      }))

      const response = {
        data: fileRemoteData,
        statusCode: 200
      }

      return res.json(response).status(response.statusCode)
    } catch (error) {
      return next(error)
    }
  })

module.exports = router

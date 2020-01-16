'use strict'

const Boom = require('@hapi/boom')
const Db = require('../db')
const { PassThrough } = require('stream')
const Moment = require('moment')
const FileType = require('file-type')
const defaults = require('defaults')
const Config = require('getfig')

const config = Config.get()

const { serviceAcount, env } = config

const storage = Db.init(serviceAcount)
const uploadDir = env.UPLOAD_DIR || config.uploadDir || ''

class File {
  static async getAll () {
    try {
      let files = await new Promise((resolve, reject) => {
        storage.getFiles((err, files) => {
          if (err) return reject(err)
          return resolve(files)
        })
      })

      files = files.map(f => f.metadata)

      return Promise.resolve(files)
    } catch (error) {
      return Promise.reject(Boom.boomify(error))
    }
  }

  static async add (buffer, opts) {
    try {
      opts = defaults(opts, {
        name: Moment().unix(),
        type: FileType(buffer) ? FileType(buffer).mime : ''
      })

      const { name, type } = opts

      const remoteFile = storage.file(`${uploadDir}/${name}`)

      const bufferStream = new PassThrough()
      bufferStream.end(buffer)

      const fileRemoteData = await new Promise((resolve, reject) => {
        bufferStream
          .pipe(remoteFile.createWriteStream({
            public: true,
            gzip: true,
            metadata: {
              contentType: type
            }
          }))
          .on('error', err => {
            reject(err)
          })
          .on('finish', () => {
            remoteFile.get()
              .then(data => {
                const fileData = data[0].metadata
                resolve({
                  url: fileData.mediaLink,
                  size: fileData.size
                })
              })
          })
      })

      return Promise.resolve(fileRemoteData)
    } catch (error) {
      return Promise.reject(Boom.boomify(error))
    }
  }
}

module.exports = File

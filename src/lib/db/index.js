'use strict'

const admin = require('firebase-admin')

class Firebase {
  constructor (serviceAccount) {
    this.app = null

    const appName = `storage-${serviceAccount.project_id}`

    const dbConfig = {
      credential: admin.credential.cert(serviceAccount),
      storageBucket: serviceAccount.storageBucket
    }

    if (!admin.apps.length) {
      admin.initializeApp(dbConfig)
    }

    try {
      this.app = admin.app(appName)
    } catch (e) {
      admin.initializeApp(dbConfig, appName)
    }

    this.app = admin.app(appName)
  }

  storage () {
    return this.app.storage().bucket()
  }

  static init (serviceAccount) {
    const db = new Firebase(serviceAccount)
    return db.storage()
  }
}

module.exports = Firebase

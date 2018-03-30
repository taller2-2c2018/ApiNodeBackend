'use strict'
const fs = require('fs')
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash

module.exports = (models) => {
  return {
    list: () => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findAll({
          attributes: [ 'id', 
            'filename',
            'resource',
            '_rev',
            'size',
            'created_at',
            'updated_at'],
          order: [['id', 'ASC']],
        })
          .then((files) => {
            resolve(files)
          })
          .catch((e) => {
            reject(e)
          })
      })
      return promise
    },
    create: (file) => {
      let promise = new Promise((resolve, reject) => {
        let parameters = {
          filename: file.filename,
          filename_original: file.originalname,
          resource: file.path,
          size: file.size,
          visible: true
        }
        parameters = asignarHash(parameters)
        models.FileApplicationUser.create(parameters)
          .then((file) => {
            resolve(file)
          })
          .catch((e) => {
            reject(errorGetter.getServiceError(e.errors))
          })
      })
      return promise
    },
    delete: (file_id) => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findById(file_id)
          .then((file) => {
            if (file) {
              let filename = file.filename
              models.FileApplicationUser.destroy({
                where: { id: file_id }
              }).then(() => {
                try {
                  fs.unlinkSync(__dirname + '/../uploads/' + filename)
                  resolve('Baja correcta')
                } catch (e) {
                  reject(errorGetter.getServiceError(e.errors))
                }
              }).catch((e) => {
                reject(errorGetter.getServiceError(e.errors))
              })
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.FileApplicationUser.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    get: (file_id) => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findOne({
          where: {
            id: file_id
          }
        })
          .then((file) => {
            if (file) {
              resolve(file.filename)
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.FileApplicationUser.getMsgInexistente()))
            }
          })
      })
      return promise
    },
  }
}
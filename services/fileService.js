'use strict'
const fs = require('fs')
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash

// const NECESSARY_PARAMS = ['createdTime',
//   'updatedTime',
//   'size',
//   'filename',
//   'resource']

const NECESSARY_PARAMS_UPLOADS = ['id',
  '_rev',
  'createdTime',
  'updatedTime',
  'size',
  'filename',
  'resource']

const validateParams = (params, necessaryParams) => {
  let errors = []
  necessaryParams.forEach( param => {
    if(!params.hasOwnProperty(param)){
      errors.push(param)
    }
  })
  return errors
}

const getFieldsFromParams = (params) => {
  let fields = Object.keys(params)
    .filter(item => item !== 'id')
  return fields
}

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
      let promise = new Promise(async (resolve, reject) => {
        try{
          let parameters = {
            filename: file.filename,
            filename_original: file.originalname,
            resource: file.path,
            size: file.size,
            visible: true
          }
          parameters = asignarHash(parameters)
          await models.FileApplicationUser.create(parameters)
          await file.update({id: file.pk})
          resolve(file)
        } catch(e) { 
          reject(errorGetter.getServiceError(e.errors))
        }
      })
      return promise
    },
    upload: (file, params) => {
      let promise = new Promise((resolve, reject) => {
        let metadata = params.metadata
        let errors = validateParams(metadata,NECESSARY_PARAMS_UPLOADS)
        if(errors.length === 0){
          let parameters = {
            id: metadata.id,
            filename: metadata.filename,
            filename_original: file.originalname,
            resource: metadata.resource,
            updated_at: metadata.updatedTime,
            created_at: metadata.createdTime,
            size: metadata.size,
            _rev: metadata._rev,
            visible: true
          }
          models.FileApplicationUser.create(parameters)
            .then((file) => {
              resolve(file)
            })
            .catch((e) => {
              reject(errorGetter.getServiceError(e.errors))
            })
        } else {
          reject(errorGetter.getServiceErrorLostParams(errors))
        }
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
    update: (file_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findById(file_id, {}).then((file) => {
          if (file !== null) {
            let fields = getFieldsFromParams(params)
            file.update(params, {
              fields: fields
            }).then((derivacion) => {
              resolve(derivacion)
            })
              .catch((e) => {
                return reject(errorGetter.getServiceError(e.errors))
              })
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.FileApplicationUser.getMsgInexistente()))
          }
        })
      })
      return promise
    },
  }
}
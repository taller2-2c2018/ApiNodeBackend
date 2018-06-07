'use strict'
const fs = require('fs')
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash
const validateParams = require('../util/functions').validateParams
const getFieldsFromParams = require('../util/functions').getFieldsFromParams

const NECESSARY_PARAMS = ['id',
  '_rev',
  'created_at',
  'updated_at',
  'size',
  'filename',
  'resource']

const NECESSARY_PARAMS_UPLOADS = ['id',
  '_rev',
  'created_at',
  'updated_at',
  'size',
  'filename',
  'resource']

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
    create: (file,params) => {
      let promise = new Promise(async (resolve, reject) => {
        try{
          let errors = validateParams(params,NECESSARY_PARAMS)
          if(errors.length === 0){
            let parameters = {
              filename: file.filename,
              filename_original: file.originalname,
              resource: file.path,
              size: file.size,
              visible: true
            }
            parameters = asignarHash(parameters)
            let newFile = await models.FileApplicationUser.create(parameters)
            await newFile.update({id: newFile.pk})
            let fileResponse = {}
            fileResponse.name = newFile.name
            fileResponse.id = newFile.id
            fileResponse._rev = newFile._rev
            fileResponse.created_at = newFile.created_at
            fileResponse.updated_at = newFile.updated_at
            fileResponse.size = newFile.size
            fileResponse.filename = newFile.filename_original
            fileResponse.resource = newFile.resource 
            resolve(fileResponse)
          } else {
            reject(errorGetter.getServiceErrorLostParams(errors))
          }
        } catch(e) { 
          reject(errorGetter.getServiceError(e))
        }
      })
      return promise
    },
    upload: (file, params) => {
      let promise = new Promise((resolve, reject) => {
        let errors = validateParams(params,NECESSARY_PARAMS_UPLOADS)
        if(errors.length === 0){
          let parameters = {
            id: params.id,
            filename: params.filename,
            filename_original: file.originalname,
            resource: params.resource,
            updated_at: params.updatedTime,
            created_at: params.createdTime,
            size: params.size,
            _rev: params._rev,
            visible: true
          }
          models.FileApplicationUser.create(parameters)
            .then((newFile) => {
              let fileResponse = {}
              fileResponse.name = newFile.name
              fileResponse.id = newFile.id
              fileResponse._rev = newFile._rev
              fileResponse.created_at = newFile.created_at
              fileResponse.updated_at = newFile.updated_at
              fileResponse.size = newFile.size
              fileResponse.filename = newFile.filename_original
              fileResponse.resource = newFile.resource 
              resolve(fileResponse)
            })
            .catch((e) => {
              reject(errorGetter.getServiceError(e))
            })
        } else {
          reject(errorGetter.getServiceErrorLostParams(errors))
        }
      })
      return promise
    },
    delete: (file_id) => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findOne({ where: { id: file_id } })
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
                  reject(errorGetter.getServiceError(e))
                }
              }).catch((e) => {
                reject(errorGetter.getServiceError(e))
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
            let errors = validateParams(params, NECESSARY_PARAMS)
            if (errors.length === 0) {
              if (file._rev == params._rev) {
                //Reasgino el hash para poder volver a modificarlo
                params = asignarHash(params)
                file.update(params, {
                  fields: fields
                }).then((file) => {
                  resolve(file)
                })
                  .catch((e) => {
                    return reject(errorGetter.getServiceError(e))
                  })
              } else {
                reject(errorGetter.getServiceErrorAlreadyModified())
              }
            } else {
              reject(errorGetter.getServiceErrorLostParams(errors))
            }
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.FileApplicationUser.getMsgInexistente()))
          }
        })
      })
      return promise
    },
  }
}
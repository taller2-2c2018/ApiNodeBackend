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
    .filter(item => item !== 'pk')
  return fields
}

module.exports = (models) => {
  return {
    list: () => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findAll({
          attributes: [ 'id', 
            'name',
            '_rev',
            'created_at',
            'created_by',
            'last_connection'],
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
    create: (params) => {
      let promise = new Promise(async (resolve, reject) => {
        try{
          let parameters = {
            name: params.name,
            last_connection: null,
          }
          parameters = asignarHash(parameters)
          let newServer = await models.Server.create(parameters)
          await newServer.update({
            id: newServer.pk,
          })
          resolve(newServer)
        } catch(e) { 
          reject(errorGetter.getServiceError(e))
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
              reject(errorGetter.getServiceError(e))
            })
        } else {
          reject(errorGetter.getServiceErrorLostParams(errors))
        }
      })
      return promise
    },
    delete: (server_id) => {
      let promise = new Promise((resolve, reject) => {
        models.FileApplicationUser.findById(server_id)
          .then((file) => {
            if (file) {
              models.Server.destroy({
                where: { id: server_id }
              }).then(() => {
                resolve('Baja correcta')
              }).catch((e) => {
                reject(errorGetter.getServiceError(e))
              })
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Server.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    get: (server_id) => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findOne({
          where: {
            id: server_id
          }
        })
          .then((server) => {
            if (server) {
              resolve(server)
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Server.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    update: (server_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findById(server_id, {}).then((server) => {
          if (server !== null) {
            let fields = getFieldsFromParams(params)
            server.update(params, {
              fields: fields
            }).then((server) => {
              resolve(server)
            })
              .catch((e) => {
                return reject(errorGetter.getServiceError(e))
              })
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.Server.getMsgInexistente()))
          }
        })
      })
      return promise
    },
  }
}
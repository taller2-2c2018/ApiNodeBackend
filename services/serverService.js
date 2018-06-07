'use strict'
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash
const validateParams = require('../util/functions').validateParams
const getFieldsFromParams = require('../util/functions').getFieldsFromParams

const NECESSARY_PARAMS = ['id',
  '_rev',
  'created_at',
  'created_by',
  'name',
  'last_connection']

module.exports = (models) => {
  return {
    list: () => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findAll({
          attributes: ['id',
            'name',
            'usuario_id',
            '_rev',
            'url',
            'created_at',
            'last_connection'],
          order: [['id', 'ASC']],
          include: [{ model: models.Usuario }]
        })
          .then((servers) => {
            let response = []
            servers.forEach((server) => {
              let serverResponse = {}
              serverResponse.name = server.name
              serverResponse.id = server.id
              serverResponse._rev = server._rev
              serverResponse.created_at = server.created_at
              serverResponse.created_by = (server.usuario_id)?server.Usuario.email:'default' 
              serverResponse.url = server.url
              response.push(serverResponse)
            })
            resolve(response)
          })
          .catch((e) => {
            reject(e)
          })
      })
      return promise
    },
    create: (usuario_id, params) => {
      let promise = new Promise(async (resolve, reject) => {
        try {
          let errors = validateParams(params, NECESSARY_PARAMS)
          if (errors.length === 0) {
            let parameters = {
              usuario_id: usuario_id,
              name: params.name,
              url: params.url,
            }
            parameters = asignarHash(parameters)
            let newServer = await models.Server.create(parameters)
            await newServer.update({
              id: newServer.pk,
            })
            resolve(newServer)
          } else {
            reject(errorGetter.getServiceErrorLostParams(errors))
          }
        } catch (e) {
          reject(errorGetter.getServiceError(e))
        }
      })
      return promise
    },
    upload: (file, params) => {
      let promise = new Promise((resolve, reject) => {
        let metadata = params.metadata
        let errors = validateParams(metadata, NECESSARY_PARAMS)
        if (errors.length === 0) {
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
      let promise = new Promise(async (resolve, reject) => {
        let server = await models.Server.findOne({ where: { id: server_id } })
        if (server) {
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
      return promise
    },
    get: (server_id) => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findOne({
          where: {
            id: server_id.toString()
          }
        })
          .then((server) => {
            if (server) {
              server = server.dataValues
              let serverResponse = {}
              serverResponse.name = server.name
              serverResponse.id = server.id
              serverResponse._rev = server._rev
              serverResponse.created_at = server.created_at
              serverResponse.created_by = server.usuario_id
              serverResponse.last_connection = server.last_connection
              serverResponse.url = server.url
              resolve(serverResponse)
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Server.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    update: (server_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models.Server.findById(server_id, { include: [{ model: models.Usuario }] }).then((server) => {
          if (server !== null) {
            let fields = getFieldsFromParams(params)
            let errors = validateParams(params, NECESSARY_PARAMS)
            params.usuario_id = params.created_by 
            if (errors.length === 0) {
              if (server._rev == params._rev) {
                //Reasgino el hash para poder volver a modificarlo
                params = asignarHash(params)
                server.update(params, {
                  fields:  fields
                }).then((server) => {
                  let serverResponse = {}
                  serverResponse.name = server.name
                  serverResponse.id = server.id
                  serverResponse._rev = server._rev
                  serverResponse.created_at = server.created_at
                  serverResponse.created_by = (server.usuario_id)?server.Usuario.email:'default'
                  serverResponse.last_connection = server.last_connection 
                  serverResponse.url = server.url
                  resolve(serverResponse)
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
            reject(errorGetter.getServiceErrorNotFound(models.Server.getMsgInexistente()))
          }
        })
      })
      return promise
    },
  }
}
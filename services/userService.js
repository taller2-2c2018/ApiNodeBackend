'use strict'
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash
const getFieldsFromParams = require('../util/functions').getFieldsFromParams

module.exports = (models) => {
  return {
    list: (server_id) => {
      let promise = new Promise((resolve, reject) => {
        models.ApplicationUser.findAll({
          attributes: ['id',
            'username',
            '_rev',
            'password',
            'facebook_auth_token'],
          order: [['id', 'ASC']],
          where: {
            server_id: server_id
          }
        })
          .then((users) => {
            resolve(users)
          })
          .catch((e) => {
            reject(e)
          })
      })
      return promise
    },
    create: (server_id, params) => {
      let promise = new Promise(async (resolve, reject) => {
        try {
          let parameters = {
            server_id: server_id,
            username: params.username,
            password: params.password,
            facebook_auth_token: params.facebook_auth_token
          }
          parameters = asignarHash(parameters)
          let newApplicationUser = await models.ApplicationUser.create(parameters)
          resolve(newApplicationUser)
        } catch (e) {
          reject(errorGetter.getServiceError(e))
        }
      })
      return promise
    },
    delete: (user_id) => {
      let promise = new Promise(async (resolve, reject) => {
        let user = await models.ApplicationUser.findOne({ where: { id: user_id } })
        if (user) {
          models.ApplicationUser.ddestroy({
            where: { id: user }
          }).then(() => {
            resolve('Baja correcta')
          }).catch((e) => {
            reject(errorGetter.getServiceError(e))
          })
        } else {
          reject(errorGetter.getServiceErrorNotFound(models.ApplicationUser.getMsgInexistente()))
        }
      })
      return promise
    },
    get: (user_id) => {
      let promise = new Promise((resolve, reject) => {
        models.ApplicationUser.findOne({
          where: {
            id: user_id.toString()
          }
        })
          .then((user) => {
            if (user) {
              resolve(user)
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.ApplicationUser.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    update: (user_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models.ApplicationUser.findById(user_id, {}).then((user) => {
          if (user !== null) {
            let fields = getFieldsFromParams(params)
            if (user._rev == params._rev) {
              //Reasgino el hash para poder volver a modificarlo
              params = asignarHash(params)
              user.update(params, {
                fields: fields
              }).then((user) => {
                resolve(user)
              }).catch((e) => {
                return reject(errorGetter.getServiceError(e))
              })
            } else {
              reject(errorGetter.getServiceErrorAlreadyModified())
            }
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.ApplicationUser.getMsgInexistente()))
          }
        })
      })
      return promise
    },
  }
}
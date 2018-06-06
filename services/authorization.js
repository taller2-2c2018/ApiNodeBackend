'use strict'
const errorGetter = require('../util/errors')
const asignarHash = require('../util/functions').asignarHash
const validateParams = require('../util/functions').validateParams
const getFieldsFromParams = require('../util/functions').getFieldsFromParams
const jwt = require('jwt-simple')
const moment = require('moment')
const SERVER_ADMINISTRADOR_ID = 1

const NECESSARY_PARAMS = [
  'application_user_id']

let createToken = (id, username, permisos,nombrePila,application_user_id, exp) => {
  let payload = {
    user_id: id,
    username: username,
    permisos: permisos,
    nombre:nombrePila,
    application_user_id: application_user_id,
    administrador: (application_user_id == SERVER_ADMINISTRADOR_ID),
    iat: moment().unix(),
    exp: exp
  }
  return jwt.encode(payload, process.env.TOKEN_SECRET)
}

module.exports = (models) => {
  return {
    create: (usuario_id, params) => {
      let promise = new Promise(async (resolve, reject) => {
        try {
          let errors = validateParams(params, NECESSARY_PARAMS)
          if (errors.length === 0) {
            let user = await models.ApplicationUser.findOne({ where: { id: application_user_id } })
            if(user == null){
              reject(errorGetter.getServiceError('No existe el usuario'))
            } else {
              let exp = moment().add(30, 'days').unix()
              var token = createToken(usuario_id, username, permisos,usuario.nombre,usuario.application_user_id,exp)
              res = {
                token: token,
                expires_at: exp,
              }
              resolve(user)
            }
          } else {
            reject(errorGetter.getServiceErrorLostParams(errors))
          }
        } catch (e) {
          reject(errorGetter.getServiceError(e))
        }
      })
      return promise
    },
  }
}
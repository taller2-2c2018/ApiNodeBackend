'use strict'
const errorGetter = require('../util/errors')
const validateParams = require('../util/functions').validateParams
const jwt = require('jwt-simple')
const moment = require('moment')

const NECESSARY_PARAMS = [
  'application_user_id']

let createOneToken = (id, username, nombre, apellido, exp) => {
  let payload = {
    user_id: id,
    username: username,
    nombre: nombre,
    apellido: apellido,
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
            let user = await models.ApplicationUser.findOne({ where: { id: params.application_user_id } })
            if(user == null){
              reject(errorGetter.getServiceError('No existe el usuario'))
            } else {
              let exp = moment().add(30, 'days').unix()
              var token = createOneToken(usuario_id, user.username, user.nombre, user.apellido, exp)
              let res = {
                token: token,
                expires_at: exp,
                username: user.username,
                nombre: user.nombre,
                apellido: user.apellido,
                _rev: user._rev,
                password: user.password,
                facebook_auth_token: user.facebook_auth_token,
                fecha_nacimiento: user.fecha_nacimiento,
              }
              resolve(res)
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
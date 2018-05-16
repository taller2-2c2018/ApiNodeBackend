const jwt = require('jwt-simple')
const moment = require('moment')
const errorGetter = require('../../../util/errors')
const models = require('../../../models/sequelize')

const checkIsLoggedWithPermission = function (askedPermmision) {
  return function (req, res, next) {
    if (req.headers && req.headers.authorization) {
      try {
        var payload = jwt.decode(req.headers.authorization, process.env.TOKEN_SECRET)
        if (payload.exp <= moment().unix()) {
          next(errorGetter.getTokenExpired())
        }
        if (askedPermmision !== undefined && !payload.permisos.includes(askedPermmision)) {
          throw new Error('Usuario no autorizado')
        }
        req.permisos = payload.permisos
        req.username = payload.username
        req.user_id = payload.user_id
        req.server_id = payload.server_id
        req.administrador = payload.administrador
        next()
      } catch (e) {
        next(errorGetter.getUsuarioNoAutorizado())
      }
    } else {
      next(errorGetter.getUsuarioNoAutorizado())
    }
  }
}

// const logServerAcces = function (user_id,server_id) {
//   return new Promise((resolve, reject) => {
//     if(user_id && server_id){
//       models.ServerLog.create({
//         user_id: user_id,
//         server_id: server_id,
//       })
//     } else {
//       resolve()
//     }
//   })
// }
// exports.logServerAcces = logServerAcces 

exports.checkIsLoggedWithPermission = checkIsLoggedWithPermission
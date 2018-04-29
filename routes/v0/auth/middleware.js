var jwt = require('jwt-simple')
var moment = require('moment')
var env = process.env.NODE_ENV || 'development'
var errorGetter = require('../../../util/errors')

var checkIsLoggedWithPermission = function (askedPermmision) {
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


exports.checkIsLoggedWithPermission = checkIsLoggedWithPermission
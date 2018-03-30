var errorGetter = require('../../../util/errors')

const checkSuperUser = function () {
  return function (req, res, next) {
    try {
      if( req.administrador ) {
        next()
      } else {
        next(errorGetter.getUsuarioNoAutorizado())
      }
    } catch (e) {
      next(errorGetter.getUsuarioNoAutorizado())
    }
  }
}

exports.checkSuperUser = checkSuperUser
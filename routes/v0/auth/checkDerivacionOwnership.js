var errorGetter = require('../../../util/errors')
const models = require('../../../models/sequelize')

const checkDerivacionOwnership = function () {
  return function (req, res, next) {
    try {
      models.Derivacion.findById(req.derivacion_id)
        .then((derivacion)=>{
          if( derivacion == null || req.organismo_administrador || derivacion.organismo_id === req.organismo_id) {
            next()
          } else {
            next(errorGetter.getUsuarioNoAutorizado())
          }
        })
    } catch (e) {
      next(errorGetter.getUsuarioNoAutorizado())
    }
  }
}

exports.checkDerivacionOwnership = checkDerivacionOwnership
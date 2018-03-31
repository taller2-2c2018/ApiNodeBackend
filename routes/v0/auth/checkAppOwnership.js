var errorGetter = require('../../../util/errors')
const models = require('../../../models/sequelize')

const checkDerivacionOwnership = function () {
  return function (req, res, next) {
    try {
      models.ApplicationUser.findById(req.application_user_id)
        .then((app)=>{
          if( app == null || req.administrador || app.application_user_id === req.application_user_id) {
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
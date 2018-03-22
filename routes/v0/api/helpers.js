'use strict'
const {validationResult} = require('express-validator/check')
const responser = require('../../../util/responser')

// Usada como wrapper para el manejo de errores basicos de un request
// asyncronico
exports.withError = (handler) => async(req, res) => {
  try {
    await handler(req, res)
  } catch (e) {
    res.statusCode = e.status
    res.json(responser.createResponse( e.status,e,null))
  }
}

/* Se debe utilizar como middleware en caso de que la ruta tenga validaciones con express-validator
*/
exports.expressValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(responser.codes.UNPROCESSABLE_ENTITY)
      .json(responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY, errors.mapped(),null))
  }
  next()
}
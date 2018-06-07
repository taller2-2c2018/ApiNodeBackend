const models = require('../models/sequelize')
const permisoService = require('../services/permisoService')(models)
const responser = require('../util/responser')

const list = async function (req, res) {
  let permisos = await permisoService.findAll(req.query)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode, permisos))
}

module.exports = {
  v0: {
    list: list
  }
}

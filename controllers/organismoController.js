const models = require('../models/sequelize')
const organismoService = require('../services/organismoService')(models)
const responser = require('../util/responser')

const list = async function (req, res) {
  let organismos = await organismoService.findAll(req.query)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,organismos))
}

module.exports = {
  v0: {
    list: list
  }
}
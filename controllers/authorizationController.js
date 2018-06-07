const models = require('../models/sequelize')
const authorizationService = require('../services/authorizationService')(models)
const responser = require('../util/responser')

const createToken = async function (req, res) {
  let response = await authorizationService.create(req.user_id, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}


module.exports = {
  v0: {
    createToken: createToken,
  }
}
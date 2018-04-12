const models = require('../models/sequelize')
const serverService = require('../services/serverService')(models)
const responser = require('../util/responser')

const listServers = async function (req, res) {
  let servers = await serverService.list()
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadataCollection(res.statusCode, servers, 'Servers'))
}

const createServer = async function (req, res) {
  let response = await serverService.create(req.user_id, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const getServer = async function (req, res) {
  let server = await serverService.get(req.params.server_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadataCollection(res.statusCode, server, 'Server'))
}

const updateServer = async function (req, res) {
  let response = await serverService.update(req.params.server_id, req.body)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadata(res.statusCode, response, 'Server'))
}

const resetToken = async function (req, res) {
  let response = await serverService.resetToken(req.file, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const deleteServer = async function (req, res) {
  let response = await serverService.delete(req.params.server_id)
  res.statusCode = responser.codes.ACCEPTED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}




module.exports = {
  v0: {
    listServers: listServers,
    createServer: createServer,
    getServer: getServer,
    updateserver: updateServer,
    resetToken: resetToken,
    deleteServer: deleteServer,
  }
}
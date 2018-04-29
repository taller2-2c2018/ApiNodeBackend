const models = require('../models/sequelize')
const userService = require('../services/userService')(models)
const responser = require('../util/responser')

const listUsers = async function (req, res) {
  let users = await userService.list(req.server_id,)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadataCollection(res.statusCode, users, 'Users'))
}

const createUser = async function (req, res) {
  let response = await userService.create(req.server_id, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const getUser = async function (req, res) {
  let user = await userService.get(req.params.user_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadataCollection(res.statusCode, user, 'User'))
}

const updateUser = async function (req, res) {
  let response = await userService.update(req.params.user_id, req.body)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadata(res.statusCode, response, 'User'))
}

const deleteUser = async function (req, res) {
  let response = await userService.delete(req.params.user_id)
  res.statusCode = responser.codes.ACCEPTED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

module.exports = {
  v0: {
    listUsers: listUsers,
    createUser: createUser,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
  }
}
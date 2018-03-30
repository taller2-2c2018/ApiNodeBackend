const models = require('../models/sequelize')
const usuarioService = require('../services/usuarioService')(models)
const responser = require('../util/responser')


const list = async function (req, res) {
  let usuarios = await usuarioService.findAllWithPermissions(req.query)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,usuarios))
}

const getOne = async function (req, res) {
  let usuario = await usuarioService.findById(req.params.usuario_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,usuario))
}

const create = async function (req, res) {
  let body = req.body
  let usuario = await usuarioService.create(body.nombre, body.email, body.verificacion_email, body.password, body.verificacion_password, body.celular, body.telefono)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode,usuario))
}

const update = async function (req, res) {
  let body = req.body
  let usuario = await usuarioService.update(req.params.usuario_id, body)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,usuario))
}

const addRol = async function (req, res) {
  let usuario = await usuarioService.addRolById(req.params.usuario_id, req.body.rol_id)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode,usuario))
}

const deleteRol = async function (req, res) {
  let usuario = await usuarioService.deleteRolById(req.params.usuario_id, req.params.rol_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,usuario))
}

module.exports = {
  v0: {
    list: list,
    getOne: getOne,
    create: create,
    update: update,
    addRol: addRol,
    deleteRol: deleteRol
  }
}
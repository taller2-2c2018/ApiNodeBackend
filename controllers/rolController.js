const models = require('../models/sequelize')
const rolService = require('../services/rolService')(models)
const responser = require('../util/responser')

const list = async function (req, res) {
  let roles = await rolService.findAll(req.query)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,roles))
}

const getOne = async function (req, res) {
  let rol = await rolService.findById(req.params.rol_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,rol))
}

const create = async function (req, res) {
  let rol = await rolService.create(req.body.nombre, req.body.descripcion)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode,rol))
}

const update = async function (req, res) {
  let body = req.body
  let rol = await rolService.update(req.params.rol_id, body)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,rol))
}

const addPermiso = async function (req, res) {
  let rol = await rolService.addPermisoById(req.params.rol_id, req.body.permiso_id)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode,rol))
}

const deletePermiso = async function (req, res) {
  let rol = await rolService.deletePermisoById(req.params.rol_id, req.params.permiso_id)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponse(res.statusCode,rol))
}

module.exports = {
  v0: {
    list: list,
    getOne: getOne,
    create: create,
    update: update,
    addPermiso: addPermiso,
    deletePermiso: deletePermiso
  }
}
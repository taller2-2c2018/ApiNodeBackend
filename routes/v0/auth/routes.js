const express = require('express')
const models = require('../../../models/sequelize')
const router = express.Router()
const jwt = require('jwt-simple')
const moment = require('moment')
const responser = require('../../../util/responser')

const SERVER_ADMINISTRADOR_ID = 1

let createToken = (id, username, permisos,nombrePila,server_id, exp) => {
  let payload = {
    user_id: id,
    username: username,
    permisos: permisos,
    nombre:nombrePila,
    server_id: server_id,
    administrador: (server_id == SERVER_ADMINISTRADOR_ID),
    iat: moment().unix(),
    exp: exp
  }
  return jwt.encode(payload, process.env.TOKEN_SECRET)
}

var usuarios
const {
  check,
  validationResult
} = require('express-validator/check')

usuarios = []

router.post('/', [
  check('username')
    .exists().withMessage('Falta el username')
    .isEmail().withMessage('Falta el username')
    .trim()
    .normalizeEmail(),
  check('password')
    .exists().withMessage('Falta el password')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.mapped()
    })
  }

  let username = req.body.username
  let password = req.body.password

  models.Usuario.findOne({
    where: {
      email: username
    },
    include: [{
      model: models.Rol,
      as: 'Roles',
      include: [{
        model: models.Permiso,
        as: 'Permisos'
      }]
    }]

  }).then(usuario => {
    if (usuario === null) {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    }
    let permisos = usuario.obtenerPermisos()
    usuario.verificarPassword(password).then(() => {
      let exp = moment().add(30, 'days').unix()
      var token = createToken(usuario.id, username, permisos,usuario.nombre,usuario.server_id,exp)
      if (usuarios.indexOf(req.body.username) === -1) {
        usuarios.push(token)
      }
      res.statusCode = responser.codes.OK
      res.json(responser.createSuccessResponseWithMetadata(res.statusCode,{
        token: token,
        expires_at: exp,
      }, 'token'))
    }).catch(function () {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    })
  })
})

module.exports = router
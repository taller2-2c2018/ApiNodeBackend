const express = require('express')
const models = require('../../../models/sequelize')
const router = express.Router()
const jwt = require('jwt-simple')
const moment = require('moment')
const responser = require('../../../util/responser')

const ORGANISMO_JEFATURA_ID = 1

let createToken = (id, username, permisos,nombrePila,nombreOrganismo,organismoId) => {
  let payload = {
    user_id: id,
    username: username,
    permisos: permisos,
    nombre:nombrePila,
    nombre_organismo:nombreOrganismo,
    organismo_id: organismoId,
    organismo_administrador: (organismoId == ORGANISMO_JEFATURA_ID),
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
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
    .isEmail().withMessage('must be an email')
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
    },
    {
      model: models.Organismo,
      as: 'Organismo'
    }
    ]

  }).then(usuario => {
    if (usuario === null) {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    }
    let permisos = usuario.obtenerPermisos()
    usuario.verificarPassword(password).then(() => {
      var token = createToken(usuario.id, username, permisos,usuario.nombre,usuario.Organismo.nombre,usuario.Organismo.id)
      if (usuarios.indexOf(req.body.username) === -1) {
        usuarios.push(token)
      }
      res.statusCode = responser.codes.OK
      res.json(responser.createSuccessResponse(res.statusCode,{
        token: token,
        username: username,
        permisos: permisos,
        nombre: usuario.nombre,
        nombre_organismo: usuario.Organismo.nombre,
        organismo_administrador: (usuario.Organismo.id == ORGANISMO_JEFATURA_ID),
      }))
    }).catch(function () {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    })
  })
})

module.exports = router
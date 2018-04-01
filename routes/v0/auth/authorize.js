const express = require('express')
const models = require('../../../models/sequelize')
const router = express.Router()
const jwt = require('jwt-simple')
const moment = require('moment')
const responser = require('../../../util/responser')

const SERVER_ADMINISTRADOR_ID = 1

let createToken = (id, username, permisos,nombrePila,application_user_id, exp) => {
  let payload = {
    user_id: id,
    username: username,
    permisos: permisos,
    nombre:nombrePila,
    application_user_id: application_user_id,
    administrador: (application_user_id == SERVER_ADMINISTRADOR_ID),
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
    .trim(),
  check('password')
    .exists().withMessage('Falta el password'),
  check('facebook_auth_token')
    .exists().withMessage('Falta el token de facebook')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.mapped()
    })
  }

  let username = req.body.username
  let password = req.body.password
  let facebook_auth_token = req.body.facebook_auth_token

  models.ApplicationUser.findOne({
    where: {
      username: username
    },
  }).then(appUser => {
    if (appUser === null) {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    }
    appUser.verificarUser(password,facebook_auth_token).then(() => {
      let exp = moment().add(30, 'days').unix()
      res.statusCode = responser.codes.OK
      res.json(responser.createSuccessResponseWithMetadata(res.statusCode,{
        token: token,
        expires_at: exp,
      }, 'user'))
    }).catch(function () {
      return res.status(responser.codes.UNPROCESSABLE_ENTITY).json(
        responser.createResponse(responser.codes.UNPROCESSABLE_ENTITY,'Nombre de usuario o password incorrecto',null)
      )
    })
  })
})

module.exports = router
const express = require('express')
const router = express.Router()
const authorizationController = require('../../../controllers/authorizationController')
const authMiddleware = require('../../../routes/v0/auth/middleware')
const {withError} = require('./helpers')

let validateLoggedUser = authMiddleware.checkIsLoggedWithPermission()

// Endpoint para dar de alta token para un usuario, ademas trae otros datos del usuario
/* parametros:
  "facebook_id": "string"
*/
router.post('/',validateLoggedUser, withError(authorizationController.v0.createToken))

module.exports = router
const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/userController')
const authMiddleware = require('../../../routes/v0/auth/middleware')
const {withError} = require('./helpers')

let validateLoggedUser = authMiddleware.checkIsLoggedWithPermission()

// Devuelve toda la información acerca de todos los application users indicados.
router.get('/',validateLoggedUser ,withError(userController.v0.listUsers))

// Endpoint para dar de alta un user. Se ignorarán los campos de id, _rev y lastConnection
/* parametros:
  "createdBy": "string",
  "createdTime": 0,
  "name": "string",
*/
router.post('/',validateLoggedUser, withError(userController.v0.createUser))

// Obtiene toda la información del user
router.get('/:user_id',validateLoggedUser, withError(userController.v0.getUser))

// Modificación de los datos de un user. Se ignorarán los campos de id, createdBy, createdTime y lastConnection
/* Parametros posibles:
  "_rev": "string",
  "name": "string",
*/
router.put('/:user_id',validateLoggedUser, withError(userController.v0.updateUser))

// Endpoint para dar de baja un user
router.delete('/:user_id',validateLoggedUser, withError(userController.v0.deleteUser))

module.exports = router
const express = require('express')

const router = express.Router()
const authMiddleware = require('../auth/middleware')
const permisoController = require('../../../controllers/permisoController')

const {withError} = require('./helpers')
let validarPermisoGetRol = authMiddleware.checkIsLoggedWithPermission('GET_ROLES')

// Listar todos los permisos
router.get('/', validarPermisoGetRol, withError(permisoController.v0.list))

module.exports = router
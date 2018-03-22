const express = require('express')
const router = express.Router()
const authMiddleware = require('../auth/middleware')
const organismoController = require('../../../controllers/organismoController')


let validarPermisoGetUsuario = authMiddleware.checkIsLoggedWithPermission('GET_USUARIOS')
const {withError} = require('./helpers')

// Listar todos los organismo
router.get('/', validarPermisoGetUsuario, withError(organismoController.v0.list))

module.exports = router
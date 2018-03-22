const express = require('express')
const models = require('../../../models/sequelize')

const router = express.Router()
const authMiddleware = require('../auth/middleware')
const rolValidations = require('../validations/rolValidation')(models)
const rolController = require('../../../controllers/rolController')

let validarPermisoGetRol = authMiddleware.checkIsLoggedWithPermission('GET_ROLES')
let validarPermisoEditRol = authMiddleware.checkIsLoggedWithPermission('EDIT_ROLES')

const {withError, expressValidatorMiddleware} = require('./helpers')

// Listar todos los roles
router.get('/', validarPermisoGetRol, withError(rolController.v0.list))

/* GET single rol. */
router.get('/:rol_id([0-9]+)', validarPermisoGetRol, withError(rolController.v0.getOne))

// Crear un rol
router.post('/', validarPermisoEditRol, rolValidations.createValidations, expressValidatorMiddleware, withError(rolController.v0.create))

// Update un rol. Solo hace update de lo que se le pasa { nombre, descripcion}
router.patch('/:rol_id([0-9]+)', validarPermisoEditRol, withError(rolController.v0.update))

// Crear el permiso de un rol
router.post('/:rol_id([0-9]+)/permisos', validarPermisoEditRol, rolValidations.addPermisoARolValidation, expressValidatorMiddleware, withError(rolController.v0.addPermiso))

// Eliminar el permiso de un rol
router.delete('/:rol_id([0-9]+)/permisos/:permiso_id([0-9]+)', validarPermisoEditRol, withError(rolController.v0.deletePermiso))

module.exports = router
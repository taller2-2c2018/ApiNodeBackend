const express = require('express')
const models = require('../../../models/sequelize')
const router = express.Router()
const authMiddleware = require('../auth/middleware')
const usuarioValidations = require('../validations/usuarioValidation')(models)
const usuarioController = require('../../../controllers/usuarioController')

let validarPermisoGetUsuario = authMiddleware.checkIsLoggedWithPermission('GET_USUARIOS')
let validarPermisoEditUsuario = authMiddleware.checkIsLoggedWithPermission('EDIT_USUARIOS')
const {withError, expressValidatorMiddleware} = require('./helpers')

/* GET users listing. with async/await with error wrapping*/
router.get('/', validarPermisoGetUsuario, withError(usuarioController.v0.list))

/* GET user. with async/await  with error wrapping */
router.get('/:usuario_id([0-9]+)', validarPermisoGetUsuario, withError(usuarioController.v0.getOne))

// Crear un usuario
router.post('/', validarPermisoEditUsuario, usuarioValidations.createValidations, expressValidatorMiddleware,withError(usuarioController.v0.create))

// Update un usuario. Solo hace update de lo que se le pasa { password,
// verificacion_password, nombre, organismo_id} No cambia el mail
router.patch('/:usuario_id([0-9]+)', validarPermisoEditUsuario, usuarioValidations.updateValidation, expressValidatorMiddleware,withError(usuarioController.v0.update))

// Agregar rol a usuario
router.post('/:usuario_id([0-9]+)/roles', validarPermisoEditUsuario, usuarioValidations.addRolValidation, expressValidatorMiddleware,withError(usuarioController.v0.addRol))

// Eliminar el rol de un usuario
router.delete('/:usuario_id([0-9]+)/roles/:rol_id([0-9]+)', validarPermisoEditUsuario, withError(usuarioController.v0.deleteRol))

module.exports = router
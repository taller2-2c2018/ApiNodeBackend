const express = require('express')
const router = express.Router()
// const authMiddleware = require('../auth/middleware')
// const checkDerivacionOwnership = require('../auth/checkDerivacionOwnership').checkDerivacionOwnership()
const fileController = require('../../../controllers/fileController')
// const models = require('../../../models/sequelize')
// const derivacionValidations = require('../validations/derivacionValidation')(models)

const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname+'_'+Date.now())
  }
})

const upload = multer({ storage: storage })

// let validarPermisoGetFiles = authMiddleware.checkIsLoggedWithPermission('GET_FILE')
// let validarPermisoEditFiles = authMiddleware.checkIsLoggedWithPermission('EDIT_FILE')
const {withError} = require('./helpers')

// Devuelve toda la información acerca de todos los archivos registrados por un application server 
router.get('/', withError(fileController.v0.listFiles))

// Crea un file de un usuario como admin
router.post('/', upload.single('file'),/*checkDerivacionOwnership,validarPermisoEditFiles,*/ withError(fileController.v0.createFile))

// Crea un file de un usuario como aplicacion
router.post('/upload', upload.single('file'),/*checkDerivacionOwnership,validarPermisoEditFiles,*/ withError(fileController.v0.uploadFile))

// Elimina un file de un usuario
router.delete('/:file_id([0-9]+)', /*checkDerivacionOwnership,validarPermisoEditFiles,*/ withError(fileController.v0.deleteFile))

// Obtiene el file de un usuario 
router.get('/:file_id([0-9]+)', withError(fileController.v0.getFile))

// Modifica un file file de un usuario
/* Parametros posibles:
  "id": "string",
  "_rev": "string",
  "createdTime": date,
  "updatedTime": date,
  "size": "int",
  "filename": "string",
  "resource": "string"
*/
router.put('/:file_id([0-9]+)', withError(fileController.v0.updateFile))

module.exports = router
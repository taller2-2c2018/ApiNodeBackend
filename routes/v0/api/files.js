const express = require('express')
const router = express.Router()
const fileController = require('../../../controllers/fileController')

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

const {withError} = require('./helpers')

// Devuelve toda la información acerca de todos los archivos registrados por un application server 
router.get('/', withError(fileController.v0.listFiles))

// Crea un file de un usuario como admin
/* Parametros posibles:
  "id": "string",
  "_rev": "string",
  "created_at": 0,
  "updated_at": 0,
  "size": 0,
  "filename": "string",
  "resource": "string"
*/
router.post('/', upload.single('file'), withError(fileController.v0.createFile))

// Crea un file de un usuario como aplicacion
router.post('/upload', upload.single('file'), withError(fileController.v0.uploadFile))

// Elimina un file de un usuario
router.delete('/:file_id', withError(fileController.v0.deleteFile))

// Obtiene el file de un usuario 
router.get('/:file_id', withError(fileController.v0.getFile))

// Modifica un file file de un usuario
/* Parametros posibles:
  "id": "string",
  "_rev": "string",
  "created_at": date,
  "updated_at": date,
  "size": "int",
  "filename": "string",
  "resource": "string"
*/
router.put('/:file_id', withError(fileController.v0.updateFile))

module.exports = router
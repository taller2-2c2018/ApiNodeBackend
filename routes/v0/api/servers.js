const express = require('express')
const router = express.Router()
const serverController = require('../../../controllers/serverController')

const {withError} = require('./helpers')

// Devuelve toda la información acerca de todos los application servers indicados.
router.get('/', withError(serverController.v0.listServers))

// Endpoint para dar de alta un servidor. Se ignorarán los campos de id, _rev y lastConnection
/* parametros:
  "createdBy": "string",
  "createdTime": 0,
  "name": "string",
*/
router.post('/', withError(serverController.v0.createServer))

// Obtiene toda la información del servidor
router.get('/:server_id([0-9]+)', withError(serverController.v0.getServer))

// Modificación de los datos de un servidor. Se ignorarán los campos de id, createdBy, createdTime y lastConnection
/* Parametros posibles:
  "_rev": "string",
  "name": "string",
*/
router.put('/:server_id([0-9]+)', withError(serverController.v0.updateserver))

// Endpoint para resetear el token. Debe invalidar el anterior. 
router.post('/:server_id([0-9]+)', withError(serverController.v0.resetToken))

// Endpoint para dar de baja un servidor
router.delete('/:server_id([0-9]+)', withError(serverController.v0.deleteServer))




module.exports = router
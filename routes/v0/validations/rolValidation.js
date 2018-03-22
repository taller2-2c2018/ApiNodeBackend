'use strict'
const {check} = require('express-validator/check')

const messageFaltaNombre = () => {  
  return 'Falta el nombre'
}

const messageFaltaDescripcion = () => {  
  return 'Falta la descripcion'
}

const messageFaltaIdPermiso = () => {  
  return 'Falta el permiso'
}

module.exports = () => {
  return {
    messageFaltaNombre: messageFaltaNombre(),
    messageFaltaDescripcion: messageFaltaDescripcion(),
    messageFaltaIdPermiso: messageFaltaIdPermiso(),
    createValidations: [
      check('nombre')
        .exists()
        .withMessage(messageFaltaNombre()),
      check('descripcion')
        .exists()
        .withMessage(messageFaltaDescripcion())
    ],
    addPermisoARolValidation: [
      check('permiso_id')
        .exists()
        .withMessage(messageFaltaIdPermiso())
    ],
  }
}
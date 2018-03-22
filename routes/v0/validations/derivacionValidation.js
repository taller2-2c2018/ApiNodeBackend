'use strict'
const {check} = require('express-validator/check')

const messageFaltaNota = () => {  
  return 'Falta el texto de la nota'
}

const messageFaltaRespuesta = () => {  
  return 'Ingrese el texto de la respuesta'
}

module.exports = () => {
  return {
    messageFaltaNota: messageFaltaNota(),
    messageFaltaTexto: messageFaltaRespuesta(),
    createNotaValidations: [
      check('nota')
        .exists().withMessage(messageFaltaNota()),
    ],
    createRespuestaValidations: [
      check('respuesta')
        .exists().withMessage(messageFaltaRespuesta()),
      check('es_borrador')
        .optional(true)
        .exists().withMessage(messageFaltaRespuesta()),
    ],
  }
}
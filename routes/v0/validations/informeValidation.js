'use strict'
const {check} = require('express-validator/check')

const messageFaltaPreguntasOriginales = () => {  
  return 'Faltan las preguntas originales'
}

const messageFaltaPreguntasConsolidadas = () => {  
  return 'Faltan las preguntas consolidadas'
}

const messageFaltaFechaRederivacion = () => {  
  return 'Falta la fecha de rederivacion'
}

const messageFaltaFechaRecepcionRespuestas = () => {  
  return 'Falta la fecha limite de recepcion de respuestas'
}

const messageFaltaCamara = () => {  
  return 'Falta el nombre de la camara'
}

const messageFaltaTexto = () => {  
  return 'Ingrese el texto de la pregunta'
}

const messageFaltaAutor = () => {  
  return 'Ingrese el autor de la pregunta'
}

const messageFaltaOrganismo = () => {  
  return 'Ingrese el organismo de la derivacion'
}

const messageFaltaIntroduccion = () => {  
  return 'Ingrese la introduccion de la pregunta'
}

const messageAlMenosUnaPreguntaOriginal = () => {  
  return 'Debe tener al menos una pregunta original'
}

const messageAlMenosUnaPreguntaConsolidada = () => {  
  return 'Debe tener al menos una pregunta consolidada'
}

const messageFaltanDerivaciones = () => {  
  return 'Las preguntas consolidadas deben tener al menos una derivacion'
}

module.exports = () => {
  return {
    messageFaltaPreguntasOriginales: messageFaltaPreguntasOriginales(),
    messageFaltaPreguntasConsolidadas: messageFaltaPreguntasConsolidadas(),
    messageFaltaCamara: messageFaltaCamara(),
    messageFaltaTexto: messageFaltaTexto(),
    messageFaltaAutor: messageFaltaAutor(),
    messageFaltaFechaRederivacion: messageFaltaFechaRederivacion(),
    messageFaltaFechaRecepcionRespuestas: messageFaltaFechaRecepcionRespuestas(),
    messageFaltaOrganismo: messageFaltaOrganismo(),
    messageFaltaIntroduccion: messageFaltaIntroduccion(),
    messageAlMenosUnaPreguntaOriginal: messageAlMenosUnaPreguntaOriginal(),    
    messageAlMenosUnaPreguntaConsolidada: messageAlMenosUnaPreguntaConsolidada(),
    messageFaltanDerivaciones: messageFaltanDerivaciones(),
    createValidations: [
      check('camara')
        .exists().withMessage(messageFaltaCamara()),
    ],
    cerrarInformeValidations: [
      check('fecha_rederivacion')
        .exists().withMessage(messageFaltaFechaRederivacion()),
      check('fecha_recepcion_respuestas')
        .exists().withMessage(messageFaltaFechaRecepcionRespuestas()),
    ],
    createDerivacionValidations: [
      check('organismo_id')
        .exists().withMessage(messageFaltaOrganismo()),
    ],
    createConsolidacionValidations: [
      check('preguntas_consolidadas')
        .exists().withMessage(messageFaltaPreguntasConsolidadas())
        .custom((item)=>Array.isArray(item) && item.length > 0)
        .withMessage(messageAlMenosUnaPreguntaConsolidada())
        .custom((item)=>{
          let result = true
          item.forEach(element => {
            if (!(Array.isArray(element.derivaciones) && element.derivaciones.length > 0))
              result = false
          })
          return result
        })
        .withMessage(messageFaltanDerivaciones())
      ,check('preguntas_originales')
        .exists().withMessage(messageFaltaPreguntasOriginales())
        .custom((item)=>Array.isArray(item) && item.length > 0)
        .withMessage(messageAlMenosUnaPreguntaOriginal())
    ],
    addPreguntaAInformeValidation: [
      check('autor_id')
        .exists().withMessage(messageFaltaAutor())
        .trim().not().isEmpty().withMessage(messageFaltaAutor()),
      check('pregunta')
        .exists().withMessage(messageFaltaTexto())
        .trim().not().isEmpty().withMessage(messageFaltaTexto()),
      check('introduccion')
        .optional(true)
        .exists().withMessage(messageFaltaIntroduccion())
        .trim().not().isEmpty().withMessage(messageFaltaIntroduccion()),
    ],
  }
}
'use strict'
const {check} = require('express-validator/check')

const messageFaltaUsername = () => {  
  return 'Falta el username'
}

const messageFaltaPassword = () => {  
  return 'Falta el password'
}

const messageFaltaNombre = () => {  
  return 'Falta el nombre'
}

const messageFaltaRol = () => {  
  return 'Falta el rol'
}

const messageFaltaOrganismo = () => {  
  return 'Falta el organismo'
}

const messageMailInvalido = () => {  
  return 'Debe ingresar un mail válido'
}

const messageNumeroInvalido = () => {  
  return 'El número ingresado es inválido'
}

module.exports = (models) => {
  return {
    messageFaltaUsername: messageFaltaUsername(),
    messageFaltaPassword: messageFaltaPassword(),
    messageFaltaNombre: messageFaltaNombre(),
    messageFaltaRol: messageFaltaRol(),
    messageFaltaOrganismo: messageFaltaOrganismo(),
    messageMailInvalido: messageMailInvalido(),
    messageNumeroInvalido: messageNumeroInvalido(),
    createValidations: [
      check('email')
        .exists()
        .withMessage(messageFaltaUsername())
        .isEmail()
        .withMessage(messageMailInvalido())
        .trim()
        .normalizeEmail(),
      check('verificacion_email')
        .exists()
        .withMessage(messageFaltaUsername())
        .isEmail()
        .withMessage(messageMailInvalido())
        .trim()
        .normalizeEmail(),
      check('password')
        .exists()
        .withMessage(messageFaltaPassword()),
      check('verificacion_password')
        .exists()
        .withMessage(messageFaltaPassword()),
      check('nombre')
        .exists()
        .withMessage(messageFaltaNombre()),
      check('telefono')
        .optional()
        .matches(models.Usuario.getTelefonoRegex())
        .withMessage(messageNumeroInvalido())
        .trim(),
      check('celular')
        .optional()
        .matches(models.Usuario.getTelefonoRegex())
        .withMessage(messageNumeroInvalido())
        .trim(),
      check('organismo_id')
        .exists()
        .withMessage(messageFaltaOrganismo())
    ],
    updateValidation: [
      check('telefono')
        .optional()
        .matches(models.Usuario.getTelefonoRegex())
        .withMessage(messageNumeroInvalido())
        .trim(),
      check('celular')
        .optional()
        .matches(models.Usuario.getTelefonoRegex())
        .withMessage(messageNumeroInvalido())
        .trim()
    ],
    addRolValidation: [
      check('rol_id')
        .exists()
        .withMessage(messageFaltaRol())
    ],
  }
}
'use strict'

const getUsuarioNoAutorizado = () =>{
  var err = new Error('Usuario no autorizado')
  err.status = 401
  return err
}

const getTokenExpired = () =>{
  var err = new Error('El token expiro')
  err.status = 404
  return err
}

const getServiceError = (msg) =>{
  var err = {}
  err.msg = msg
  err.status = 500
  return err
}

const getServiceErrorNotFound = (msg) =>{
  var err = {}
  err.msg = msg
  err.status = 404
  return err
}

const getServiceErrorAlreadyExists = (msg) =>{
  var err = {}
  err.msg = msg
  err.status = 409
  return err
}

const getServiceErrorNotMatch = (msg, value1, value2) =>{
  var err = {}
  err.msg = msg+': '+value1+' <> '+value2
  err.status = 409
  return err
}

const getServiceErrorBadRequest = (msg) =>{
  var err = {}
  err.msg = msg
  err.status = 400
  return err
}

exports.getUsuarioNoAutorizado = getUsuarioNoAutorizado
exports.getTokenExpired = getTokenExpired
exports.getServiceError = getServiceError
exports.getServiceErrorNotFound = getServiceErrorNotFound
exports.getServiceErrorAlreadyExists = getServiceErrorAlreadyExists
exports.getServiceErrorNotMatch = getServiceErrorNotMatch
exports.getServiceErrorBadRequest = getServiceErrorBadRequest
'use strict'

const errorGetter = require('../util/errors')
const Op = require('sequelize').Op

const getSeachQueryFromParams = (queryParams) => {
  let whereClause = {}
  if (queryParams.email) 
    whereClause.email = {
      [Op.like]: '%' + queryParams.email + '%'
    }
  if (queryParams.nombre) 
    whereClause.nombre = {
      [Op.like]: '%' + queryParams.nombre + '%'
    }
  return whereClause
}

const validateParms = (params) => {
  let errors = []
  if (params.password) {
    if (params.password !== params.verificacion_password) 
      errors.push(errorGetter.getServiceErrorNotMatch('Los password no coinciden', params.password, params.verificacion_password))
  }
  return errors
}

const getFieldsFromParams = (params) => {
  let fieldsWithoutEmail = Object
    .keys(params)
    .filter(item => item !== 'email')
  return fieldsWithoutEmail
}

const getOrderFromParams = (queryParams) => {
  let validOrders = ['nombre', 'email', 'id']
  let orderClause = []
  if (queryParams.sort_by) {
    var array = queryParams
      .sort_by
      .split(',')
    array.forEach(function (entry) {
      let thisOrder = []
      let orderChar = entry.slice(0, 1)
      let order = (orderChar === '-')
        ? 'DESC'
        : 'ASC'
      let field = (orderChar === '-')
        ? entry.slice(1)
        : entry
      if (validOrders.indexOf(field) !== -1) {
        thisOrder.push(field)
        thisOrder.push(order)
        orderClause.push(thisOrder)
      }
    })
  }
  return orderClause
}

module.exports = (models) => {
  return {
    findAllWithPermissions: (queryParams) => {
      let promise = new Promise((resolve, reject) => {
        models
          .Usuario
          .findAll({
            where: getSeachQueryFromParams(queryParams),
            order: getOrderFromParams(queryParams),
            include: [
              {
                model: models.Rol,
                as: 'Roles',
                include: [
                  {
                    model: models.Permiso,
                    as: 'Permisos'
                  }
                ]
              }
            ]
          })
          .then((usuarios) => {
            resolve(usuarios)
          })
          .catch((e) => {
            reject(errorGetter.getServiceError(e))
          })
      })
      return promise
    },
    findById: (id) => {
      let promise = new Promise((resolve, reject) => {
        models
          .Usuario
          .findById(id, {
            include: [
              {
                model: models.Rol,
                as: 'Roles',
                include: [
                  {
                    model: models.Permiso,
                    as: 'Permisos'
                  }
                ]
              }
            ]
          })
          .then((usuario) => {
            if (usuario !== null) {
              resolve(usuario)
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Usuario.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    create: (nombre, email, verificacion_email, password, verificacion_password, telefono, celular) => {
      let promise = new Promise((resolve, reject) => {
        if (email !== verificacion_email) 
          return reject(errorGetter.getServiceErrorNotMatch(models.Usuario.getMsgEmailsNoMatch(), email, verificacion_email))
        if (password !== verificacion_password) 
          return reject(errorGetter.getServiceErrorNotMatch(models.Usuario.getMsgPwdsNoMatch(), password, verificacion_password))
        models
          .Usuario
          .create({
            nombre: nombre,
            email: email,
            password: password,
            celular: celular,
            telefono: telefono
          })
          .then((usuario) => {
            resolve(usuario)
          })
          .catch((e) => {
            return reject(errorGetter.getServiceError(e.errors))
          })
      })
      return promise
    },
    update: (usuario_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models
          .Usuario
          .findById(usuario_id, {})
          .then((usuario) => {
            if (usuario !== null) {
              let errors = validateParms(params)
              let fields = getFieldsFromParams(params)
              if (errors.length === 0) {
                usuario
                  .update(params, {fields: fields})
                  .then((usuario) => {
                    resolve(usuario)
                  })
                  .catch((e) => {
                    return reject(errorGetter.getServiceError('Error inesperado'))
                  })
              } else {
                reject(errorGetter.getServiceError(errors))
              }
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Usuario.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    addRolById: (usuarioId, rolId) => {
      let promise = new Promise((resolve, reject) => {
        models
          .Usuario
          .findById(usuarioId, {
            include: [
              {
                model: models.Rol,
                as: 'Roles',
                include: [
                  {
                    model: models.Permiso,
                    as: 'Permisos'
                  }
                ]
              }
            ]
          })
          .then((usuario) => {
            if (usuario !== null) {
              models
                .Rol
                .findById(rolId)
                .then((rol) => {
                  if (rol !== null) {
                    usuario
                      .addRol(rol)
                      .then((usuarioRol) => {
                        if (JSON.stringify(usuarioRol) !== '[]') {
                          resolve(usuario)
                        } else {
                          reject(errorGetter.getServiceErrorAlreadyExists(models.Usuario.getMsgRolYaExistenteParaUsuario()))
                        }
                      })
                  } else {
                    reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
                  }
                })
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Usuario.getMsgInexistente()))
            }
          })
      })
      return promise
    },
    deleteRolById: (usuarioId, rolId) => {
      let promise = new Promise((resolve, reject) => {
        models
          .Usuario
          .findById(usuarioId)
          .then((usuario) => {
            if (usuario !== null) {
              models
                .Rol
                .findById(rolId)
                .then((rol) => {
                  if (rol !== null) {
                    usuario
                      .removeRol(rol)
                      .then((usuarioRol) => {
                        if (usuarioRol !== 0) {
                          resolve(usuario)
                        } else {
                          reject(errorGetter.getServiceErrorAlreadyExists(models.Usuario.getMsgRolInexistenteParaUsuario()))
                        }
                      })
                  } else {
                    reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
                  }
                })
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Usuario.getMsgInexistente()))
            }
          })
      })
      return promise
    }
  }
}
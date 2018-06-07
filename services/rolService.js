'use strict'

const errorGetter = require('../util/errors')

const validateParms = (params) => {
  let errors = []
  return errors
}

const getFieldsFromParams = (params) => {
  let fields = Object.keys(params)
  return fields
}

const getOrderFromParams = (queryParams) => {
  let validOrders = ['nombre', 'descripcion', 'id', 'created_at']
  let orderClause = []
  if (queryParams.sort_by) {
    var array = queryParams.sort_by.split(',')
    array.forEach(function (entry) {
      let thisOrder = []
      let orderChar = entry.slice(0, 1)
      let order = (orderChar === '-') ? 'DESC' : 'ASC'
      let field = (orderChar === '-') ? entry.slice(1) : entry
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
    findAll: (query) => {
      return models.Rol.findAll({
        include: [{
          model: models.Permiso,
          as: 'Permisos'
        }],
        order: getOrderFromParams(query)
      })

    },
    findById: (id) => {
      let promise = new Promise((resolve, reject) => {

        models.Rol.findById(id, {
          include: [{
            model: models.Permiso,
            as: 'Permisos'
          }]
        }).then((rol) => {
          if (rol !== null) {
            resolve(rol)
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
          }
        })
      })
      return promise
    },
    create: (myName, myDescription) => {
      let promise = new Promise((resolve, reject) => {
        return models.Rol.create({
          nombre: myName,
          descripcion: myDescription
        }).then((rol) => {
          resolve(rol)
        }).catch((e) => {
          reject(errorGetter.getServiceError(e.errors))
        })
      })
      return promise
    },
    update: (rol_id, params) => {
      let promise = new Promise((resolve, reject) => {
        models.Rol.findById(rol_id, {}).then((rol) => {
          if (rol !== null) {
            let errors = validateParms(params)
            let fields = getFieldsFromParams(params)
            if (errors.length === 0) {
              rol.update(params, {
                fields: fields
              }).then((rol) => {
                resolve(rol)
              })
                .catch((e) => {
                  return reject(errorGetter.getServiceError(e.errors))
                })
            } else {
              reject(errorGetter.getServiceError(errors))
            }
          } else {
            reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
          }
        })
      })
      return promise
    },
    addPermisoById: (rolId, permisoId) => {
      let promise = new Promise((resolve, reject) => {
        models.Rol.findById(rolId).then(
          (rol) => {
            if (rol !== null) {
              models.Permiso.findById(permisoId).then(
                (permiso) => {
                  if (permiso !== null) {
                    rol.addPermiso(permiso).then((rolPermiso) => {
                      if (JSON.stringify(rolPermiso) !== '[]') {
                        resolve(rol)
                      } else {
                        reject(errorGetter.getServiceErrorAlreadyExists(models.Permiso.getMsgYaExistente()))
                      }
                    })
                  } else {
                    reject(errorGetter.getServiceErrorNotFound(models.Permiso.getMsgInexistente()))
                  }
                }
              )
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
            }
          }
        )
      })
      return promise
    },
    deletePermisoById: (rolId, permisoId) => {
      let promise = new Promise((resolve, reject) => {
        models.Rol.findById(rolId).then(
          (rol) => {
            if (rol !== null) {
              models.Permiso.findById(permisoId).then(
                (permiso) => {
                  if (permiso !== null) {
                    rol.removePermiso(permiso).then((rolPermiso) => {
                      if (rolPermiso !== 0) {
                        resolve(rol)
                      } else {
                        reject(errorGetter.getServiceErrorAlreadyExists(models.Permiso.getMsgInexistente()))
                      }
                    })
                  } else {
                    reject(errorGetter.getServiceErrorNotFound(models.Permiso.getMsgInexistente()))
                  }
                })
            } else {
              reject(errorGetter.getServiceErrorNotFound(models.Rol.getMsgInexistente()))
            }
          }
        )
      })
      return promise
    }
  }
}
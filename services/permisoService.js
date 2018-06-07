'use strict'

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
      return models.Permiso.findAll({
        order: getOrderFromParams(query)
      })
    }
  }
}
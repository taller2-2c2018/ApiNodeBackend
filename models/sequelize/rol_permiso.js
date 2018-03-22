'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const RolPermiso = sequelize.define('RolPermiso', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    underscored: true,
    tableName: 'rol_permiso'
  })

  return RolPermiso
}
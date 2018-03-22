'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const UsuarioRol = sequelize.define('UsuarioRol', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    underscored: true,
    tableName: 'usuario_rol'
  })

  return UsuarioRol
}
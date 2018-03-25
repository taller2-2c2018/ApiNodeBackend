'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const Organismo = sequelize.define('Organismo', {
    nombre: Sequelize.STRING,
    sigla: Sequelize.STRING,

  }, {
    timestamps: true,
    underscored: true,
    tableName: 'organismo'
  })

  Organismo.associate = function (models) {
    Organismo.hasMany(models.Usuario)
  }

  return Organismo
}
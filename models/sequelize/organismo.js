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
    Organismo.hasMany(models.Derivacion, {as: 'Derivaciones'})
    Organismo.hasMany(models.AnexoRespuesta, {as: 'Anexos'})    
  }

  return Organismo
}
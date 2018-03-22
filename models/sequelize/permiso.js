'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const Permiso = sequelize.define('Permiso', {
    nombre: Sequelize.STRING,
    descripcion: Sequelize.STRING,

  }, {
    timestamps: true,
    underscored: true,
    tableName: 'permiso'
  })

  Permiso.getMsgInexistente = function () {
    return 'Permiso inexistente'
  }
  Permiso.getMsgYaExistente = function () {
    return 'Permiso ya inexistente'
  }
  // Adding a class level method
  Permiso.associate = function (models) {
    Permiso.belongsToMany(models.Rol, {
      as: 'Roles',
      through: {
        model: models.RolPermiso
      },
      foreignKey: 'permiso_id' 
    })

  }
  return Permiso
}
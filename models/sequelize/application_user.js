'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const ApplicationUser = sequelize.define('ApplicationUser', {
    _rev: Sequelize.STRING,
    application_owner: Sequelize.STRING,
    username: Sequelize.STRING, //Nombre del usuario en la aplicación
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'application_user'
  })

  // ApplicationUser.associate = function (models) {
  //   ApplicationUser.belongsTo(models.Usuario)
  // }

  return ApplicationUser
}

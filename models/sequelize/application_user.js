'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const ApplicationUser = sequelize.define('ApplicationUser', {
    _rev: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    facebook_auth_token: Sequelize.STRING,
    nombre: Sequelize.STRING,
    apellido: Sequelize.STRING,
    fecha_nacimiento: Sequelize.STRING,
    facebook_id: Sequelize.STRING,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'application_user'
  })

  ApplicationUser.getMsgInexistente = function(){
    return 'User inexistente'
  }

  ApplicationUser.associate = function (models) {
    ApplicationUser.belongsTo(models.Server, {
      foreignKey: 'server_id',
      targetKey: 'id'
    })
  }

  return ApplicationUser
}

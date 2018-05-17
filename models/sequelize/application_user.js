'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const ApplicationUser = sequelize.define('ApplicationUser', {
    _rev: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    facebook_auth_token: Sequelize.STRING,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'application_user'
  })

  ApplicationUser.associate = function (models) {
    ApplicationUser.belongsTo(models.Server, {
      foreignKey: 'server_id',
      targetKey: 'id'
    })
  }

  return ApplicationUser
}

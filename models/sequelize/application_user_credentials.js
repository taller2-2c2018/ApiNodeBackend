'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const ApplicationUserCredentials = sequelize.define('ApplicationUserCredentials', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    facebookAuthToken: Sequelize.STRING,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'application_user_credentials'
  })

  ApplicationUserCredentials.associate = function (models) {
    ApplicationUserCredentials.belongsTo(models.ApplicationUser)
  }

  return ApplicationUserCredentials
}

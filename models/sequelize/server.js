'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const Server = sequelize.define('Server', {
    name: Sequelize.STRING,
    url: Sequelize.STRING,
    _rev: Sequelize.STRING,
    last_connection: Sequelize.DATE,

  }, {
    timestamps: true,
    underscored: true,
    tableName: 'server'
  })

  Server.associate = function (models) {
    Server.belongsTo(models.Usuario)
  }

  return Server
}
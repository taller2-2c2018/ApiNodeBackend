'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const ServerLog = sequelize.define('ServerLog', {
    type: Sequelize.STRING,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'server_log'
  })

  ServerLog.associate = function (models) {
    ServerLog.belongsTo(models.Server, {
      foreignKey: 'server_id',
      targetKey: 'id'
    })
  }

  return ServerLog
}

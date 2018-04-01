'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const Server = sequelize.define('Server', {
    pk: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: Sequelize.STRING,
    name: Sequelize.STRING,
    url: Sequelize.STRING,
    _rev: Sequelize.STRING,
    last_connection: Sequelize.DATE,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'server'
  })

  Server.getMsgInexistente = function(){
    return 'Servidor inexistente'
  }

  Server.associate = function (models) {
    Server.belongsTo(models.Usuario)
  }

  return Server
}
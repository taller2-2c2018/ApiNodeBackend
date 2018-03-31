'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const FileApplicationUser = sequelize.define('FileApplicationUser', {
    pk: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: Sequelize.STRING,
    filename: Sequelize.STRING,
    filename_original: Sequelize.STRING,
    resource: Sequelize.STRING, // url absoluta
    visible: Sequelize.BOOLEAN,
    _rev: Sequelize.STRING,
    size: Sequelize.INTEGER,
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'file',
    indexes: [
      {
        unique: false,
        fields: ['id']
      }
    ]
  })

  FileApplicationUser.getMsgInexistente = function(){
    return 'Archivo inexistente'
  }

  FileApplicationUser.associate = function (models) {
    FileApplicationUser.belongsTo(models.ApplicationUser)
    FileApplicationUser.belongsTo(models.Server)
  }

  return FileApplicationUser
}
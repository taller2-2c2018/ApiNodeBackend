
'use strict'

const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const basename  = path.basename(module.filename)
const db        = {}

const config    = {
  operatorsAliases: Sequelize.Op
}

// const handleConnectionError = function(){
// }
let sequelize
if (config.use_env_variable) {
  sequelize= new Sequelize(process.env[config.use_env_variable])
} else {
  if (process.env.PRODUCTION_HEROKU){
    sequelize = new Sequelize(process.env.DB_CONNECTION_PROD, config)
  } else {
    sequelize = new Sequelize(process.env.DB_CONNECTION, config)
  }
}




fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename)
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})


db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

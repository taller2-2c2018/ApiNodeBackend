'use strict'
var Sequelize = require('sequelize')

module.exports = function (sequelize) {

  const Rol = sequelize.define('Rol', {
    nombre: {
      type: Sequelize.STRING,
      isUnique: true,
      validate: {
        isUnique: function (value, next) {
          var self = this
          Rol
            .find({
              where: {
                nombre: value
              }
            })
            .then(function (rol) {
              // reject if a different user wants to use the same email
              if (rol && self.id !== rol.id) {
                return next('Nombre de rol ya en uso')
              }
              return next()
            })
            .catch(function (err) {
              return next(err)
            })
        }
      }
    },
    descripcion: Sequelize.STRING
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'rol',
    indexes: [// Create a unique index
      {
        unique: true,
        fields: ['nombre']
      }
    ]
  })

  Rol.getMsgInexistente = function () {
    return 'Rol inexistente'
  }


  // Adding a class level method
  Rol.associate = function (models) {
    Rol.belongsToMany(models.Usuario, {
      as: 'Usuarios',
      through: {
        model: models.UsuarioRol
      },
      foreignKey: {
        name: 'rol_id',
        allowNull: true,
        unique: true
      }
    })

    Rol.belongsToMany(models.Permiso, {
      as: 'Permisos',
      through: {
        model: models.RolPermiso
      },
      foreignKey: {
        name: 'rol_id',
        allowNull: true,
        unique: true
      }
    })

  }
  return Rol
}
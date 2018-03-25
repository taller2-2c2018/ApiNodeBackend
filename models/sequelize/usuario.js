'use strict'
var bcrypt = require('bcrypt')
var Sequelize = require('sequelize')

module.exports = function (sequelize) {
  var Usuario = sequelize.define('Usuario', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [
          1, 255
        ],
        isUnique: function (value, next) {
          var self = this
          Usuario
            .find({
              where: {
                email: value
              }
            })
            .then(function (usuario) {
              if (usuario && self.id !== usuario.id) {
                return next('Email ya en uso por otro usuario')
              }
              return next()
            })
            .catch(function (err) {
              return next(err)
            })
        }
      }
    },
    telefono: Sequelize.STRING,
    celular: Sequelize.STRING,
    nombre: Sequelize.STRING,
    password: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'usuario',
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  })

  // Adding a class level method
  Usuario.associate = function (models) {
    Usuario.belongsToMany(models.Rol, {
      as: {
        singular: 'Rol',
        plural: 'Roles'
      },
      through: {
        model: models.UsuarioRol
      },
      foreignKey: {
        name: 'usuario_id',
        allowNull: true,
        unique: true
      }
    })
    Usuario.belongsTo(models.Organismo)
  }

  Usuario.getMsgEmailsNoMatch = function () {
    return 'Los emails no coinciden'
  }
  Usuario.getMsgPwdsNoMatch = function () {
    return 'Los password no coinciden'
  }
  Usuario.getMsgInexistente = function () {
    return 'Usuario inexistente'
  }
  Usuario.getMsgRolInexistenteParaUsuario = function () {
    return 'Rol no existente para el usuario'
  }

  Usuario.getMsgRolYaExistenteParaUsuario = function () {
    return 'Rol ya existente para el usuario'
  }

  Usuario.getTelefonoRegex = function () {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{2,6}$/im
  }

  Usuario.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, bcrypt.genSaltSync(10))
      .then(hashedPw => {
        user.password = hashedPw
      })
  })

  Usuario.beforeUpdate((user, options) => {
    return bcrypt
      .hash(user.password, bcrypt.genSaltSync(10))
      .then(hashedPw => {
        user.password = hashedPw
      })
  })

  Usuario.prototype.verificarPassword = function (password) {
    var current_password = this.password
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, current_password, (err, isMatch) => {
        if (err) 
          return reject(err)
        if (!isMatch) 
          return reject(new Error('Las contraseñas no coinciden'))
        resolve()
      })
    })
  }

  Usuario.prototype.obtenerPermisos = function () {
    let permisos = []
    for (const rol of this.Roles) {
      for (const permiso of rol.Permisos) {
        permisos.push(permiso.nombre)
      }
    }
    return permisos
  }

  return Usuario
}
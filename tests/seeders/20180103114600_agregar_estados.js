'use strict'
var bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('estado_pregunta_original', [{
      id: 1,
      nombre: 'Pendiente',
      default: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 2,
      nombre: 'Aceptada',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 3,
      nombre: 'Unificada',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 4,
      nombre: 'No Aplica',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 5,
      nombre: 'Rechazada',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }], {}).then(function () {
      return queryInterface.bulkInsert('estado_pregunta_consolidada', [{
        id: 1,
        nombre: 'Pendiente',
        default: true,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        id: 2,
        nombre: 'Derivada',
        default: false,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        id: 3,
        nombre: 'Consolidada',
        default: false,
        created_at: new Date(),
        updated_at: new Date()
      }], {}).then(function () {
        return queryInterface.bulkInsert('motivo_consolidacion', [{
          id: 1,
          nombre: 'Motivo 1',
          default: true,
          created_at: new Date(),
          updated_at: new Date()
        }, {
          id: 2,
          nombre: 'Motivo 2',
          default: false,
          created_at: new Date(),
          updated_at: new Date()
        }, {
          id: 3,
          nombre: 'Motivo 3',
          default: false,
          created_at: new Date(),
          updated_at: new Date()
        }], {}).then(function () {
          return queryInterface.bulkInsert('estado_derivacion', [{
            id: 1,
            nombre: 'Pendiente confirmacion',
            default: true,
            created_at: new Date(),
            updated_at: new Date()
          }, {
            id: 2,
            nombre: 'Pendiente aceptacion',
            default: false,
            created_at: new Date(),
            updated_at: new Date()
          }, {
            id: 3,
            nombre: 'Pendiente respuesta',
            default: false,
            created_at: new Date(),
            updated_at: new Date()
          }, {
            id: 4,
            nombre: 'Rechazada',
            default: false,
            created_at: new Date(),
            updated_at: new Date()
          }, {
            id: 5,
            nombre: 'Respondida',
            default: false,
            created_at: new Date(),
            updated_at: new Date()
          }, {
            id: 6,
            nombre: 'Terminada',
            default: false,
            created_at: new Date(),
            updated_at: new Date()
          }], {})
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {})
    */
  }
}
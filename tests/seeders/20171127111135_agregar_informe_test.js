'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('estado_informe', [{
      id: 1,
      nombre: 'Pendiente',
      default: true,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 2,
      nombre: 'Cerrado',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 3,
      nombre: 'Definitivo',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
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
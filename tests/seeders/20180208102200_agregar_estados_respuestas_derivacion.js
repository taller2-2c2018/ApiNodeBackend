'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('estado_respuesta_derivacion', [{
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
      nombre: 'Rechaza',
      default: false,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {})
    */
  }
}
'use strict'
var bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organismo', [{
      nombre: 'Ministerio de Interior, Obras Públicas y Vivienda',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Salud',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'ANSES',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Energía y Minería',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Educación y Deportes',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Justicia y Derechos Humanos',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Hacienda',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Trabajo, Empleo y Seguridad Social',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Relaciones Exteriores y Culto',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Transporte',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Defensa',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Producción',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Agroindustria',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Finanzas',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'PAMI',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Consejo Nacional de Políticas Sociales',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Seguridad',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Desarrollo Social',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Plan Belgrano',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Banco Central',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Comunicaciones',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Modernización',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'SEDRONAR',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Sistema Federal de Medios Públicos',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Ciencia, Tecnología e Innovación Productiva',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Ministerio de Ambiente y Desarrollo Sustentable',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'AABE',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Agencia Federal de Inteligencia',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'SIGEN',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'ENACOM',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      nombre: 'Secretaría General de la Presidencia',
      sigla: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    ])
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
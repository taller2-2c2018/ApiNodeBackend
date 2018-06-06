module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('application_user', 'nombre', Sequelize.STRING, {
    }).then(function () {
      return queryInterface.addColumn('application_user', 'apellido', Sequelize.STRING, {
        after: 'nombre'
      })
    }).then(function () {
      return queryInterface.addColumn('application_user', 'fecha_nacimiento', Sequelize.STRING, {
        after: 'apellido'
      })
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('ALTER TABLE application_user DROP COLUMN nombre;')
      .then(function () {
        return queryInterface.sequelize.query('ALTER TABLE application_user DROP COLUMN apellido;')
      }).then(function () {
        return queryInterface.sequelize.query('ALTER TABLE application_user DROP COLUMN fecha_nacimiento;')
      })
  }
} 
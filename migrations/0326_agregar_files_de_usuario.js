module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuario', 'telefono', Sequelize.STRING, {
      after: 'organismo_id'
    }).then(function () {
      return queryInterface.addColumn('usuario', 'celular', Sequelize.STRING, {
        after: 'telefono'
      })
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('ALTER TABLE usuario DROP COLUMN telefono;')
      .then(function () {
        return queryInterface.sequelize.query('ALTER TABLE usuario DROP COLUMN celular;')
      })
  }
}
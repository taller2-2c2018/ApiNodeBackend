module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('file', 'data', Sequelize.BLOB, {
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('ALTER TABLE file DROP COLUMN data;')
  }
} 
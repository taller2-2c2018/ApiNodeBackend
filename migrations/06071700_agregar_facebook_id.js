module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('application_user', 'facebook_id', Sequelize.STRING, {
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('ALTER TABLE application_user DROP COLUMN facebook_id;')
  }
} 
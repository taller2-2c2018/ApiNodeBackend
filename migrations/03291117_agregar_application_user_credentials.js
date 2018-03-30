module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('application_user_credentials', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      facebookAuthToken: Sequelize.STRING,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('application_user_credentials')
  }
}
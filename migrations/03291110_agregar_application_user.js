module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('application_user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      _rev: Sequelize.STRING,
      application_owner: Sequelize.STRING,
      username: Sequelize.STRING, //Nombre del usuario en la aplicación
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('application_user')
  }
}
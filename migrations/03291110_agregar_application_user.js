module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('application_user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      _rev: Sequelize.STRING,
      server_id: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      facebook_auth_token: Sequelize.STRING,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE application_user ADD CONSTRAINT application_user_server_id_fk FOREIGN KEY (server_id) REFERENCES server (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('application_user')
  }
}
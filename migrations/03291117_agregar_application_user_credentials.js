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
      facebook_auth_token: Sequelize.STRING,
      application_user_id: Sequelize.INTEGER,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE application_user_credentials ADD CONSTRAINT application_user_credentials_application_user_id_fk FOREIGN KEY (application_user_id) REFERENCES application_user (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('application_user_credentials')
  }
}
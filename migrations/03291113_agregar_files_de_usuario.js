module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('file', {
      pk:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id: { 
        type: Sequelize.STRING,
        unique: true,
      },
      filename: Sequelize.STRING,
      filename_original: Sequelize.STRING,
      resource: Sequelize.STRING, // url absoluta
      visible: Sequelize.BOOLEAN,
      _rev: Sequelize.STRING,
      size: Sequelize.INTEGER,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      server_id: Sequelize.STRING,
      application_user_id: Sequelize.INTEGER,
    }).then(function () {
      return queryInterface.sequelize.query('CREATE INDEX idx_file_id ON file (id);')
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE file ADD CONSTRAINT file_application_user_id_fk FOREIGN KEY (application_user_id) REFERENCES application_user (id) MATCH SIMPLE;')
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE file ADD CONSTRAINT file_server_id_fk FOREIGN KEY (server_id) REFERENCES server (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('file')
  }
}
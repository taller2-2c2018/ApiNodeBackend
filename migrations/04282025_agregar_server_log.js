module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('server_log', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      server_id: Sequelize.STRING,
      usuario_id: Sequelize.INTEGER,
      type: Sequelize.STRING,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE server_log ADD CONSTRAINT server_log_server_id_fk FOREIGN KEY (server_id) REFERENCES server (id) MATCH SIMPLE;')
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE server_log ADD CONSTRAINT server_log_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuario (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('server_log')
  }
}
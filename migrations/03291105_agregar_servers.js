module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('server', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
      url: Sequelize.STRING,
      _rev: Sequelize.STRING,
      last_connection: Sequelize.DATE,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      usuario_id: Sequelize.INTEGER,
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE server ADD CONSTRAINT server_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuario (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('servers')
  }
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('file_usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filename: Sequelize.STRING,
      filename_original: Sequelize.STRING,
      visible: Sequelize.BOOLEAN,
      tamanio: Sequelize.INTEGER,
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      usuario_id: Sequelize.INTEGER,
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE file ADD CONSTRAINT file_usuario_id_fk FOREIGN KEY (usuario_id) REFERENCES usuario (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('file')
  }
}
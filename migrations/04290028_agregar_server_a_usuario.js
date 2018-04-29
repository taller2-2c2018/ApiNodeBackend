module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuario', 'server_id', Sequelize.STRING, {
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE usuario ADD CONSTRAINT usuario_server_id_fk FOREIGN KEY (server_id) REFERENCES server (id) MATCH SIMPLE;')
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('ALTER TABLE usuario DROP COLUMN server_id;')
  }
} 
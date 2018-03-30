module.exports = {

  up: (queryInterface) => {
    return queryInterface.sequelize.query('CREATE INDEX idx_rol_nombre ON rol (nombre);')
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query('DROP INDEX idx_rol_nombre;')
  }
}
module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query("CREATE INDEX idx_rol_nombre ON rol (nombre);")
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query("DROP INDEX idx_rol_nombre;")
    }
}
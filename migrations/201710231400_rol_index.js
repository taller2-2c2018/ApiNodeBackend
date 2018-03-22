module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query("ALTER TABLE rol ADD UNIQUE INDEX idx_rol_nombre (nombre(50));")

    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query("ALTER TABLE rol DROP INDEX idx_rol_nombre;")
    }
}
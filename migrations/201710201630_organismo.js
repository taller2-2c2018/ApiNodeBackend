module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('organismo', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                // Timestamps
                created_at: Sequelize.DATE,
                updated_at: Sequelize.DATE,
                sigla: Sequelize.STRING,
                nombre: Sequelize.STRING,
            }).then(function () {
                return queryInterface.addColumn('usuario', 'organismo_id', Sequelize.INTEGER, {
                    after: 'password'
                })
            })
            .then(function () {
                return queryInterface.sequelize.query("ALTER TABLE usuario ADD CONSTRAINT usuario_organismo_id_fk FOREIGN KEY (organismo_id) REFERENCES organismo (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;")
            })

    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query("UPDATE usuario SET organismo_id = null where organismo_id is not null;")
            .then(function () {
                return queryInterface.sequelize.query("ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_organismo_id_fk`;")
                    .then(function () {
                        return queryInterface.dropTable('organismo')
                    })
            })
    }
}
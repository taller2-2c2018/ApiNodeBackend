module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usuario', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      email: Sequelize.STRING,
      nombre: Sequelize.STRING,
      password: Sequelize.STRING
    }).then(function () {
      return queryInterface.sequelize.query('CREATE INDEX idx_user_email ON usuario (email);')
    }).then(function () {
      return queryInterface.createTable('rol', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        nombre: Sequelize.STRING,
        descripcion: Sequelize.STRING
      })
    }).then(function () {
      return queryInterface.createTable('permiso', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        nombre: Sequelize.STRING,
        descripcion: Sequelize.STRING
      })
    }).then(function () {
      return queryInterface.createTable('usuario_rol', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // Timestamps
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        rol_id: Sequelize.INTEGER,
        usuario_id: Sequelize.INTEGER
      })
    }).then(function () {
      return queryInterface.sequelize.query('ALTER TABLE usuario_rol ADD CONSTRAINT user_rol_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES rol (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;')
    })
      .then(function () {
        return queryInterface.sequelize.query('ALTER TABLE usuario_rol ADD CONSTRAINT user_rol_user_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuario (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;')
      }).then(function () {
        return queryInterface.createTable('rol_permiso', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          // Timestamps
          created_at: Sequelize.DATE,
          updated_at: Sequelize.DATE,
          rol_id: Sequelize.INTEGER,
          permiso_id: Sequelize.INTEGER
        })
      }).then(function () {
        return queryInterface.sequelize.query('ALTER TABLE rol_permiso ADD CONSTRAINT rol_permiso_permiso_id_fk FOREIGN KEY (permiso_id) REFERENCES permiso (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;')
      })
      .then(function () {
        return queryInterface.sequelize.query('ALTER TABLE rol_permiso ADD CONSTRAINT rol_permiso_rol_id_fk FOREIGN KEY (rol_id) REFERENCES rol (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;')
      })

  },
  down: (queryInterface) => {
    return queryInterface.dropTable('rol_permiso')
      .then(function () {
        return queryInterface.dropTable('permiso')
      }).then(function () {
        return queryInterface.dropTable('usuario_rol')
      }).then(function () {
        return queryInterface.dropTable('rol')
      }).then(function () {
        return queryInterface.dropTable('usuario')
      })
  }
}
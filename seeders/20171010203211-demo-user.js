'use strict'
var bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organismo', [{
      id: 1,
      nombre: 'Jefatura de Gabinete',
      sigla: 'JGM',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      id: 2,
      nombre: 'Secretaría legal y técnica',
      sigla: 'SLyT',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
      .then(function () {
        return queryInterface.bulkInsert('usuario', [{
          id: 1,
          nombre: 'Leandro Ferrigno',
          email: 'lferrigno@cys.com.ar',
          password: bcrypt.hashSync('lferrigno', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 1
        },
        {
          id: 2,
          nombre: 'Nicolas Ledesma',
          email: 'nledesma@cys.com.ar',
          password: bcrypt.hashSync('nledesma', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 1
        },
        {
          id: 3,
          nombre: 'Rodrigo Luna',
          email: 'rluna@cys.com.ar',
          password: bcrypt.hashSync('rluna', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 2
        },
        {
          id: 4,
          nombre: 'Nicolas Araya',
          email: 'naraya@cys.com.ar',
          password: bcrypt.hashSync('naraya', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 2
        },
        {
          id: 5,
          nombre: 'Juan Manuel Roust',
          email: 'jroust@cys.com.ar',
          password: bcrypt.hashSync('jroust', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 2
        }, {
          id: 6,
          nombre: 'Ana Corradi',
          email: 'acorradi@cys.com.ar',
          password: bcrypt.hashSync('acorradi', bcrypt.genSaltSync(10)),
          created_at: new Date(),
          updated_at: new Date(),
          telefono: '55555555',
          celular: '1555555555',
          organismo_id: 2
        }
        ], {})
      }).then(function () {
        return queryInterface.bulkInsert('permiso', [{
          id: 1,
          nombre: 'GET_USUARIOS',
          descripcion: 'Posibilidad de obtener información de los usuarios',
        },
        {
          id: 2,
          nombre: 'EDIT_USUARIOS',
          descripcion: 'Posibilidad de editar los datos de usuarios',
        },
        {
          id: 3,
          nombre: 'GET_ROLES',
          descripcion: 'Posibilidad de obtener información de los roles',
        },
        {
          id: 4,
          nombre: 'EDIT_ROLES',
          descripcion: 'Posibilidad de editar los datos de un rol',
        }

        ], {})
      }).then(function () {
        return queryInterface.bulkInsert('rol', [{
          id: 1,
          nombre: 'Admin',
          descripcion: 'Administrador general',
        },
        {
          id: 2,
          nombre: 'Usuarios',
          descripcion: 'Editor de usuarios',
        },
        {
          id: 3,
          nombre: 'Roles',
          descripcion: 'Editor de roles',
        }
        ], {})
      }).then(function () {
        return queryInterface.bulkInsert('usuario_rol', [{
          usuario_id: 1,
          rol_id: 1,
        },
        {
          usuario_id: 2,
          rol_id: 1,
        },
        {
          usuario_id: 3,
          rol_id: 1,
        },
        {
          usuario_id: 3,
          rol_id: 2,
        },
        {
          usuario_id: 4,
          rol_id: 3,
        }
        ], {})
      }).then(function () {
        return queryInterface.bulkInsert('rol_permiso', [{
          permiso_id: 1,
          rol_id: 1,
        },
        {
          permiso_id: 2,
          rol_id: 1,
        },
        {
          permiso_id: 3,
          rol_id: 1,
        },
        {
          permiso_id: 4,
          rol_id: 1,
        },
        {
          permiso_id: 2,
          rol_id: 2,
        },
        {
          permiso_id: 3,
          rol_id: 2,
        },
        {
          permiso_id: 1,
          rol_id: 2,
        },
        {
          permiso_id: 3,
          rol_id: 3,
        },
        {
          permiso_id: 4,
          rol_id: 3,
        }
        ], {})
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {})
    */
  }
}
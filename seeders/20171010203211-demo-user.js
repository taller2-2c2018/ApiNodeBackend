'use strict'
var bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('usuario', [{
      id: 1,
      nombre: 'Nicolas Araya',
      email: 'naraya@taller.com.ar',
      password: bcrypt.hashSync('naraya', bcrypt.genSaltSync(10)),
      created_at: new Date(),
      updated_at: new Date(),
      telefono: '55555555',
      celular: '1555555555',
    },
    {
      id: 2,
      nombre: 'Nicolas Ledesma',
      email: 'nledesma@taller.com.ar',
      password: bcrypt.hashSync('nledesma', bcrypt.genSaltSync(10)),
      created_at: new Date(),
      updated_at: new Date(),
      telefono: '55555555',
      celular: '1555555555',
    },
    {
      id: 3,
      nombre: 'Fernando Cancellara',
      email: 'fcancellara@taller.com.ar',
      password: bcrypt.hashSync('fcancellara', bcrypt.genSaltSync(10)),
      created_at: new Date(),
      updated_at: new Date(),
      telefono: '55555555',
      celular: '1555555555',
    },
    {
      id: 4,
      nombre: 'FernandoNitz',
      email: 'fnitz@cys.com.ar',
      password: bcrypt.hashSync('fnitz', bcrypt.genSaltSync(10)),
      created_at: new Date(),
      updated_at: new Date(),
      telefono: '55555555',
      celular: '1555555555',
    }], {})
      .then(function () {
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

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {})
    */
  }
}
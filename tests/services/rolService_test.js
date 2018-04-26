'use strict'
if (process.env.TEST_HEROKU){
  require('dotenv').config({path: '.env.test_heroku'})
} else {
  require('dotenv').config({path: '.env.test'})
}
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const rolService = require('../../services/rolService')(models)


var idRolCreado = 1
var idPermisoCreado = 1
var nombreRolExistente = ''

describe('Verificaciones sobre RolServices', function () {
  it('Obtener un rol que no existe', function (done) {
    rolService.findById(-1).catch(function (e) {
      assert(e.status === 404, 'El rol existe')
      done()
    })
  })
  it('Agregar un rol', function (done) {
    let nombre = 'nombreRolLuego'
    let descripcion = 'descripcion un poco mas larga del rol luego'
    rolService.create(nombre, descripcion).then((rol) => {
      assert(rol.id !== null, 'El rol no existe')
      nombreRolExistente = rol.nombre
      assert(rol.descripcion === descripcion, 'El rol no tiene bien el nombre ')
      assert(rol.nombre === nombre, 'El rol no tiene bien la descripcion')
      done()
    })
  })
  it('Agregar un rol', function (done) {
    let nombre = 'nombreRol'
    let descripcion = 'descripcion un poco mas larga del rol'
    rolService.create(nombre, descripcion).then((rol) => {
      assert(rol.id !== null, 'El rol no existe')
      idRolCreado = rol.id
      assert(rol.descripcion === descripcion, 'El rol no tiene bien el nombre ')
      assert(rol.nombre === nombre, 'El rol no tiene bien la descripcion')
      done()
    })
  })
  it('Agregar un rol mismo nombre', function (done) {
    let nombre = 'nombreRol'
    let descripcion = 'descripcion un poco mas larga del rol'
    rolService.create(nombre, descripcion).catch((e) => {
      assert(e.status === 500, 'No deberia crear el rol con el mismo nombre')
      done()
    })
  })
  it('Obtener un rol recien creado', function (done) {
    rolService.findById(idRolCreado).then(function (rol) {
      assert(rol.id === idRolCreado, 'El rol no existe')
      done()
    })
  })
  it('Modificar rol inexistente', function (done) {
    let otroNombre = 'Otro nombre rol'
    let otraDescripcion = 'Otra descripcion!'
    let patch = {
      'nombre': otroNombre,
      'descripcion': otraDescripcion

    }
    rolService.update(-1, patch).catch((e) => {
      assert(e.status === 404, 'Deberia haber dado conflicto porque no existe el rols')
      done()
    })
  })
  it('Modificar nombre de rol a otro existente', function (done) {
    let otraDescripcion = 'Otra descripcion!'
    let patch = {
      'nombre': nombreRolExistente,
      'descripcion': otraDescripcion

    }
    rolService.update(idRolCreado, patch).catch((e) => {
      assert(e.status === 500, 'No puedo modificar el nombre a uno que exista en otro rrol')
      done()
    })
  })
  it('Modificar rol ', function (done) {
    let otroNombre = 'Otro nombre rol'
    let otraDescripcion = 'Otra descripcion!'
    let patch = {
      'nombre': otroNombre,
      'descripcion': otraDescripcion

    }
    rolService.update(idRolCreado, patch).then((rol) => {
      assert(rol.id === idRolCreado, 'No encontro el rol correcto')
      assert(rol.descripcion === otraDescripcion, 'El rol no tiene bien la descripcion')
      assert(rol.nombre === otroNombre, 'El rol no tiene bien el nombre')
      done()
    })
  })
  it('agregar un permiso a un rol existenta', function (done) {
    models.Permiso.create({
      nombre: 'nombrePermiso',
      descripcion: 'descripcionPermiso'
    }).then(function (permiso) {
      idPermisoCreado = permiso.id
      rolService.addPermisoById(idRolCreado, idPermisoCreado).then((rol) => {
        rol.getPermisos().then((permisos) => {
          assert(permisos[0].id === idPermisoCreado, 'No se agrego el permiso')
          done()
        })
      })
    })
  })

  it('agregar un permiso a un rol que ya lo tiene', function (done) {
    rolService.addPermisoById(idRolCreado, idPermisoCreado).catch((e) => {
      assert(e.status === 409, 'El rol no tiene el permiso')
      done()
    })
  })
  it('agregar un permiso a un rol que no existe', function (done) {
    rolService.addPermisoById(-1, idPermisoCreado).catch((e) => {
      assert(e.status === 404, 'No se detecta que el rol no existe')
      done()
    })
  })
  it('agregar un permiso que no existe a un rol que existe', function (done) {
    rolService.addPermisoById(idRolCreado, -1).catch((e) => {
      assert(e.status === 404, 'No se detecta que el permiso no existe')
      done()
    })
  })
  it('borrar un permiso a un rol que ya lo tiene', function (done) {
    rolService.deletePermisoById(idRolCreado, idPermisoCreado).then((rol) => {
      rol.getPermisos().then((permisos) => {
        assert(permisos[0] === undefined, 'No se borro el permiso')
        done()
      })
    })
  })

  it('Borrar un permiso a un rol que no lo tiene', function (done) {
    rolService.deletePermisoById(idRolCreado, idPermisoCreado).catch((e) => {
      assert(e.status === 409, 'El rol no tiene el permiso')
      done()
    })
  })

  it('Borrar un permiso a un rol que no existe', function (done) {
    rolService.deletePermisoById(-1, idPermisoCreado).catch((e) => {
      assert(e.status === 404, 'El rol no tiene el permiso')
      done()
    })
  })

  it('Borrar un permiso que no existe a un rol ', function (done) {
    rolService.deletePermisoById(idRolCreado, -1).catch((e) => {
      assert(e.status === 404, 'El rol no tiene el permiso')
      done()
    })
  })
})
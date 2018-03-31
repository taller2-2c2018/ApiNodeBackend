'use strict'
require('dotenv').config({path: '.env.test'})
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const usuarioService = require('../../services/usuarioService')(models)


var idUsuarioCreado = 1
var idRolCreado = 1

describe('Verificaciones sobre UsuarioService', function () {
  it('Obtener un usuario que no existe', function (done) {
    usuarioService.findById(-1).catch(function (e) {
      assert(e.status === 404, 'El usuario existe')
      done()
    })
  })
  it('Agregar un usuario', function (done) {
    let nombre = 'username!'
    let email = 'mail@mail.com'
    let verifEmail = 'mail@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw).then((usuario) => {
      assert(usuario.id !== null, 'El usuario no existe')
      idUsuarioCreado = usuario.id
      assert(usuario.nombre === nombre, 'El usuario no tiene bien el nombre')
      assert(usuario.email === email, 'El usuario no tiene bien el email')
      done()
    })
  })
  it('Modificar usuario inexistente', function (done) {
    let patch = {
      'nombre': 'un nombre'
    }
    usuarioService.update(-1, patch).catch((e) => {
      assert(e.status === 404, 'Deberia haber dado conflicto porque no existe el usuario')
      done()
    })
  })
  it('Modificar usuario password', function (done) {
    let nuevoNombre = 'Nuevo nombre largo'
    let nuevoEmail = 'new@new.com.ar'
    let patch = {
      password: 'nuevoPass',
      verificacion_password: 'nuevoPass',
      nombre: nuevoNombre,
      email: nuevoEmail,
      verificacion_email: nuevoEmail
    }
    usuarioService.update(idUsuarioCreado, patch).then((usuario) => {
      assert(usuario.id === idUsuarioCreado, 'No encontro el usuario correcto')
      assert(usuario.nombre === nuevoNombre, 'El usuario no tiene bien el nombre')
      assert(usuario.email !== nuevoEmail, 'El usuario no deberia cambiar su mail y cambio')
      done()
    })
  })
  it('Modificar usuario password mal 1', function (done) {
    let patch = {
      password: 'nuevoPass',
      verificacion_password: 'nuevoPassMal'
    }
    usuarioService.update(idUsuarioCreado, patch).catch((e) => {
      assert(e.status === 500, 'Deberia haber dado conflicto porque no existe el usuario')
      done()
    })
  })
  it('Modificar usuario password mal 2', function (done) {
    let patch = {
      password: 'nuevoPass'
    }
    usuarioService.update(idUsuarioCreado, patch).catch((e) => {
      assert(e.status === 500, 'Deberia haber dado conflicto porque no existe el usuario')
      done()
    })
  })
  it('Agregar un usuario email repetido', function (done) {
    let nombre = 'username!'
    let email = 'mail@mail.com'
    let verifEmail = 'mail@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw).catch((e) => {
      assert(e.status === 500, 'Deberia haber dado conflicto por email repetido y no lo dio')
      done()
    })
  })
  it('Agregar un usuario email no coincide', function (done) {
    let nombre = 'username!'
    let email = 'mail@mail.com'
    let verifEmail = 'mail@mail.com' + 'errr'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw).catch((e) => {
      assert(e.status === 409, 'Deberia haber dado conflicto por email repetido y no lo dio')
      done()
    })
  })
  it('Agregar un usuario password no coincide', function (done) {
    let nombre = 'username!'
    let email = 'mail@mail.com'
    let verifEmail = 'mail@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass' + 'errr'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw).catch((e) => {
      assert(e.status === 409, 'Deberia haber dado conflicto por email repetido y no lo dio')
      done()
    })
  })
  it('Obtener un usuario recien creado', function (done) {
    usuarioService.findById(idUsuarioCreado).then(function (usuario) {
      assert(usuario.id === idUsuarioCreado, 'El usuario no existe')
      done()
    })
  })

  it('agregar un rol a un usuario existenta', function (done) {
    models.Rol.create({
      nombre: 'nombreRol',
      descripcion: 'descripcionRol'
    }).then(function (rol) {
      idRolCreado = rol.id
      usuarioService.addRolById(idUsuarioCreado, idRolCreado).then((usuario) => {
        usuario.getRoles().then((roles) => {
          assert(roles[0].id === idRolCreado, 'No se agrego el rol')
          done()
        })
      })
    })
  })

  it('agregar un rol a un usuario que ya lo tiene', function (done) {
    usuarioService.addRolById(idUsuarioCreado, idRolCreado).catch((e) => {
      assert(e.status === 409, 'El usuario no tiene el rol')
      done()
    })
  })
  it('agregar un rol a un usuario que no existe', function (done) {
    usuarioService.addRolById(-1, idRolCreado).catch((e) => {
      assert(e.status === 404, 'No se detecta que el usuario no existe')
      done()
    })
  })
  it('agregar un rol que no existe a un usuario que existe', function (done) {
    usuarioService.addRolById(idUsuarioCreado, -1).catch((e) => {
      assert(e.status === 404, 'No se detecta que el rol no existe')
      done()
    })
  })
  it('borrar un rol a un usuario que ya lo tiene', function (done) {
    usuarioService.deleteRolById(idUsuarioCreado, idRolCreado).then((usuario) => {
      usuario.getRoles().then((roles) => {
        assert(roles[0] === undefined, 'No se borro el rol')
        done()
      })
    })
  })

  it('Borrar un rol a un usuario que no lo tiene', function (done) {
    usuarioService.deleteRolById(idUsuarioCreado, idRolCreado).catch((e) => {
      assert(e.status === 409, 'El usuario tiene el rol')
      done()
    })
  })

  it('Borrar un rol a un usuario que no existe', function (done) {
    usuarioService.deleteRolById(-1, idRolCreado).catch((e) => {
      assert(e.status === 404, 'El usuario no tiene el rol')
      done()
    })
  })
  it('Borrar un rol que no existe a un usuario ', function (done) {
    usuarioService.deleteRolById(idUsuarioCreado, -1).catch((e) => {
      assert(e.status === 404, 'El usuario no tiene el rol')
      done()
    })
  })
  it('Agregar un usuario con telefono y celular', function (done) {
    let nombre = 'username3!'
    let email = 'mail3@mail.com'
    let verifEmail = 'mail3@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    let telefono = '46210911'
    let celular = '1535634675'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw,telefono,celular).then((usuario) => {
      assert(usuario.id !== null, 'El usuario no existe')
      assert(usuario.nombre === nombre, 'El usuario no tiene bien el nombre')
      assert(usuario.email === email, 'El usuario no tiene bien el email')
      assert(usuario.telefono === telefono, 'El usuario no tiene bien el telefono')
      assert(usuario.celular === celular, 'El usuario no tiene bien el celular')
      done()
    })
  })
  it('Agregar un usuario con telefono unicamente', function (done) {
    let nombre = 'username2!'
    let email = 'mail2@mail.com'
    let verifEmail = 'mail2@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    let telefono = '46210911'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw,telefono).then((usuario) => {
      assert(usuario.id !== null, 'El usuario no existe')
      idUsuarioCreado = usuario.id
      assert(usuario.nombre === nombre, 'El usuario no tiene bien el nombre')
      assert(usuario.email === email, 'El usuario no tiene bien el email')
      assert(usuario.telefono === telefono, 'El usuario no tiene bien el telefono')
      done()
    })
  })
  it('Modificar telefono de usuario', function (done) {
    const telefonoNuevo = '(011)42610910' 
    let patch = {
      'telefono': telefonoNuevo
    }
    usuarioService.update(idUsuarioCreado, patch).then((usuario) => {
      assert(usuario.id === idUsuarioCreado, 'No encontro el usuario correcto')
      assert(usuario.telefono === telefonoNuevo, 'El usuario no tiene bien el telefono')
      done()
    })
  })
  it('Agregar celular a un usuario creado', function (done) {
    const celularNuevo = '(011)42610910'
    const telefonoNuevo = '45678741'  
    let patch = {
      'celular': celularNuevo,
      'telefono': telefonoNuevo
    }
    usuarioService.update(idUsuarioCreado, patch).then((usuario) => {
      assert(usuario.id === idUsuarioCreado, 'No encontro el usuario correcto')
      assert(usuario.celular === celularNuevo, 'El usuario no tiene bien el celular')
      assert(usuario.telefono === telefonoNuevo, 'El usuario no tiene bien el telefono')
      done()
    })
  })
})
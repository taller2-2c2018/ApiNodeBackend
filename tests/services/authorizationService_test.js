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
const usuarioService = require('../../services/usuarioService')(models)
const serverService = require('../../services/serverService')(models)
const userService = require('../../services/userService')(models)
const authorizationService = require('../../services/authorizationService')(models)

let idServerCreado
let idUsuarioCreado
let idUserCreado
let serverName

describe('Verificaciones sobre authorizationService', function () {
  it('Agregar un usuario para servers', function (done) {
    let nombre = 'username Auth!'
    let email = 'mailAuth@mail.com'
    let verifEmail = 'mailAuth@mail.com'
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
  it('Obtener un server que no existe', function (done) {
    serverService.get('-1').catch(function (e) {
      assert(e.status === 404, 'El server existe')
      done()
    })
  })
  it('Agregar un server', function (done) {
    serverName = 'serverAuth'
    let params = {
      id: null,
      _rev: null,
      created_at: null,
      created_by: null,
      name: serverName,
      last_connection: new Date()
    }
    serverService.create(idUsuarioCreado.toString(), params).then((server) => {
      assert(server.id !== null, 'El server no existe')
      idServerCreado = server.id
      assert(server.name === serverName, 'El server no tiene bien el nombre')
      assert(server._rev != null, 'El _rev no se completo')
      done()
    })
  })
  it('Obtener un server que no existe', function (done) {
    userService.get(-1).catch(function (e) {
      assert(e.status === 404, 'El server existe')
      done()
    })
  })
  it('Creo un usuario para ese server', function (done) {
    userService.create(idServerCreado,{
      username: 'usuario1',
      password: 'pass1',
      facebook_auth_token: 'token1',
      nombre: 'name1',
      apellido: 'lastName1',
      fecha_nacimiento: '17/12/1990',
      facebook_id: 'facebook_id1',
    }).then((user) => {
      assert(user.username != null, 'El server no tiene bien el nombre')
      idUserCreado = user.id
      done()
    })
  })
  it('Obtengo ese usuario en particular', function (done) {
    userService.get(idUserCreado).then((user) => {
      assert(user.username != null, 'El server no tiene bien el nombre')
      done()
    })
  })  
  it('Pido un token para ese usuario', function (done) {
    authorizationService.create(idUsuarioCreado, {
      facebook_id: 'facebook_id1'
    }).then((token) => {
      assert(token.token !== null, 'No se devolvio nigun token')
      assert(token.facebook_id === 'facebook_id1', 'El usuario es del mismo facebook id')
      done()
    })
  })
})
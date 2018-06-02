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

let idServerCreado
let revViejo
let idUsuarioCreado
let serverName

describe('Verificaciones sobre serverService', function () {
  it('Agregar un usuario para servers', function (done) {
    let nombre = 'username server!'
    let email = 'mailserver@mail.com'
    let verifEmail = 'mailserver@mail.com'
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
    serverName = 'server1'
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
      revViejo = server._rev
      done()
    })
  })
  it('Obtener un server', function (done) {
    serverService.get(idServerCreado.toString()).then((server) => {
      assert(server.name == serverName, 'El server no tiene bien el servername')
      done()
    })
  })
  it('Edito un server', function (done) {
    let servername2 = 'servername2'
    let params = {
      id: idServerCreado,
      _rev: revViejo,
      created_at: null,
      created_by: idUsuarioCreado,
      last_connection: new Date(),
      name: servername2,
    }
    serverService.update(idServerCreado, params).then((server) => {
      assert(server.id !== null, 'El server no existe')
      assert(server.name === servername2, 'El server no tiene bien el servername')
      assert(server._rev != revViejo, 'El _rev no se modifico')
      done()
    })
  })
})
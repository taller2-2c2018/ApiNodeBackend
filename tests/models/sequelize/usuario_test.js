'use strict'
if (process.env.TEST_HEROKU){
  require('dotenv').config({path: '.env.test_heroku'})
} else {
  require('dotenv').config({path: '.env.test'})
}
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../../models/sequelize')

describe('Usuario valido', function () {
  it('carga valida', function (done) {
    let pwd = 'foobar'
    models
      .Usuario
      .create({name: 'Example User', email: 'user@example.com', password: pwd})
      .then(function (usuario) {
        assert(usuario.id !== null, 'El usuario no tiene id')
        assert(usuario.password !== pwd, 'El password no fue encriptado')
        done()
      })
  })
  it('El email no puede estar repetido', function (done) {
    let pwd = 'foobar'
    models
      .Usuario
      .create({name: 'Example User', email: 'user@example.com', password: pwd})
      .catch(function (e) {
        assert(e !== null, 'No se creo el usuario')
        done()
      })
  })

  it('carga valida verificar password valido', function (done) {
    let pwd = 'foobar2'
    models
      .Usuario
      .create({name: 'Example User', email: 'user2@example.com', password: pwd})
      .then(function (usuario) {
        assert(usuario.id !== null, 'El usuario no tiene id')
        assert(usuario.password !== pwd, 'El password no fue encriptado')
        usuario
          .verificarPassword(pwd)
          .then(() => {
            assert(true === true, 'Valido')
            done()
          })
          .catch(() => {
            assert(true === false, 'Invalido')
            done()
          })

      })
  })
  it('carga valida verificar password invalido', function (done) {
    let pwd = 'foobar2'
    models
      .Usuario
      .create({name: 'Example User', email: 'user3@example.com', password: pwd})
      .then(function (usuario) {
        assert(usuario.id !== null, 'El usuario no tiene id')
        assert(usuario.password !== pwd, 'El password no fue encriptado')
        usuario
          .verificarPassword(pwd + 'wrong')
          .then(() => {
            assert(true === false, 'Invalido')
            done()
          })
          .catch(() => {
            assert(true === true, 'Valido')
            done()
          })
      })
  })
  it('Usuario con numero de telefono valido', function (done) {
    const regex = models.Usuario.getTelefonoRegex()
    let telefonos = [ 
      '(123) 456-7890',
      '(123)456-7890',
      '123-456-7890',
      '123.456.7890',
      '1234567890',
      '+31636363634',
      '075-63546725',
      '42610910',
      '1535634674'
    ]
    telefonos.forEach(function(telefono) 
    { 
      assert(regex.test(telefono), 'El numero no es valido ' + telefono) 
    })
    done()
  })
  it('Usuario con numero de telefono invalido', function (done) {
    const regex = models.Usuario.getTelefonoRegex()
    let telefonos = ['(123)456-7A890',
      '122',
      '(123)(456)7890',
      'NUMERO',
      '+',
      '',
      '42610910+',
      '153563467412312313212313213'
    ]  
    telefonos.forEach(function (telefono) {
      assert(!regex.test(telefono), 'El numero es valido ' + telefono)
    })
    done()
  })
})
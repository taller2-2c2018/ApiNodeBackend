'use strict'
require('dotenv').config({path: '.env.test'})
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../../models/sequelize')

describe('Informe valido', function () {
  it('carga valida', function (done) {
    models
      .Informe
      .create({camara: 'HSN'})
      .then(function (informe) {
        assert(informe.id !== null, 'El informe no tiene id')
        assert(informe.numero === 1, 'El numero no fue ingresado')
        done()
      })
  })
  it('el numero de informe aumenta', function (done) {
    models
      .Informe
      .create({camara: 'HSN'})
      .then(function (informe) {
        assert(informe.id !== null, 'El informe no tiene id')
        assert(informe.numero === 2, 'El numero no fue ingresado')
        done()
      })
  })
})
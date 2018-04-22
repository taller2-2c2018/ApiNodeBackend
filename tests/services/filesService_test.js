'use strict'
require('dotenv').config({path: '.env.test'})
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const fileService = require('../../services/fileService')(models)

let idFileCreado

describe('Verificaciones sobre FileService', function () {
  it('Obtener un file que no existe', function (done) {
    fileService.get('-1').catch(function (e) {
      assert(e.status === 404, 'El file existe')
      done()
    })
  })
  /*it('Agregar un file', function (done) {
    let filename = 'filename'
    let originalname = 'originalname'
    let params = {
      id: null,
      _rev: null,
      created_at: null,
      updated_at: null,
      size: null,
      filename: null,
      resource: null
    }
    let file = {
      filename: filename,
      originalname: originalname,
      path: 'un path',
      size: 100
    }
    fileService.create(file, params).then((file) => {
      assert(file.id !== null, 'El file no existe')
      idFileCreado = file.id
      assert(file.originalname === originalname, 'El file no tiene bien el originalname')
      assert(file.filename === filename, 'El file no tiene bien el filename')
      done()
    })
  })*/
})
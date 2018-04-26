/*'use strict'
if (process.env.TEST_HEROKU){
  require('dotenv').config({path: '.env.test_heroku'})
} else {
  require('dotenv').config({path: '.env.test'})
}
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const fileService = require('../../services/fileService')(models)

let idFileCreado
let revViejo
let originalname = 'originalname'
let filename = 'filename'

describe('Verificaciones sobre FileService', function () {
  it('Obtener un file que no existe', function (done) {
    fileService.get('-1').catch(function (e) {
      assert(e.status === 404, 'El file existe')
      done()
    })
  })
  it('Agregar un file', function (done) {
    let path = 'un path'
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
      path: path,
      size: 100
    }
    fileService.create(file, params).then((file) => {
      assert(file.id !== null, 'El file no existe')
      idFileCreado = file.id
      assert(file.resource === path, 'El file no tiene bien el resource')
      assert(file.filename === originalname, 'El file no tiene bien el filename')
      assert(file._rev != null, 'El _rev no se completo')
      revViejo = file._rev
      done()
    })
  })
  it('Obtener un file', function (done) {
    fileService.get(idFileCreado.toString()).then((path_filename) => {
      assert(path_filename == filename, 'El file no tiene bien el filename')
      done()
    })
  })
  it('Edito un file', function (done) {
    let filename2 = 'filename2'
    let params = {
      id: idFileCreado,
      _rev: revViejo,
      created_at: null,
      updated_at: null,
      size: 1200,
      filename: filename2,
      resource: filename2
    }
    fileService.update(idFileCreado, params).then((file) => {
      assert(file.id !== null, 'El file no existe')
      assert(file.filename === filename2, 'El file no tiene bien el filename')
      assert(file._rev != revViejo, 'El _rev no se modifico')
      done()
    })
  })
})*/
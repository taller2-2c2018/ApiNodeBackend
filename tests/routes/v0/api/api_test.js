require('dotenv').config({path: '.env.test'})
let describe = require('mocha').describe
let it = require('mocha').it
let before = require('mocha').before
const assert = require('chai').assert
let app = require('../../../../app')
const request = require('supertest')
var bodyParser = require('body-parser')
const inic = require('../bootstrapping')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let token = ''

describe('GET /v0/api/node', function() {
  before(function (done) {
    inic.crearUsuarioInicial('node',['EDIT_node','GET_node']).then(function (tokenNuevo) {
      assert(tokenNuevo !== undefined, 'No se obtiene un token valido')
      token = tokenNuevo
      done()
    })   
  })
  it('Tengo permisos para obtener los node', function(done) {
    request(app)
      .get('/v0/api/node')
      .set({ 'Authorization': token, Accept: 'application/json' })
      .expect(200,done)
  })
/*   it('Creo un nuevo informe de HSN', function(done) { 
    request(app)
      .post('/v0/api/node')º
      .set({ 'Authorization': token, Accept: 'application/json' })
      .send({camara: camara})
      .expect(200, function (err, res) {
        const result = JSON.parse(res.text).data
        assert(result.id !== undefined, 'No tiene id')
        informe_id = result.id        
        assert(result.camara === camara, 'No coinciden las camaras')
        done()
      })
  }) */
})
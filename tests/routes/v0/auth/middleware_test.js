require('dotenv').config({path: '.env.test'})
let chai = require('chai')
let authMiddleware = require('../../../../routes/v0/auth/middleware')
let moment = require('moment')
let jwt = require('jwt-simple')
let expect = chai.expect
let errorGetter = require('../../../../util/errors')
let httpMocks = require('node-mocks-http') // quickly sets up REQUEST and RESPONSE to be passed into Express Middleware
let request = {} // define REQUEST
let response = {} // define RESPONSE
let describe = require('mocha').describe
let it = require('mocha').it
let beforeEach = require('mocha').beforeEach

let validateLoggedUser = authMiddleware.checkIsLoggedWithPermission()
let validatePermiso1 = authMiddleware.checkIsLoggedWithPermission('permiso1')
let validatePermiso2 = authMiddleware.checkIsLoggedWithPermission('permiso2')
let validateOtroPermiso = authMiddleware.checkIsLoggedWithPermission('permisoOtro')

const errorNoAutorizado = errorGetter.getUsuarioNoAutorizado()
// const errorTokenExpirado = errorGetter.getTokenExpired()
// TODO: Probar token expirado

let payload = {
  user_id: 1,
  username: 'test@test.com.ar',
  permisos: [
    'permiso1', 'permiso2'
  ],
  iat: moment().unix(),
  exp: moment()
    .add(1, 'days')
    .unix()
}

describe('Prueba autenticacion y permisos', function () {
  beforeEach(function (done) {
    /*
             * before each test, reset the REQUEST and RESPONSE variables
             * to be send into the middle ware
             **/
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/test/path?myid=312',
      query: {
        myid: '312'
      }
    })
    response = httpMocks.createResponse()

    done() // call done so that the next test can run
  })
  it('Devolver 401 si el token no existe', function (done) {
    /*
             * Middleware expects to be passed 3 arguments: request, response, and next.
             * We are going to be manually passing REQUEST and RESPONSE into the middleware
             * and create an function callback for next in which we run our tests
             **/
    validateLoggedUser(request, response, function next(error) {
      expect(error.status)
        .not
        .to
        .be
        .an('undefined')
      expect(error.status)
        .to
        .equal(errorNoAutorizado.status)
      done()
    })
  })
  it('Devolver 401 si el token esta mal formado existe', function (done) {
    request.headers = {}
    request.headers.authorization = 'some authorization header'
    validateLoggedUser(request, response, function next(error) {
      expect(error.status)
        .not
        .to
        .be
        .an('undefined')
      expect(error.status)
        .to
        .equal(errorNoAutorizado.status)
      done()
    })
  })
  it('No devolver error si el token existe y esta bien formado', function (done) {
    request.headers = {}
    request.headers.authorization = jwt.encode(payload, process.env.TOKEN_SECRET)
    
    validateLoggedUser(request, response, function next(error) {
      expect(error)
        .to
        .be
        .an('undefined')
      done()
    })
  })
  it('Validar que el permiso sea correcto y no es correcto', function (done) {
    request.headers = {}
    request.headers.authorization = jwt.encode(payload, process.env.TOKEN_SECRET)
    
    validateOtroPermiso(request, response, function next(error) {
      expect(error.status)
        .not
        .to
        .be
        .an('undefined')
      expect(error.status)
        .to
        .equal(errorNoAutorizado.status)
      done()
    })
  })
  it('Validar que el permiso sea correcto y es correcto', function (done) {
    request.headers = {}
    request.headers.authorization = jwt.encode(payload, process.env.TOKEN_SECRET)
    
    validatePermiso1(request, response, function next(error) {
      expect(error)
        .to
        .be
        .an('undefined')
      done()
    })
  })
  it('Validar que el permiso sea correcto y es correcto 2', function (done) {
    request.headers = {}
    request.headers.authorization = jwt.encode(payload, process.env.TOKEN_SECRET)
    
    validatePermiso2(request, response, function next(error) {
      expect(error)
        .to
        .be
        .an('undefined')
      done()
    })
  })
})
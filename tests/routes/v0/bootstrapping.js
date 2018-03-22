require('dotenv').config({ path: '.env.test' })
let models = require('../../../models/sequelize')
let app = require('../../../app')
const usuarioService = require('../../../services/usuarioService')(models)
const rolService = require('../../../services/rolService')(models)
const assert = require('chai').assert
const request = require('supertest')


module.exports = {
  crearUsuarioInicial: (entidad, permisosNecesarios) => {
    let idUsuarioCreado
    let promise = new Promise((resolve) => {
      models
        .EstadoInforme
        .findOrCreate({where: { nombre: 'EstadoInforme estado inicial', default: true }})
        .then(() => {
          models.Organismo.create({
            nombre: 'nombre organismo ' + entidad
          })
            .then(function (organismo) {
              const idOrganismoCreado = organismo.id
              const nombre = 'username' + entidad
              const email = 'mailRoute' + entidad + '@mail.com'
              const verifEmail = 'mailRoute' + entidad + '@mail.com'
              const psw = 'mySecretpass'
              const verifPsw = 'mySecretpass'
              usuarioService.create(nombre, email, verifEmail, psw, verifPsw, idOrganismoCreado)
                .then((usuario) => {
                  idUsuarioCreado = usuario.id
                  const nombre = 'nombreRolRoute' + entidad
                  const descripcion = 'nombreRolRoute' + entidad
                  return rolService.create(nombre, descripcion)
                }).then((rol) => {
                  const idRolCreado = rol.id
                  usuarioService.addRolById(idUsuarioCreado, idRolCreado)
                  return idRolCreado
                }).then((idRolCreado) => {
                  let permisos = []
                  permisosNecesarios.forEach(function (permiso) {
                    permisos.push(models.Permiso.create({
                      nombre: permiso,
                      descripcion: permiso
                    }).then((permisoCreado) => {
                      const idPermisoCreado = permisoCreado.id
                      return rolService.addPermisoById(idRolCreado, idPermisoCreado)
                    })
                    )
                  })
                  Promise.all(permisos).then(function () {
                    let token
                    request(app)
                      .post('/v0/api/token')
                      .set('Content-Type', 'application/x-www-form-urlencoded')
                      .send({ username: 'mailRoute' + entidad + '@mail.com', password: 'mySecretpass' })
                      .expect(200, function (err, res) {
                        const result = JSON.parse(res.text).data
                        assert(result.username === 'mailRoute' + entidad + '@mail.com', 'No coinciden los username ' + res.text)
                        assert(result.token !== null, 'No tiene un token')
                        token = result.token
                        resolve(token)
                      })
                  })
                })
            })
        })
    })
    return promise
  }
}
'use strict'

require('dotenv').config({path: '.env.test'})
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const informeService = require('../../services/informeService')(models)
const usuarioService = require('../../services/usuarioService')(models)

let informe_id
let estado_pregunta_original_final = 2
let pregunta_original_id
let motivo_consolidacion_id = 1
let autor_id
let organismo_id
let organismo_nuevo_id
let texto_pregunta
let introduccion_pregunta
let usuario_id
let consolidacion_id

function obtenerMensajeConsolidacion(consolidacion){
  let consolidacionNueva = {}
  consolidacionNueva.preguntas_originales = []
  consolidacionNueva.preguntas_consolidadas = []
  consolidacion.PreguntasOriginales.forEach(pregunta => {
    let preguntaNueva = {}
    preguntaNueva.pregunta_original_id = pregunta.id
    preguntaNueva.estado_pregunta_original_id = pregunta.estado_pregunta_original_id
    preguntaNueva.motivo_consolidacion_id = pregunta.motivo_consolidacion_id
    consolidacionNueva.preguntas_originales.push(preguntaNueva)
  })
  consolidacion.PreguntasConsolidadas.forEach(pregunta => {
    let preguntaNueva = {}
    preguntaNueva.pregunta_consolidada_id = pregunta.id
    preguntaNueva.autor_id = pregunta.autor_id
    preguntaNueva.introduccion = pregunta.introduccion
    preguntaNueva.pregunta = pregunta.pregunta
    preguntaNueva.derivaciones = []
    pregunta.Derivaciones.forEach(derivacion => {
      preguntaNueva.derivaciones.push(derivacion.organismo_id)
    })
    consolidacionNueva.preguntas_consolidadas.push(preguntaNueva)
  }) 
  return consolidacionNueva
}

describe('Verificaciones sobre InformeService', function () {
  it('creo un autor nuevo', function (done) {
    models
      .Autor
      .create({bloque: 'bloque informe', interbloque: 'interbloque informe', nombre: 'pepe'})
      .then(function (autor) {
        assert(autor.id !== null, 'El informe no tiene id')
        autor_id = autor.id
        done()
      })
  })
  it('creo un informe nuevo', function (done) {
    informeService
      .create({camara: 'HSN'},null)
      .then(function (informe) {
        assert(informe.id !== null, 'El informe no tiene id')
        assert(informe.estado_informe_id !== null, 'El informe no tiene estado')
        informe_id = informe.id
        done()
      })
  })
  it('carga valida agregar una pregunta a un informe', function (done) {
    models.Organismo.create({
      nombre: 'nombre organismo informeService',
      sigla: 'ORG'
    }).then(function (organismo) {
      texto_pregunta = 'texto pregunta'
      introduccion_pregunta = 'una introduccion cualquiera'
      organismo_id = organismo.id
      informeService
        .addPreguntaToInforme(informe_id,
          {
            pregunta: texto_pregunta,
            autor_id: autor_id,
            introduccion: introduccion_pregunta,
            derivaciones: [organismo_id]
          })
        .then(function (preguntaOriginal) {
          assert(preguntaOriginal.id !== null, 'La pregunta original no tiene id')
          pregunta_original_id = preguntaOriginal.id
          assert(preguntaOriginal.pregunta === texto_pregunta, 'El texto de la pregunta no fue ingresado')
          assert(preguntaOriginal.introduccion === introduccion_pregunta, 'La introduccion de la pregunta no fue ingresada')
          assert(preguntaOriginal.Derivaciones.length === 1, 'La derivacion no fue creada')
          done()
        })
    })
  })
  it('Agregar un usuario', function (done) {
    let nombre = 'username informeService'
    let email = 'mailinformeService@mail.com'
    let verifEmail = 'mailinformeService@mail.com'
    let psw = 'mySecretpass'
    let verifPsw = 'mySecretpass'
    usuarioService.create(nombre, email, verifEmail, psw, verifPsw, organismo_id).then((usuario) => {
      assert(usuario.id !== null, 'El usuario no existe')
      usuario_id = usuario.id
      assert(usuario.nombre === nombre, 'El usuario no tiene bien el nombre')
      assert(usuario.email === email, 'El usuario no tiene bien el email')
      done()
    })
  })
  it('consolidar una pregunta original', function (done) {
    let texto_pregunta = 'texto pregunta'
    let introduccion_pregunta = 'una introduccion cualquiera'
    informeService
      .createConsolidacion(usuario_id, informe_id,
        {
          'preguntas_consolidadas': [
            {
              'autor_id': autor_id,
              'introduccion': introduccion_pregunta,
              'pregunta': texto_pregunta,
              'derivaciones': [organismo_id]
            }
          ],
          'preguntas_originales': [
            {
              'pregunta_original_id': pregunta_original_id,
              'estado_pregunta_original_id': estado_pregunta_original_final,
              'motivo_consolidacion_id': motivo_consolidacion_id
            }
          ]
        })
      .then(function (consolidacion) {
        assert(consolidacion.id !== null, 'La consolidacion no tiene id')
        consolidacion_id = consolidacion.id
        assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
        assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
        done()
      })
  })
  it('modificar una consolidacion: se agrega otra pregunta consolidada', function (done) {
    informeService.findConsolidacionById(informe_id, consolidacion_id)
      .then((consolidacion)=>{
        let consolidacionNueva = obtenerMensajeConsolidacion(consolidacion)
        consolidacionNueva.preguntas_consolidadas.push(
          {
            autor_id: autor_id,
            introduccion: introduccion_pregunta,
            pregunta: texto_pregunta,
            derivaciones: [organismo_id]
          })
        informeService
          .updateConsolidacion(usuario_id, informe_id, consolidacion_id,consolidacionNueva)
          .then(function (consolidacion) {
            assert(consolidacion.id !== null, 'La consolidacion no tiene id')
            assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
            assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
            models.PreguntaConsolidada.findAll({
              where: {informe_id:informe_id}
            }).then((preguntas)=>{
              assert(preguntas.length === 2, 'La cantidad de preguntas consolidadas no aumento')
              done()
            })
          })
      })
  })
  it('modificar una consolidacion: se agrega otra derivacion a una pregunta consolidada', function (done) {
    models.Organismo.create({
      nombre: 'nombre organismo informeService 2',
      sigla: 'ORG'
    }).then((organismo) => {
      organismo_nuevo_id = organismo.id
      informeService.findConsolidacionById(informe_id, consolidacion_id)
        .then((consolidacion)=>{
          let consolidacionNueva = obtenerMensajeConsolidacion(consolidacion)
          let pregunta_consolidada_id = consolidacionNueva.preguntas_consolidadas[0].pregunta_consolidada_id
          consolidacionNueva.preguntas_consolidadas[0].derivaciones.push(organismo_nuevo_id)
          informeService
            .updateConsolidacion(usuario_id, informe_id, consolidacion_id,consolidacionNueva)
            .then(function (consolidacion) {
              assert(consolidacion.id !== null, 'La consolidacion no tiene id')
              assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
              assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
              models.PreguntaConsolidada.findAll({
                where: {informe_id:informe_id}
              }).then((preguntas)=>{
                assert(preguntas.length === 2, 'La cantidad de preguntas consolidadas no aumento')
                models.PreguntaConsolidada.findOne({
                  where: { id: pregunta_consolidada_id },
                  include: { model: models.Derivacion, as:'Derivaciones' }
                }).then((preguntaConsolidada)=>{
                  assert(preguntaConsolidada.Derivaciones.length === 2, 'La cantidad de derivaciones no aumento')
                  done()
                })
              })
            })
        })
    })
  })
  it('modificar una consolidacion: se elimina una derivacion a una pregunta consolidada', function (done) {
    informeService.findConsolidacionById(informe_id, consolidacion_id)
      .then((consolidacion)=>{
        let consolidacionNueva = obtenerMensajeConsolidacion(consolidacion)
        let pregunta_consolidada_id = consolidacionNueva.preguntas_consolidadas[0].pregunta_consolidada_id
        consolidacionNueva.preguntas_consolidadas[0].derivaciones.pop()
        informeService
          .updateConsolidacion(usuario_id, informe_id, consolidacion_id,consolidacionNueva)
          .then(function (consolidacion) {
            assert(consolidacion.id !== null, 'La consolidacion no tiene id')
            assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
            assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
            models.PreguntaConsolidada.findAll({
              where: {informe_id:informe_id}
            }).then((preguntas)=>{
              assert(preguntas.length === 2, 'La cantidad de preguntas consolidadas no permanesio constante')
              models.PreguntaConsolidada.findOne({
                where: {id:pregunta_consolidada_id},
                include: {model: models.Derivacion, as:'Derivaciones'}
              }).then((preguntaConsolidada)=>{
                assert(preguntaConsolidada.Derivaciones.length === 1, 'La cantidad de derivaciones no disminuyo')
                done()
              })
            })
          })
      })
  })
  it('modificar una consolidacion: se modifica una introduccion a una de las preguntas', function (done) {
    informeService.findConsolidacionById(informe_id, consolidacion_id)
      .then((consolidacion)=>{
        let otraIntro = 'otra intro'
        let consolidacionNueva = obtenerMensajeConsolidacion(consolidacion)
        let pregunta_consolidada_id = consolidacionNueva.preguntas_consolidadas[0].pregunta_consolidada_id
        consolidacionNueva.preguntas_consolidadas[0].introduccion = otraIntro
        informeService
          .updateConsolidacion(usuario_id, informe_id, consolidacion_id,consolidacionNueva)
          .then(function (consolidacion) {
            assert(consolidacion.id !== null, 'La consolidacion no tiene id')
            assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
            assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
            models.PreguntaConsolidada.findAll({
              where: {informe_id:informe_id}
            }).then((preguntas)=>{
              assert(preguntas.length === 2, 'La cantidad de preguntas consolidadas no permanesio constante')
              models.PreguntaConsolidada.findOne({
                where: {id:pregunta_consolidada_id},
                include: {model: models.Derivacion, as:'Derivaciones'}
              }).then((preguntaConsolidada)=>{
                assert(preguntaConsolidada.introduccion === otraIntro, 'La introduccion no cambio')
                assert(preguntaConsolidada.Derivaciones.length === 1, 'La cantidad de derivaciones no disminuyo')
                done()
              })
            })
          })
      })
  })
  it('modificar una consolidacion: se elimina una derivacion a una pregunta consolidada', function (done) {
    informeService.findConsolidacionById(informe_id, consolidacion_id)
      .then((consolidacion)=>{
        let consolidacionNueva = obtenerMensajeConsolidacion(consolidacion)
        let pregunta_consolidada_id = consolidacionNueva.preguntas_consolidadas[0].pregunta_consolidada_id
        delete consolidacionNueva.preguntas_consolidadas
        consolidacionNueva.preguntas_consolidadas = [
          {
            'autor_id': autor_id,
            'introduccion': introduccion_pregunta + '2',
            'pregunta': texto_pregunta + '2',
            'derivaciones': [organismo_id]
          }
        ]
        informeService
          .updateConsolidacion(usuario_id, informe_id, consolidacion_id,consolidacionNueva)
          .then(function (consolidacion) {
            assert(consolidacion.id !== null, 'La consolidacion no tiene id')
            assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
            assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
            models.PreguntaConsolidada.findAll({
              where: {informe_id:informe_id}
            }).then((preguntas)=>{
              assert(preguntas.length === 1, 'La cantidad de preguntas consolidadas no disminuyo')
              assert(preguntas[0].introduccion == introduccion_pregunta + '2', 'La introduccion es erronea')
              models.PreguntaConsolidada.findOne({
                where: {id:pregunta_consolidada_id},
              }).then((preguntaConsolidada)=>{
                assert(preguntaConsolidada == null, 'La pregunta consolidada no se elimino')
                done()
              })
            })
          })
      })
  })
  it('cerrar un informe valido', function (done) {
    informeService.cerrarInforme(informe_id, {})
      .then((respuesta)=>{
        assert(respuesta == models.Informe.getMsgSeHaCerradoCorrectamente(), 'El informe no se ha cerrado correctamente')
        done()
      })
  })
})

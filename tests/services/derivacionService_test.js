'use strict'

require('dotenv').config({path: '.env.test'})
let assert = require('chai').assert
let describe = require('mocha').describe
let it = require('mocha').it
let models = require('../../models/sequelize')
const informeService = require('../../services/informeService')(models)
const usuarioService = require('../../services/usuarioService')(models)
const derivacionService = require('../../services/derivacionService')(models)

let informe_id
let estado_pregunta_original_final = 2
let pregunta_original_id
let motivo_consolidacion_id = 1
let autor_id
let organismo_id
let otro_organismo_id
let texto_pregunta
let introduccion_pregunta
let usuario_id
let derivacion_id
let respuesta_id
let descripcion_nota = 'una nota'
let descripcion_respuesta = 'una respuesta'
const ESTADO_DERIVACION_ACEPTADA_ID = 3
const ESTADO_DERIVACION_RESPONDIDA_ID = 5
const ESTADO_DERIVACION_TERMINADA_ID = 6
const ESTADO_RESPUESTA_DERIVACION_ACEPTADA_ID = 2

const parsearRespuesta = (response) => {
  return JSON.parse(JSON.stringify(response))
}

describe('Verificaciones sobre DerivacionService', function () {
  it('creo un autor nuevo', function (done) {
    models
      .Autor
      .create({bloque: 'bloque derivacion', interbloque: 'interbloque derivacion', nombre: 'derivacion'})
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
      nombre: 'nombre organismo DerivacionService',
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
    let nombre = 'username DerivacionService'
    let email = 'mailderivacionService@mail.com'
    let verifEmail = 'mailderivacionService@mail.com'
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
    models.Organismo.create({
      nombre: 'nombre organismo DerivacionService 2',
      sigla: 'ORG'
    }).then(function (organismo2) {
      otro_organismo_id = organismo2.id
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
                'derivaciones': [organismo_id,otro_organismo_id]
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
          assert(consolidacion.usuario_id === usuario_id, 'El usuario creador de la consolidacion no fue ingresado')
          assert(consolidacion.informe_id === informe_id, 'El informe de la consolidacion no fue ingresado')
          done()
        })
    })
  })
  it('cerrar un informe valido', function (done) {
    informeService.cerrarInforme(informe_id , {})
      .then((respuesta)=>{
        assert(respuesta == models.Informe.getMsgSeHaCerradoCorrectamente(), 'El informe no se ha cerrado correctamente')
        done()
      })
  })
  it('aceptar una derivacion', function (done) {
    models.Derivacion.findOne({
      where: { organismo_id: organismo_id }
    })
      .then((derivacion)=>{
        derivacion = parsearRespuesta(derivacion)
        derivacion_id = derivacion.id
        derivacionService.update(organismo_id, derivacion_id , { estado_derivacion_id: ESTADO_DERIVACION_ACEPTADA_ID })
          .then((respuesta)=>{
            respuesta = parsearRespuesta(respuesta)
            assert(respuesta.estado_derivacion_id == ESTADO_DERIVACION_ACEPTADA_ID, 'El estado de la derivacion no cambio')
            done()
          })
      })
  })
  it('encontrar todos los informes donde tenga una derivacion', function (done) {
    derivacionService.findAllInformes(organismo_id, true, {})
      .then((informe)=>{
        assert(informe.length == 1, 'No se han encontrado derivaciones')
        assert(informe != null, 'No se han encontrado derivaciones')
        done()
      })
  })
  it('encontrar todos los organimos a los que fueron derivados la misma pregunta', function (done) {
    derivacionService.findAllOrganismos(derivacion_id, organismo_id, true, {})
      .then((organismos)=>{
        assert(organismos.length == 2, 'No se han encontrado derivaciones')
        assert(organismos != null, 'No se han encontrado derivaciones')
        done()
      })
  })
  it('crear una nota para una derivacion', function (done) {
    derivacionService.createNota(usuario_id, derivacion_id, { nota: descripcion_nota})
      .then((nota)=>{
        assert(nota.nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')
        assert(nota.id != null, 'No se han encontrado la nota')
        derivacionService.findAll(organismo_id,false,{})
          .then((derivaciones)=>{ 
            derivaciones = derivaciones[0].dataValues
            assert(derivaciones.id != null, 'Se encontro 1 derivacion')
            assert(derivaciones.Notas.length == 1, 'No se han encontrado las notas')
            assert(derivaciones.Notas[0].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')
            done()
          })
      })
  })
  it('obtener todas las derivaciones siendo super usuario', function (done) {
    derivacionService.findAll(organismo_id,false,{})
      .then((derivaciones)=>{
        derivaciones = JSON.parse(JSON.stringify(derivaciones))
        assert(derivaciones.length == 1, 'Se encontro 1 derivacion')
        derivacionService.findAll(organismo_id,true,{})
          .then((derivaciones)=>{ 
            derivaciones = JSON.parse(JSON.stringify(derivaciones))
            assert(derivaciones.length == 2, 'Se encontro 2 derivacion')
            done()
          })
      })
  })
  it('crear una respuesta para una derivacion', function (done) {
    derivacionService.createRespuesta(usuario_id, derivacion_id, { 
      respuesta: descripcion_respuesta, es_borrador: true })
      .then((respuesta)=>{
        assert(respuesta.respuesta == descripcion_respuesta, 'No se ha asignado correctamente la respuesta')
        respuesta_id = respuesta.id
        assert(respuesta.id != null, 'No se han encontrado la respuesta')
        assert(respuesta.es_borrador === true, 'La respuesta no se guardo como borrador')        
        derivacionService.findAll(organismo_id,false,{})
          .then((derivaciones)=>{ 
            derivaciones = parsearRespuesta(derivaciones)
            assert(derivaciones[0].id != null, 'Se encontro 1 derivacion')
            assert(derivaciones[0].Respuestas.length == 1, 'No se han encontrado las notas')            
            assert(derivaciones[0].Notas.length == 1, 'No se han encontrado las notas')
            assert(derivaciones[0].Notas[0].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')
            done()
          })
      })
  })
  it('mando una respuesta a una derivacion', function (done) {
    derivacionService.updateRespuesta(usuario_id, derivacion_id, respuesta_id, { 
      nota: descripcion_nota, es_borrador: false })
      .then((respuesta)=>{
        assert(respuesta.respuesta == descripcion_respuesta, 'No se ha asignado correctamente la respuesta')
        assert(respuesta.id != null, 'No se han encontrado la respuesta')
        assert(respuesta.es_borrador === false, 'La respuesta no se guardo como borrador')        
        derivacionService.findAll(organismo_id,false,{})
          .then((derivaciones)=>{ 
            derivaciones = parsearRespuesta(derivaciones)
            assert(derivaciones[0].id != null, 'Se encontro 1 derivacion')
            assert(derivaciones[0].Respuestas.length == 1, 'No se han encontrado las notas')            
            assert(derivaciones[0].Notas.length == 2, 'No se han encontrado las notas')
            assert(derivaciones[0].estado_derivacion_id == ESTADO_DERIVACION_RESPONDIDA_ID, 'No se han encontrado las notas')
            assert(derivaciones[0].Notas[0].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')
            assert(derivaciones[0].Notas[1].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')            
            done()
          })
      })
  })
  it('acepto la respusta enviada', function (done) {
    derivacionService.updateRespuesta(usuario_id, derivacion_id, respuesta_id, { 
      estado_respuesta_derivacion_id: ESTADO_RESPUESTA_DERIVACION_ACEPTADA_ID })
      .then((respuesta)=>{
        assert(respuesta.respuesta == descripcion_respuesta, 'No se ha asignado correctamente la respuesta')
        assert(respuesta.id != null, 'No se han encontrado la respuesta')
        assert(respuesta.es_borrador === false, 'La respuesta no se guardo como borrador')  
        assert(respuesta.estado_respuesta_derivacion_id === ESTADO_RESPUESTA_DERIVACION_ACEPTADA_ID, 'La respuesta no se guardo como aceptada')        
        derivacionService.findAll(organismo_id,false,{})
          .then((derivaciones)=>{ 
            derivaciones = parsearRespuesta(derivaciones)
            assert(derivaciones[0].id != null, 'Se encontro 1 derivacion')
            assert(derivaciones[0].Respuestas.length == 1, 'No se han encontrado las notas')            
            assert(derivaciones[0].Notas.length == 2, 'No se han encontrado las notas')
            assert(derivaciones[0].estado_derivacion_id == ESTADO_DERIVACION_TERMINADA_ID, 'No se han encontrado las notas')
            assert(derivaciones[0].Notas[0].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')
            assert(derivaciones[0].Notas[1].nota == descripcion_nota, 'No se ha asignado correctamente el nombre de la nota')            
            done()
          })
      })
  })
})
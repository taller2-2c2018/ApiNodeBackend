'use strict'

const errorGetter = require('./errors')
const bcrypt = require('bcrypt')

function syncForEach(array, callback) {
  let promise = new Promise((resolve, reject) => {
    let promises = []
    let values
    for (let index = 0; index < array.length; index++) {
      let response = callback(array[index], index, array)
      if (response) promises.push(response)
    }
    Promise.all(promises)
      .then((responses) => {
        values = responses
        resolve(values)
      }).catch((e) => {
        reject(errorGetter.getServiceError(e.errors))
      })
  })
  return promise
}

function asignarHash(parametros,campo){
  campo = campo || '_rev'
  parametros[campo] = bcrypt.hashSync(JSON.stringify(parametros), bcrypt.genSaltSync(10))
  return parametros
}

function doStep(array, fn, index, maxStep){
  let promise = new Promise((resolve)=>{
    if(index < array.length && index < maxStep){
      fn(array[index])
        .then(()=>{
          let newIndex = index + 1
          doStep(array,fn,newIndex,maxStep)
            .then(()=>{
              resolve()
            })
        })
    } else {
      resolve()
    }
  })
  return promise
}

function awaitSyncForEach(array, step, fn) {
  let promise = new Promise((resolve)=>{
    let promises = []
    for (let i = 0; i < array.length; i += step) {
      let promise = new Promise((resolve)=>{
        let maxStep = i + step
        doStep(array, fn, i, maxStep)
          .then(()=>{
            resolve()
          })
      })
      promises.push(promise)
    }
    Promise.all(promises).then(()=>{
      resolve()
    })
  })
  return promise
}

function secureAwaitSyncForEach(array, fn) {
  return awaitSyncForEach(array, Math.ceil(array.length/5), fn)
}


const validateParams = (params, necessaryParams) => {
  let errors = []
  necessaryParams.forEach(param => {
    if (params[param] === undefined) {
      errors.push(param)
    }
  })
  return errors
}

const getFieldsFromParams = (params) => {
  let fields = Object.keys(params)
    .filter(item => item !== 'pk' &&  item !== 'id')  
  return fields
}

exports.syncForEach = syncForEach
exports.awaitSyncForEach = awaitSyncForEach
exports.secureAwaitSyncForEach = secureAwaitSyncForEach
exports.asignarHash = asignarHash
exports.validateParams = validateParams
exports.getFieldsFromParams = getFieldsFromParams
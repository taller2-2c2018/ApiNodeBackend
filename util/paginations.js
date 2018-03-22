'use strict'

const Op = require('sequelize').Op

const REGEX_UN_NUMERO_EN_ADELANTE = /^\d+ *-$/
const REGEX_UN_NUMERO_PARA_ATRAS = /^- *\d+$/
const REGEX_RANGO_NUMEROS = /^\d+ *- *\d+$/
const REGEX_NUMEROS_SEPARADOS_POR_COMAS = /^[0-9]+( *, *[0-9]+)+$/

const obtenerPaginacion = (cantidadResultados,offset,limit,cantidad) => {
  let pagination = {
    'total_count': cantidad,
    'result_count': cantidadResultados,
    'offset': offset,
    'limit': limit
  }
  return pagination
}

const obtenerValoresSeparadosPorComas = (numeros) =>{
  const valorInicial = '(po.numero_origen in ('
  let valores = valorInicial
  numeros.forEach(elemento => {
    if(valores !== valorInicial){
      valores += ','+elemento
    } else {
      valores += elemento
    }
  })
  valores += '))'
  return valores
}

const obtenerRawQuerySegunFiltro = (filtro, campo) => {
  filtro = filtro.trim()
  let whereClause = ''
  if(REGEX_UN_NUMERO_EN_ADELANTE.test(filtro)){
    let numero = filtro.match(/\d+/g).map(Number)[0]
    whereClause = '('+campo+'>='+numero+')'
  } else if (REGEX_UN_NUMERO_PARA_ATRAS.test(filtro)) {
    let numero = filtro.match(/\d+/g).map(Number)[0]
    whereClause = '('+campo+'<='+numero+')'
  } else if (REGEX_RANGO_NUMEROS.test(filtro)) {
    let numeroDesde = filtro.match(/\d+/g).map(Number)[0]
    let numeroHasta = filtro.match(/\d+/g).map(Number)[1]
    whereClause = '('+campo+'>='+numeroDesde+' and '+campo+'<='+numeroHasta+')'    
  } else if (REGEX_NUMEROS_SEPARADOS_POR_COMAS.test(filtro)) {
    let numeros = filtro.match(/\d+/g).map(Number)
    whereClause = obtenerValoresSeparadosPorComas(numeros)
  } else {
    whereClause = '('+campo+'='+filtro+')'
  }
  return whereClause
}

const obtenerFiltrosPorNumeracion = (filtro) => {
  filtro = filtro.trim()
  let whereClause = {}
  if(REGEX_UN_NUMERO_EN_ADELANTE.test(filtro)){
    let numero = filtro.match(/\d+/g).map(Number)[0]
    whereClause[Op.gte] = numero
  } else if (REGEX_UN_NUMERO_PARA_ATRAS.test(filtro)) {
    let numero = filtro.match(/\d+/g).map(Number)[0]
    whereClause[Op.lte] = numero
  } else if (REGEX_RANGO_NUMEROS.test(filtro)) {
    let numeroDesde = filtro.match(/\d+/g).map(Number)[0]
    let numeroHasta = filtro.match(/\d+/g).map(Number)[1]
    whereClause[Op.gte] = numeroDesde
    whereClause[Op.lte] = numeroHasta
  } else if (REGEX_NUMEROS_SEPARADOS_POR_COMAS.test(filtro)) {
    let numeros = filtro.match(/\d+/g).map(Number)
    whereClause[Op.in] = numeros
  } else {
    whereClause[Op.eq] = filtro
  }
  return whereClause
}

const filtrarPorNumeracion = (numeroFiltro,filtro) => {
  filtro = filtro.trim()
  if(REGEX_UN_NUMERO_EN_ADELANTE.test(filtro)){
    let numeroDesde = filtro.match(/\d+/g).map(Number)[0]
    return numeroFiltro >= numeroDesde
  } else if (REGEX_UN_NUMERO_PARA_ATRAS.test(filtro)) {
    let numeroHasta = filtro.match(/\d+/g).map(Number)[0]
    return numeroFiltro <= numeroHasta
  } else if (REGEX_RANGO_NUMEROS.test(filtro)) {
    let numeroDesde = filtro.match(/\d+/g).map(Number)[0]
    let numeroHasta = filtro.match(/\d+/g).map(Number)[1]
    return (numeroFiltro >= numeroDesde ||
    numeroFiltro <= numeroHasta)
  } else if (REGEX_NUMEROS_SEPARADOS_POR_COMAS.test(filtro)) {
    let numeros = filtro.match(/\d+/g).map(Number)
    return numeros.includes(numeroFiltro)
  } else {
    return numeroFiltro = parseInt(filtro)
  }
}

exports.filtrarPorNumeracion = filtrarPorNumeracion
exports.obtenerPaginacion = obtenerPaginacion
exports.obtenerFiltrosPorNumeracion = obtenerFiltrosPorNumeracion
exports.obtenerRawQuerySegunFiltro = obtenerRawQuerySegunFiltro

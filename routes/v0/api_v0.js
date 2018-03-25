var express = require('express')
var app = express()

var apiUsuarios = require('./api/usuarios')
var apiRoles = require('./api/roles')
var apiOrganismos = require('./api/organismos')
var apiPermisos = require('./api/permisos')
var apiAuth = require('./auth/routes')

app.use('/api/usuarios', apiUsuarios)
app.use('/api/roles', apiRoles)
app.use('/api/organismos', apiOrganismos)
app.use('/api/permisos', apiPermisos)
app.use('/api/token', apiAuth)

module.exports = app
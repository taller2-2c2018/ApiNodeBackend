var express = require('express')
var app = express()

var apiUsuarios = require('./api/usuarios')
var apiRoles = require('./api/roles')
var apiPermisos = require('./api/permisos')
var apiAuth = require('./auth/routes')
var apiFiles = require('./api/files')

app.use('/api/usuarios', apiUsuarios)
app.use('/api/roles', apiRoles)
app.use('/api/permisos', apiPermisos)
app.use('/api/token', apiAuth)
app.use('/api/files', apiFiles)

module.exports = app
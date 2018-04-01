var express = require('express')
var app = express()

var apiUsuarios = require('./api/usuarios')
var apiRoles = require('./api/roles')
var apiPermisos = require('./api/permisos')
var apiAuth = require('./auth/routes')
var apiAuthorize = require('./auth/authorize')
var apiFiles = require('./api/files')
var apiServers = require('./api/servers')

app.use('/api/usuarios', apiUsuarios)
app.use('/api/roles', apiRoles)
app.use('/api/permisos', apiPermisos)
app.use('/api/token', apiAuth)
app.use('/api/authorize', apiAuthorize)
app.use('/api/files', apiFiles)
app.use('/api/servers', apiServers)

module.exports = app
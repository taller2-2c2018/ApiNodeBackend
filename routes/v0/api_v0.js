var express = require('express')
var app = express()

var apiUsuarios = require('./api/usuarios')
var apiRoles = require('./api/roles')
var apiPermisos = require('./api/permisos')
var apiAuth = require('./auth/routes')
var apiFiles = require('./api/files')
var apiUsers = require('./api/users')
var apiServers = require('./api/servers')
var apiAuthorizations = require('./api/authorization')

app.use('/api/usuarios', apiUsuarios)
app.use('/api/roles', apiRoles)
app.use('/api/permisos', apiPermisos)
app.use('/api/token', apiAuth)
app.use('/api/files', apiFiles)
app.use('/api/users', apiUsers)
app.use('/api/servers', apiServers)
app.use('/api/authorization', apiAuthorizations)

module.exports = app
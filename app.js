let express = require('express')
let logger = require('morgan')
let bodyParser = require('body-parser')
let apiVersion0 = require('./routes/v0/api_v0')
let responser = require('./util/responser')

let app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept')
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  next()
})

if (process.env.PRODUCTION_HEROKU){
  const fs = require('fs')
  const path = require('path')
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
  // setup the logger
  app.use(logger('combined', {stream: accessLogStream}))
} else {
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/v0', apiVersion0)

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {}
  // send an error message
  res
    .status(err.status || 500)
    .send(responser.createResponse(err.status || 500, err.message,null))
})

module.exports = app

const models = require('../models/sequelize')
const fileService = require('../services/fileService')(models)
const responser = require('../util/responser')

const listFiles = async function (req, res) {
  let files = await fileService.list()
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadataCollection(res.statusCode, files, 'Files'))
}

const createFile = async function (req, res) {
  let response = await fileService.create(req.file, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const uploadFile = async function (req, res) {
  let response = await fileService.upload(req.file, req.body)
  res.statusCode = responser.codes.CREATED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const deleteFile = async function (req, res) {
  let response = await fileService.delete(req.params.file_id)
  res.statusCode = responser.codes.ACCEPTED
  res.json(responser.createSuccessResponse(res.statusCode, response))
}

const getFile = async function (req, res) {
  let filename = await fileService.get(req.params.file_id)
  let fullFileName = __dirname + '/../uploads/' + filename
  res.download(fullFileName) 
}

const updateFile = async function (req, res) {
  let response = await fileService.update(req.params.file_id, req.body)
  res.statusCode = responser.codes.OK
  res.json(responser.createSuccessResponseWithMetadata(res.statusCode, response, 'File'))
}

module.exports = {
  v0: {
    listFiles: listFiles,
    createFile: createFile,
    uploadFile: uploadFile,
    deleteFile: deleteFile,
    getFile: getFile,
    updateFile: updateFile,
  }
}
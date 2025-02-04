const express = require('express')
const FilesController = require('./files.controller')

const router = express.Router()

router.post('/process-excel-file',FilesController.extractDataFromExcel)

module.exports = router
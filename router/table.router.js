const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {createTable, openTableFor, getOpenFolder, deleteTable, createTableForInfo} = require('../controller/table.controller')

router.get('/open/province/or/republic', protect, openTableFor)
router.get('/open/folder/:id', protect, getOpenFolder)
router.get('/create/for/:id', protect, createTableForInfo)
router.post('/create/:id', protect, createTable)
router.delete('/delete/:id', protect, deleteTable)

module.exports = router

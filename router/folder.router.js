const {Router} = require('express')
const router = Router()


const {protect} = require('../middlewares/auth')

const {createFolder, getFolder} = require('../controller/folder.controller')

router.get('/get/:id', protect, getFolder)
router.post('/create/:id', protect, createFolder)


module.exports = router

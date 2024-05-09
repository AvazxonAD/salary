const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {
    createFile,
    getById
} = require('../controller/file.controller')

router.get('/get/:id', protect, getById)
router.post('/create/:id', protect, createFile)


module.exports = router
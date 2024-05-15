const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {
    createFile,
    getById,
    updateFile,
    deleteFile,
    getFileForPage
} = require('../controller/file.controller')

router.get('/get/page/for', protect, getFileForPage)
router.get('/get/:id',protect, getById)
router.post('/create/:id',protect, createFile)
router.put('/put/:id',protect, updateFile)
router.delete('/delete/:id',protect, deleteFile)

module.exports = router
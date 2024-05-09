const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {
    createFile,
    getById,
    updateFile,
    deleteFile
} = require('../controller/file.controller')

router.get('/get/:id', getById)
router.post('/create/:id', createFile)
router.put('/put/:id', updateFile)
router.delete('/delete/:id', deleteFile)

module.exports = router
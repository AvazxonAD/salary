const {Router} = require('express')
const router = Router()


const {protect} = require('../middlewares/auth')

const {
    createFolder,
    openFolder,
    updateFolder,
    getFolderById,
    deleteFolder
} = require('../controller/folder.controller')

router.get('/get/:id',protect, getFolderById)
router.get('/open/:id', protect, openFolder)
router.post('/create/:id', protect, createFolder)
router.put('/put/:id', protect, updateFolder)
router.delete('/delete/:id', protect, deleteFolder)


module.exports = router

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

router.get('/get/:id', getFolderById)
router.get('/open/:id', openFolder)
router.post('/create/:id', createFolder)
router.put('/put/:id', updateFolder)
router.delete('/delete/:id', deleteFolder)


module.exports = router

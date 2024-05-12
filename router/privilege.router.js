const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {
    createPrivilege,
    getPrivilege,
    privilegeFindById,
    updatePrivilege,
    deletePrivilege
} = require('../controller/privilege.controller')

router.get('/get',protect, getPrivilege)
router.get('/get/:id',protect, privilegeFindById)
router.put('/put/:id',protect, updatePrivilege)
router.delete('/delete/:id',protect, deletePrivilege)
router.post('/create', protect, createPrivilege)

module.exports = router

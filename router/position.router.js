const {Router} = require('express')
const router = Router()

const {
    createPosition,
    getAllPosition,
    updatePosition,
    deletePosition,
    getPositionById
} = require('../controller/position.controller')

const {protect} = require('../middlewares/auth')

router.get('/get', protect, getAllPosition)
router.get('/get/:id', protect, getPositionById)
router.post('/create', protect, createPosition)
router.put('/put/:id',protect, updatePosition)
router.delete('/delete/:id',protect, deletePosition)

module.exports = router
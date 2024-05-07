const {Router} = require('express')
const router = Router()

const {
    getAllRank,
    createRank,
    updateRank,
    deleteRank,
    getRankById
} = require('../controller/rank.controller')

const {protect} = require('../middlewares/auth')

router.get('/get', protect, getAllRank)
router.get('/get/:id', protect, getRankById)
router.post('/create', protect, createRank)
router.put('/put/:id', protect, updateRank)
router.delete('/delete/:id', protect, deleteRank)

module.exports = router
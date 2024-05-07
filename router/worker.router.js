const {Router} = require('express')
const router = Router()

const {
    getAllWorker,
    createWorker,
    updateWorker,
    deleteWorker,
    getWorkerById
} = require('../controller/worker.controller')

const {protect} = require('../middlewares/auth')

router.get('/get', protect, getAllWorker)
router.get('/get/:id', protect, getWorkerById)
router.post('/create', protect, createWorker)
router.put('/put/:id', protect, updateWorker)
router.delete('/delete/:id', protect, deleteWorker)

module.exports = router


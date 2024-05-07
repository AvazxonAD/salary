const {Router} = require('express')
const router = Router()

const {
    getAllRegion,
    createRegion,
    updateRegion,
    deleteRegion,
    getRegionById
} = require('../controller/region.controller')

const {protect} = require('../middlewares/auth')

router.get('/get', protect, getAllRegion)
router.get('/get/:id', protect, getRegionById )
router.post('/create', protect, createRegion)
router.put('/put/:id', protect, updateRegion)
router.delete('/delete/:id', protect, deleteRegion)

module.exports = router

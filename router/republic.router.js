const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {getRepublicById, getAllProvince} = require('../controller/republic.controller')


router.get('/get/republic', protect, getRepublicById )
router.get('/get/province', protect, getAllProvince)

module.exports = router

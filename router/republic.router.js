const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {getRepublic, getAllProvince} = require('../controller/republic.controller')


router.get('/get/republic', protect, getRepublic )
router.get('/get/province', protect, getAllProvince)

module.exports = router

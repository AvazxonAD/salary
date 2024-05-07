const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {getProvinceById} = require('../controller/province.controller')

router.get('/get/:id', protect, getProvinceById)


module.exports = router

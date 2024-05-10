const {Router} = require('express')
const router = Router()

const {protect} = require('../middlewares/auth')

const {getMinimum, updateMinimum} = require('../controller/minimum.controller')

router.get('/get',protect, getMinimum)
router.put('/put',protect, updateMinimum)

module.exports = router 
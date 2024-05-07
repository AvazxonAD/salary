const {Router} = require('express')
const router = Router()

const {login, getProfile, updatePassword} = require("../controller/auth.controller")

const {protect} = require('../middlewares/auth')

router.post('/login',login )
router.get('/get', protect, getProfile)
router.put('/put', protect, updatePassword)


module.exports = router
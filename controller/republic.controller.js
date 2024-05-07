const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
exports.getRepublic = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse("Siz tizimga kirmagansiz", 403))
    }
    if(req.user.name === "Respublika"){
        const republic = await Republic.find()
        res.status(200).json({
            success : true,
            data : republic[0]
        })
    }
    
})
exports.getAllProvince = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    if(req.user.name === "Respublika"){
        const province = await Province.find()
        return res.status(200).json({
            success : true,
            data : province
        })
    }
    return res.status(403).json({
        success : false,
        message : "Sizda ushbu funksiya uchun ruhsat mavjud emas"
    })

})


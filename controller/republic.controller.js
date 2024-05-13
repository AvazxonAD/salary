const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
//get republic 
exports.getRepublicById = asyncHandler(async (req, res, next) => {
    const republic = await Republic.findById(req.user.id)
    
    return res.status(200).json({ 
        success : true,
        data : republic
    })
})
// get all province 
exports.getAllProvince = asyncHandler(async (req, res, next) => {
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


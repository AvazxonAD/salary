const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Province = require('../models/province.model')

// get province 
exports.getProvinceById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    
    const province = await Province.findById(req.params.id)
    
    if(!province){
        return next(new ErrorResponse('Viloyat topilmadi', 403))
    }

    return res.status(200).json({ 
        success : true,
        data : province
    })
})

const Minimum = require('../models/minimumMonthly.model')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Position = require('../models/position.model')

// update minimum summa 
exports.updateMinimum = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz',403))
    }
    const oldMinimum = await Minimum.find()
    const {summa} = req.body
    if(!summa){
        return next(new ErrorResponse('Sorov bosh bolmasligi kerak', 403))
    }
    const newSumma = await Minimum.findByIdAndUpdate(oldMinimum[0]._id,
        {summa : summa},
        {new : true}
    )
    const positions = await Position.find()
    for(let position of positions){
        position.salary = summa * position.percent
        await position.save()
    }
    res.status(200).json({
        success : true,
        data : newSumma
    })
})
// get minimum summa 
exports.getMinimum = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz',403))
    }
    const oldMinimum = await Minimum.find()
    res.status(200).json({
        success :  true,
        data : oldMinimum[0]
    })
})
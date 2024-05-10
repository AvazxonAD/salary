const Minimum = require('../models/minimumMonthly.model')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Position = require('../models/position.model')
const File = require('../models/file.model')

// update minimum summa 
exports.updateMinimum = asyncHandler(async (req, res, next) => {
    if(req.user.name !== "Respublika"){
        return next(new ErrorResponse('Bu funksiyaga faqat respublika uchun ruhsat berilgan', 403))
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
    const files = await File.find()
    for(let file of files){
        file.selectSalary = file.selectPercent * summa
        await file.save()
    }
    res.status(200).json({
        success : true,
        data : newSumma
    })
})
// get minimum summa 
exports.getMinimum = asyncHandler(async (req, res, next) => {
    const minimum = await Minimum.find().lean()

    return res.status(200).json({
        success : true,
        data : minimum[0]
    })
})

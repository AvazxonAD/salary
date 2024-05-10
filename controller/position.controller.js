const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Position = require('../models/position.model')
const Minimum = require('../models/minimumMonthly.model')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
// get all position 
exports.getAllPosition = asyncHandler(async (req, res, next) => {
    const positions = await Position.find({parent : req.user.id}).sort({name: 1})
    return res.status(200).json({success : true, data : positions})
})

// create new position 
exports.createPosition = asyncHandler(async (req, res, next) => {
    let result = []
    let parent = null
    const republic = await Republic.findById(req.user.id)
    parent = republic
    if(!parent){
        const province = await Province.findById(req.user.id)
        parent = province
    }
    if(!parent){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    const minimum = await Minimum.find()
    const { positions } = req.body
    for(let position of positions){
        if (!position.name || !position.percent) {
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const test  = await Position.findOne({name : position.name, parent : req.user.id})
        if(test){
            return next(new ErrorResponse(`BU lavozim oldin kiritilgan ${test}`, 403))
        }
    }
    for(let position of positions){
        const newPosition = await Position.create({
            name : position.name.trim(),
            percent : position.percent,
            salary : position.percent * minimum[0].summa,
            parent : parent._id
        })
        parent.positions.push(newPosition._id)
        await parent.save()
        result.push(newPosition)
    }
    return res.status(200).json({
        success : true,
        data : result
    })
})
// update position 
exports.updatePosition = asyncHandler(async (req, res, next) => {
    const minimum = await Minimum.find()
    let name 
    if(req.body.name){
        name = req.body.name.trim()
    }
    if(name){
        const positionTest = await Position.findOne({ name : name, parent: req.user.id })
        if (positionTest){
            return next(new ErrorResponse('Bu lavozim oldin kiritilgan', 403))
        }
    }
    const position = await Position.findById(req.params.id) 
    position.name = name ||  position.name,
    position.percent = req.body.percent || position.percent,
    position.salary = req.body.percent * minimum[0].summa || position.percent * minimum[0].summa
    await position.save()
    res.status(200).json({
        success : true,
        data : position
    })
})
// delete position 
exports.deletePosition = asyncHandler(async (req, res, next) => {
    let after = null 
    const position = await Position.findByIdAndDelete(req.params.id)
    if(!position){
        return next(new ErrorResponse('Server xatolik', 403))
    }
    const republic = await Republic.findById(position.parent)
    after = republic 
    if(!after){
        const province = await Province.findById(position.parent)
        after = province
    }
    if(!after){
        return next(new ErrorResponse("Server xatolik", 403))
    }
    const index = after.positions.indexOf(position._id)
    after.positions.splice(index, 1)
    await after.save()
    await position.deleteOne()
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get position find By Id 
exports.getPositionById = asyncHandler(async (req, res, next) => {
    const position = await Position.findById(req.params.id)
    if(!position){
        return next(new ErrorResponse('Server xatolik', 403))
    }
    res.status(200).json({
        success : true,
        data : position
    })
})
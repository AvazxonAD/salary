const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Position = require('../models/position.model')
const Minimum = require('../models/minimumMonthly.model')

// get all position 
exports.getAllPosition = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse("Siz tizimga kirmagansiz", 403))
    }
    if(req.user.name === "Respublika"){
        const positions = await Position.find()
        return res.status(200).json({
            success : true,
            data : positions
        })
    }
    const positions = await Position.find({master : req.user.id})
    return res.status(200).json({
        success : true,
        data : positions
    })
})



// create new position 
exports.createPosition = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const minimum = await Minimum.find()
    const { positions } = req.body
    if(positions.length === 0 || !positions){
        return next(new ErrorResponse('Foydalanuvchi tomonidan xatolik kiritildi'))
    }
    let result = []
    for(let position of positions){
        if (!position.name || !position.percent) {
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const positionTest = await Position.findOne({ name: position.name.trim(), master: req.user.id })
    
        if (positionTest){
            return next(new ErrorResponse('Bu lavozim oldin kiritilgan', 403))
        }
    }
    for(let position of positions){
        const newPosition = await Position.create({
            name : position.name.trim(),
            percent : position.percent,
            salary: position.percent * minimum[0].summa,
            master: req.user.id
        })
        result.push(newPosition)
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

// update position 
exports.updatePosition = asyncHandler(async (req, res, next) => {
    const minimum = await Minimum.find()
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    let name 
    if(req.body.name){
        name = req.body.name.trim()
    }
    if(name){
        const positionTest = await Position.findOne({ name: name, master: req.user.id })    
        if (positionTest) {
            return next(new ErrorResponse('Bu lavozim oldin kiritilgan', 403))
        }
    }
    const oldPosition = await Position.findById(req.params.id) 
    const updatePosition = await Position.findByIdAndUpdate(oldPosition._id, {
        name : name ||  oldPosition.name,
        percent : req.body.percent || oldPosition.percent,
        salary : req.body.percent * minimum[0].summa || oldPosition.percent * minimum[0].summa
    }, {new : true})
    res.status(200).json({
        success : true,
        updatePosition
    })
})
// delete position 
exports.deletePosition = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    await Position.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get position find By Id 
exports.getPositionById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const position = await Position.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : position
    })
})
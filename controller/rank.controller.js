const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Rank = require('../models/rank.model')

// get all rank 
exports.getAllRank = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmgansiz', 403))
    }
    if(req.user.name === "Respublika"){
        const ranks = await Rank.find()
        return res.status(200).json({
            success : true,
            data : ranks
        })
    }
    const ranks = await Rank.find({master : req.user.id})
    return res.status(200).json({
        success : true,
        data : ranks
    })
})
// create rank 
exports.createRank = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmgansiz', 403))
    }
    const {ranks} = req.body
    if(ranks.length === 0 || !ranks){
        return next(new ErrorResponse('Foydalanuvchi tomonidan xatolik kiritildi'))
    }
    const result = []
    for(let rank of ranks){
        if(!rank.name || !rank.summa){
            return next(new ErrorResponse('Barcha sorovlar toldirilishi shart', 403))
        }
        const testRank = await Rank.findOne({name : rank.name.trim(), master : req.user.id})
        if(testRank){
            return next(new ErrorResponse('Bu nomli unvon kiritilgan', 403))
        }
    }
    for(let rank of ranks){
        const newRank = await Rank.create({
            name : rank.name.trim(),
            summa : rank.summa,
            master : req.user.id
        })
        result.push(newRank)
    }
    return res.status(200).json({
        success : true,
        data : result
    })
})

// update rank 
exports.updateRank = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmgansiz', 403))
    }
    const oldRank = await Rank.findById(req.params.id)
    let name 
    if(req.body.name){
        name = req.body.name.trim()
    }
    let rank 
    if(name){
        rank = await Rank.findOne({name : name, master : req.user.id})
    }
    if(rank){
        return next(new ErrorResponse('Bu unvon oldin kiritilgan', 403))
    }
    const updateRank = await Rank.findByIdAndUpdate(oldRank._id, {
        name : req.body.name || oldRank.name,
        summa : req.body.summa || oldRank.summa
    }, {new : true})
    res.status(200).json({
        success : true,
        data : updateRank
    })
})

// delete rank 
exports.deleteRank = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmgansiz', 403))
    }
    await Rank.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success : true,
        data : "Delete"
    })
})
// get rank find By Id 
exports.getRankById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const rank = await Rank.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : rank
    }) 
})
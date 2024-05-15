const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Rank = require('../models/rank.model')
const Republic = require('../models/republic.model.js')
const Province = require('../models/province.model') 
// get all rank 
exports.getAllRank = asyncHandler(async (req, res, next) => {
    const ranks = await Rank.find({parent : req.user.id}).sort({name: 1})
    return res.status(200).json({success : true, data : ranks})
})
// create rank 
exports.createRank = asyncHandler(async (req, res, next) => {
    const {ranks} = req.body
    const result = []
    let parent = null 
    const republic = await Republic.findById(req.user.id)
    parent = republic
    if(!parent){
        const province = await Province.findById(req.user.id)
        parent = province
    }
    if(!parent){
        return next(new ErrorResponse('Server xatolik', 403))
    }

    for(let rank of ranks){
        if(!rank.name || !rank.summa){
            return next(new ErrorResponse('Barcha sorovlar toldirilishi shart', 403))
        }
        const testRank = await Rank.findOne({name : rank.name.trim(), parent : parent._id})
        if(testRank){
            return next(new ErrorResponse(`Bu unvon oldin kiritilgan ${testRank}`, 403))
        }
        if(rank.name === "Fuqaro"){
            if(rank.summa !== 0 ){
                return next(new ErrorResponse("Oddiy fuqaro unvon puli 0 ga teng", 403))
            }
        }
    }
    for(let rank of ranks){
        const newRank = await Rank.create({
            name : rank.name.trim(),
            summa : rank.summa,
            parent : req.user.id
        })
        result.push(newRank)
        parent.ranks.push(newRank)
        await parent.save()
    }
    return res.status(200).json({
        success : true,
        data : result
    })
})
// update rank 
exports.updateRank = asyncHandler(async (req, res, next) => {
    const oldRank = await Rank.findById(req.params.id)
    if(!oldRank){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    let name 
    if(req.body.name){
        name = req.body.name.trim()
    }
    let rank 
    if(name){
        rank = await Rank.findOne({name : name, parent : req.user.id})
    }
    if(rank){
        return next(new ErrorResponse(`Bu unvon allqachon kiritilgan ${rank}`, 403))
    }
    oldRank.name = req.body.name || oldRank.name,
    oldRank.summa = req.body.summa || oldRank.summa
    await oldRank.save()

    res.status(200).json({
        success : true,
        data : oldRank
    })
})
// delete rank 
exports.deleteRank = asyncHandler(async (req, res, next) => {
    let after = null 
    const republic = await Republic.findById(req.user.id)
    after = republic
    if(!after){
        const province = await Province.findById(req.user.id)
        after = province
    }
    if(!after){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    const rank = await Rank.findById(req.params.id)
    const index = after.ranks.indexOf(rank._id)
    after.ranks.splice(index, 1)
    await after.save()
    await rank.deleteOne()

    return res.status(200).json({
        success : true,
        data : "Delete"
    })
})
// get rank find By Id 
exports.getRankById = asyncHandler(async (req, res, next) => {
    const rank = await Rank.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : rank
    }) 
})
asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Region = require('../models/region.model')
const Province = require('../models/province.model')
const Republic = require('../models/republic.model')
// get all region 
exports.getAllRegion = asyncHandler(async (req, res, next) => {
    const regions = await Region.find({parent : req.user.id}).sort({name: 1})
    res.status(200).json({
        success : true,
        data : regions
    })
})
// create new region 
exports.createRegion = asyncHandler(async (req, res, next) => {
    const {regions} = req.body
    let result = []
    let after = null
    const republic = await Republic.findById(req.user.id)
    after = republic
    if(!after){
        const province = await Province.findById(req.user.id)
        after = province 
    }
    if(!after){
        return next(new ErrorResponse('Server xatolik', 403))
    }

    for(let region of regions){
        if (!region.name || !region.type) {
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const RegionTest = await Region.findOne({ name: region.name.trim(), type : region.type.trim(), parent: after._id})
    
        if (RegionTest) {
            return next(new ErrorResponse(`Bu tumanga bu tip avval  kiritilgan : ${RegionTest}`, 403))
        }
    }
    for(let region of regions){
        const newRegion = await Region.create({
            name : region.name.trim(),
            type : region.type.trim(),
            parent: after._id
        })
        after.regions.push(newRegion._id)
        await after.save()
        result.push(newRegion)
    }
    res.status(200).json({
        success: true,
        data: result
    })
})
// update position 
exports.updateRegion = asyncHandler(async (req, res, next) => {
    let name
    let type  
    if(req.body.name){
        name = req.body.name.trim()
    }
    if(req.body.type){
        type = req.body.type.trim()
    }
    if(name && type){
        const regionTest = await Region.findOne({ name: name, type : type, parent: req.user.id })    
        if (regionTest) {
            return next(new ErrorResponse(`Bu tumanda bu tip kiritilgan`, 403))
        }
    }    
    const oldRegion = await  Region.findById(req.params.id) 
    let typeTest
    let nameTest
    console.log(oldRegion.name)
    if(type){
        typeTest = await Region.findOne({name : oldRegion.name, type : type, parent : req.user.id})
        if(typeTest){
            return next(new ErrorResponse('Bu tumanda bu tip kiritilgan', 403))
        }
    }
    if(name){
        nameTest = await Region.findOne({name : name, type : oldRegion.type, parent : req.user.id})
        if(nameTest){
            return next(new ErrorResponse('Bu tuman nomidan shu tip uchun foydalanilgan', 403))
        }
    }
    oldRegion.name = name ||  oldRegion.name,
    oldRegion.type = type || oldRegion.type,
    oldRegion.save()
    res.status(200).json({
        success : true,
        oldRegion
    })
})
// delete position 
exports.deleteRegion = asyncHandler(async (req, res, next) => {
    let parent = null 
    const republic = await Republic.findById(req.user.id)
    parent = republic
    if(!parent){
        const province = await Province.findById(req.user.id)
        parent = province
    }
    if(!parent){
        return next(new ErrorResponse("Server xatolik", 403))
    }
    const region = await Region.findById(req.params.id)
    const index = parent.regions.indexOf(region._id)
    parent.regions.splice(index, 1)
    await parent.save()
    await region.deleteOne()
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get region find By Id 
exports.getRegionById = asyncHandler(async (req, res, next) => {

    const region = await Region.findById(req.params.id)
    if(!region){
        return next(new ErrorResponse('Server xatolik', 403))
    }
    res.status(200).json({
        success : true,
        data : region
    }) 
})
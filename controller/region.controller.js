asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Region = require('../models/region.model')

// get all region 
exports.getAllRegion = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    if(req.user.name === "Respublika"){
        const regions = await Region.find()
        return res.status(200).json({
            success : true,
            data : regions
        })
    }
    const regions = await Region.find({master : req.user.id})
    res.status(200).json({
        success : true,
        data : regions
    })
})
// create new region 
exports.createRegion = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const {regions} = req.body
    if(regions.length === 0 || !regions){
        return next(new ErrorResponse("Foydalanuvchi tomonidan xatolik"))
    }
    let result = []
    for(let region of regions){
        if (!region.name || !region.type) {
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const RegionTest = await Region.findOne({ name: region.name.trim(), type : region.type.trim(), master: req.user.id })
    
        if (RegionTest) {
            return next(new ErrorResponse('Bu tumanga bu tip avval  kiritilgan', 403))
        }
    }
    for(let region of regions){
        const newRegion = await Region.create({
            name : region.name.trim(),
            type : region.type.trim(),
            master: req.user.id
        })
        result.push(newRegion)
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

// update position 
exports.updateRegion = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    let name
    let type  
    if(req.body.name){
        name = req.body.name.trim()
    }
    if(req.body.type){
        type = req.body.type.trim()
    }
    if(name && type){
        const regionTest = await Region.findOne({ name: name, type : type, master: req.user.id })    
        if (regionTest) {
            return next(new ErrorResponse('Bu tumanda bu tip kiritilgan', 403))
        }
    }    
    const oldRegion = await  Region.findById(req.params.id) 
    let typeTest
    if(type){
        typeTest = await Region.findOne({name : oldRegion.name, type : type, master : req.user.id})
        if(typeTest){
            return next(new ErrorResponse('Bu tumanda bu tip kiritilgan', 403))
        }
    }
    const updateRegion = await Region.findByIdAndUpdate(oldRegion._id, {
        name : name ||  oldRegion.name,
        type : type || oldRegion.type,
    }, {new : true})
    res.status(200).json({
        success : true,
        updateRegion
    })
})
// delete position 
exports.deleteRegion = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    await Region.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get region find By Id 
exports.getRegionById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const region = await Region.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : region
    }) 
})
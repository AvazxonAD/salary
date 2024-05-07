const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utils/errorResponse")

// login post 
exports.login = asyncHandler(async (req, res, next) => {
    const {name, password} = req.body
    const republic = await Republic.findOne({name})
    if(republic){
        const testParolRepublic = await republic.matchPassword(password)
        if(!testParolRepublic){
            return next(new ErrorResponse("Parol yoki bolim natog\'ri kiritildi", 403))
        }
        const tokenRepublic = republic.jwtToken()
        return res.status(200).json({
            success : true,
            data : republic,
            token : tokenRepublic
        })
    }
    const province = await Province.findOne({name})
    const testParolProvince = await province.matchPassword(password)
    if(!testParolProvince){
        return next(new ErrorResponse("Parol yoki bolim natog\'ri kiritildi", 403))
    }
    const tokenProvince = province.jwtToken()
    return res.status(200).json({
        success : true,
        data : province,
        token : tokenProvince
    })
    
})
// get profile 
exports.getProfile = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    if(req.user.name === "Respublika"){
        const republic = Republic.findOne({name : req.user.name})
        res.status(200).json({
            success : true,
            data : republic
        })
    }
    const province = await Province.findOne({name : req.user.name})
    res.status(200).json({
        success : true,
        data : province
    })
})
// update password 
exports.updatePassword = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        return next(new ErrorResponse('Sorovlar bosh bolmasligi kerak', 403))
    }
    if(req.user.name === "Respublika"){
        const republic = await Republic.findOne({name : req.user.name})
        const test = await republic.matchPassword(oldPassword)
        if(!test){
            return next(new ErrorResponse("Parol notog'\ri kiritildi"))
        }
        republic.password = newPassword
        await republic.save()
    }
    const province = await Province.findOne({name : req.user.name})
    const test = await province.matchPassword(oldPassword)
    if(!test){
        return next(new ErrorResponse("Parol notog'\ri kiritildi", 403))
    }
    province.password = newPassword
    await province.save()
    return res.status(200).json({
        success : true,
        data : province
    })
})
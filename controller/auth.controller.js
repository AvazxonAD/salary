const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utils/errorResponse")

// login post 
exports.login = asyncHandler(async (req, res, next) => {
    const {name, password} = req.body
    let after = null 
    const republic = await Republic.findOne({name})
    after = republic 
    if(!after){
        const province = await Province.findOne({name})
        after = province
    }
    if(!after){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    const testParol = await after.matchPassword(password.trim())
    if(!testParol){
        return next(new ErrorResponse('Parol xato kiritildi', 403))
    }
    const token = after.jwtToken()
    return res.status(200).json({
        success : true,
        data : after,
        token,
    })
})
// get profile 
exports.getProfile = asyncHandler(async (req, res, next) => {
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
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        return next(new ErrorResponse('Sorovlar bo\'sh bolmasligi kerak', 403))
    }
    if(newPassword.length < 6){
        return next(new ErrorResponse('Parol uzunligi 6 ta belgidan kam bolmasligi kerak', 403))
    }
    let after = null 
    const republic = await Republic.findById(req.params.id)
    after = republic
    if(!after){
        const province = await Province.findById(req.params.id)
        after = province
    }
    if(!after){
        return next(new ErrorResponse('Server xatolik', 403))
    }
    const match = await after.matchPassword(oldPassword.trim())
    if(!match){
        return next(new ErrorResponse('Notog\'ri parol kiritildi', 403))
    }
    after.password = newPassword.trim()
    await after.save()
    return res.status(200).json({
        success : true,
        message : `O'zgartrildi yangi parol : ${newPassword.trim()}`
    })
})

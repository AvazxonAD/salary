const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require('../utils/errorResponse')
const Province = require('../models/province.model')
const Republic = require('../models/republic.model')
const Privilege = require('../models/privilege.model')

// create privilege 
exports.createPrivilege = asyncHandler(async (req, res, next) => {
    let result = []
    const {privileges} = req.body
    for(let privilege of privileges){
        if(!privilege.name || !privilege.summa){
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
        const test = await Privilege.findOne({name : privilege.name.trim(), parent : req.user.id})
        if(test){
            return next(new ErrorResponse('Bu imtiyoz turi oldin kiritilgan', 403))
        }
    }
    let after = null 
    const province = await Province.findById(req.user.id)
    after = province
    if(!after){
        const republic = await Republic.findById(req.user.id)
        after = republic
    }
    if(!after){
        return next(new ErrorResponse("Server xatolik", 403))
    }
    for(let privilege of privileges){
        const newPrivilege = await Privilege.create({
            name : privilege.name.trim(),
            summa : privilege.summa,
            parent : after._id
        })
        after.privileges.push(newPrivilege._id)
        await after.save()
        result.push(newPrivilege)
    }
    return res.status(200).json({
        success : true,
        data : result
    })
})
// get privilege 
exports.getPrivilege = asyncHandler(async (req, res, next) => {
    const privileges = await Privilege.find({parent : req.user.id})
    return res.status(200).json({success : true, data : privileges})
})
// update privileges 
exports.updatePrivilege = asyncHandler(async (req, res, next) => {
    const privilege  = await Privilege.findById(req.params.id)
    let name = null  
    if(req.body.name){
        name = req.body.name.trim()
    }
    if(name){
        const test = await Privilege.findOne({name : name, parent : req.user.id })
        if(test){
            return next(new ErrorResponse('Bu imtiyoz oldin kiritilgan', 403))
        }
    }
    privilege.name = name || privilege.name
    privilege.summa = req.body.summa || privilege.summa
    await privilege.save()
    return res.status(200).json({
        success : true,
        data : privilege
    })
})
// privilege findById
exports.privilegeFindById = asyncHandler(async (req, res, next) => {
    const privilege = await Privilege.findById(req.params.id)
    return res.status(200).json({success : true, data : privilege})
})
// delete privilege 
exports.deletePrivilege = asyncHandler(async (req, res, next) => {
    let after = null 
    const republic = await Republic.findById(req.user.id)
    after = republic
    if(!after){
        const province = await Province.findById(req.user.id)
        after = province
    }
    const privilege = await Privilege.findById(req.params.id)
    const index = after.privileges.indexOf(privilege._id)
    after.privileges.splice(index, 1)
    await after.save()
    await privilege.deleteOne()
    return res.status(200).json({success : true, data : "Delete"})
})

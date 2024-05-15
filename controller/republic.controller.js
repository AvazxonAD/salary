const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const File = require('../models/file.model')
const Folder = require('../models/folder.model')
//get republic 
exports.getRepublicById = asyncHandler(async (req, res, next) => {
    const republic = await Republic.findById(req.user.id)
    let folders = null 
    let files = null 
    if(republic.folders.length > 0){
        folders = await Folder.find({_id : {$in : republic.folders}})
    }
    if(republic.files.length > 0){
        files = await File.find({_id : {$in : republic.files}})
    }
    return res.status(200).json({ 
        success : true,
        data : republic,
        folders,
        files
    })
})
// get all province 
exports.getAllProvince = asyncHandler(async (req, res, next) => {
    if(req.user.name === "Respublika"){
        const province = await Province.find()
        return res.status(200).json({
            success : true,
            data : province
        })
    }
    return res.status(403).json({
        success : false,
        message : "Sizda ushbu funksiya uchun ruhsat mavjud emas"
    })

})
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Province = require('../models/province.model')
const File = require('../models/file.model')
const Folder = require('../models/folder.model')
// get province 
exports.getProvinceById = asyncHandler(async (req, res, next) => {
    let folders = null
    let files = null 
    const province = await Province.findById(req.params.id)
    if(province.files.length > 0){
        files = await File.find({_id : {$in : province.files}})
    }
    if(province.folders.length > 0){
        folders = Folder.find({_id : {$in : province.folders}})
    }
    return res.status(200).json({ 
        success : true,
        data : province,
        folders, 
        files
    })
})

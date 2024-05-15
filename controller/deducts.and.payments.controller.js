const asyncHandler = require('../middlewares/asyncHandler')
const errorResponse = require('../utils/errorResponse')
const File = require('../models/file.model')
const Worker = require('../models/worker.model')
// get all workers
exports.getAllFiles = asyncHandler(async (req, res, next) => {
    const files = await Worker.find({master : req.user.id}).sort({FIOlotin : 1})
    return res.status(200).json({success : true, data : files})
})
// create new worker
exports.createWorker = asyncHandler(async (req, res, next) => {
    
})


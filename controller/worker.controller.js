const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Worker = require('../models/worker.model')

// get all position 
exports.getAllWorker = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse("Siz tizimga kirmagansiz", 403))
    }
    if(req.user.name === "Respublika"){
        const workers = await Worker.find()
        return res.status(200).json({
            success : true,
            data : workers
        })
    }
    const workers = await Worker.find({master : req.user.id})
    return res.status(200).json({
        success : true,
        data : workers
    })
})



// create new position 
exports.createWorker = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const { workers } = req.body
    if(workers.length === 0 || !workers){
        return next(new ErrorResponse('Foydalanuvchi tomonidan xatolik kiritildi'))
    }
    let result = []
    for(let worker of workers){
        if (!worker.FIOkril || !worker.FIOlotin || !worker.inn || !worker.inps || !worker.plastic || !worker.dateOfEmployment){
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const workerTestLotin = await Worker.findOne({ FIOlotin: worker.FIOlotin.trim()})
        if (workerTestLotin){
            return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
        }
        const workerTestKril = await Worker.findOne({ FIOkril : worker.FIOkril.trim()})
        if (workerTestKril){
            return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
        }
        innTest = await Worker.findOne({inn : worker.inn})
        if(innTest){
            return next(new ErrorResponse('Bu innga ega fuqaro oldin kiritilgan',403))
        }
    }
    for(let worker of workers){
        let date_string = worker.dateOfEmployment;
        let date_parts = date_string.split("T");
        date = date_parts[0];
        const newWorker = await Worker.create({
            FIOlotin : worker.FIOlotin.trim(),
            FIOkril : worker.FIOkril.trim(),
            inn : worker.inn,
            inps : worker.inps,
            plastic : worker.plastic,
            master: req.user.id,
            dateOfEmployment : date
        })
        result.push(newWorker)
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

// update worker  
exports.updateWorker = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    let lotin
    let kril
    const oldWorker = await Worker.findById(req.params.id) 
    if(oldWorker.FIOkril !== req.body.FIOkril && oldWorker.FIOlotin !== req.body.FIOlotin){
        if(req.body.FIOlotin && req.body.FIOkril){
            lotin = req.body.FIOlotin.trim()
            kril = req.body.FIOkril.trim()
        }
        if(lotin && kril){
            const FIOTest = await Worker.findOne({ FIOlotin: lotin, FIOkril : kril})    
            if (FIOTest) {
                return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
            }
        }
    }
    if(oldWorker.inn !== req.body.inn){
        testInn = await Worker.findOne({inn : req.body.inn})
        if(testInn){
            return next(new ErrorResponse('Bu inn ga ega fuqaro mavjud',403))
        } 
    }
    let date_string
    let date_parts
    let date 
    if(req.body.dateOfEmployment){
        date_string = req.body.dateOfEmployment;
        date_parts = date_string.split("T");
        date = date_parts[0];
    }
    const updateWorker = await Worker.findByIdAndUpdate(oldWorker._id, {
        FIOlotin : lotin ||  oldWorker.FIOlotin,
        FIOkril : kril || oldWorker.FIOkril,
        inn : req.body.inn || oldWorker.inn,
        inps : req.body.inps || oldWorker.inps,
        plastic : req.body.plastic || oldWorker.plastic,
        dateOfEmployment : date || oldWorker.dateOfEmployment
    }, {new : true})
    res.status(200).json({
        success : true,
        updateWorker
    })
})
// delete position 
exports.deleteWorker = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    await Worker.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get position find By Id 
exports.getWorkerById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const worker = await Worker.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : worker
    })
})
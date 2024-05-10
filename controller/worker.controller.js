const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Worker = require('../models/worker.model')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
// get all workers 
exports.getAllWorker = asyncHandler(async (req, res, next) => { 
    const workers = await Worker.find({parent : req.user.id}).sort({FIOlotin : 1})
    return res.status(200).json({
        success : true,
        data : workers
    })
})
// create new position 
exports.createWorker = asyncHandler(async (req, res, next) => {
    const { workers } = req.body
    let result = []
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

    for(let worker of workers){
        if (!worker.FIOkril || !worker.FIOlotin || !worker.inn || !worker.inps || !worker.plastic || !worker.dateOfEmployment){
            return next(new ErrorResponse("Sorovlar hammasi toldirilishi shart", 403))
        }
        const workerTestLotin = await Worker.findOne({ FIOlotin: worker.FIOlotin.trim(), parent : parent._id})
        if (workerTestLotin){
            return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
        }
        const workerTestKril = await Worker.findOne({ FIOkril : worker.FIOkril.trim(), parent : parent._id})
        if (workerTestKril){
            return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
        }
        innTest = await Worker.findOne({inn : worker.inn, parent : parent._id})
        if(innTest){
            return next(new ErrorResponse('Bu innga ega fuqaro oldin kiritilgan',403))
        }
    }
    for(let worker of workers){
        const newWorker = await Worker.create({
            FIOlotin : worker.FIOlotin.trim(),
            FIOkril : worker.FIOkril.trim(),
            inn : worker.inn,
            inps : worker.inps,
            plastic : worker.plastic,
            dateOfEmployment : worker.dateOfEmployment,
            parent: parent._id
        })
        parent.workers.push(newWorker._id)
        await parent.save()
        result.push(newWorker)
    }
    res.status(200).json({
        success: true,
        data: result
    })
})
// update worker  
exports.updateWorker = asyncHandler(async (req, res, next) => {
    let lotin
    let kril
    const worker = await Worker.findById(req.params.id) 
    if(worker.FIOkril !== req.body.FIOkril && worker.FIOlotin !== req.body.FIOlotin){
        if(req.body.FIOlotin && req.body.FIOkril){
            lotin = req.body.FIOlotin.trim()
            kril = req.body.FIOkril.trim()
        }
        if(lotin && kril){
            const FIOTest = await Worker.findOne({ FIOlotin: lotin, FIOkril : kril, parent : req.user.id })    
            if (FIOTest) {
                return next(new ErrorResponse('Bu fuqaro oldin kiritilgan', 403))
            }
        }
    }
    if(worker.inn !== req.body.inn){
        testInn = await Worker.findOne({inn : req.body.inn, parent : req.user.id})
        if(testInn){
            return next(new ErrorResponse('Bu inn ga ega fuqaro mavjud',403))
        } 
    }
    worker.FIOlotin = lotin ||  worker.FIOlotin,
    worker.FIOkril = kril || worker.FIOkril,
    worker.inn = req.body.inn || worker.inn,
    worker.inps = req.body.inps || worker.inps,
    worker.plastic = req.body.plastic || worker.plastic,
    worker.dateOfEmployment = req.body.dateOfEmployment || worker.dateOfEmployment
    await worker.save()
    res.status(200).json({
        success : true,
        data : worker
    })
})
// delete position 
exports.deleteWorker = asyncHandler(async (req, res, next) => {
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
    const worker = await Worker.findById(req.params.id)
    const index = parent.workers.indexOf(worker._id)
    parent.workers.splice(index, 1)
    await parent.save()
    await worker.deleteOne()
    return res.status(200).json({
        success : true,
        message : "Delete"
    })
})
// get position find By Id 
exports.getWorkerById = asyncHandler(async (req, res, next) => {
    const worker = await Worker.findById(req.params.id)
    if(!worker){
        return next(new ErrorResponse("Servrer xatolik", 403))
    }
    res.status(200).json({
        success : true,
        data : worker
    })
})
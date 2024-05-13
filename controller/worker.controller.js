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
// create new workers
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
    // tolovlar 
    let salary = null;
    let rank = null;
    let yearOfService = null;
    let apartmentPayment = null;
    let Fmc = null;
    let foodMoney = null;
    let wagesForHarm = null;
    let totalPayments = null 
    // ushlanmalar 
    let sportsFund = null
    let tradeUnion = null
    let incomeTax = null 
    let alimony = null 
    let penalty = null 
    let totalDeduction = null 
    for (let worker of workers) {
        // tolovlar 
        if (worker.payments.salary) {
            salary = worker.payments.salary;
        }else{salary = 0}
        if (worker.payments.rank) {
            rank = worker.payments.rank;
        }else{rank = 0}
        if(worker.payments.yearOfService && salary){
            const dateOfEmployment = new Date(worker.dateOfEmployment);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const dateEmploymentYear = dateOfEmployment.getFullYear();
            const difference = Math.abs(currentYear - dateEmploymentYear);
            
            if (difference < 5) {
                yearOfService = 0;
            } else if (difference >= 5 && difference < 10) {
                yearOfService = salary * 0.1;
            } else if (difference >= 10 && difference < 15) {
                yearOfService = salary * 0.2;
            } else if (difference >= 15 && difference < 20) {
                yearOfService = salary * 0.3;
            } else if (difference >= 20 && difference < 25) {
                yearOfService = salary * 0.4;
            } else if (difference >= 25 && difference < 30) {
                yearOfService = salary * 0.5;
            } else if (difference >= 30 && difference < 35) {
                yearOfService = salary * 0.6;
            } else if (difference >= 35 && difference < 40) {
                yearOfService = salary * 0.7;
            } else if (difference >= 40 && difference < 45) {
                yearOfService = salary * 0.8;
            } else if (difference >= 45 && difference < 50) {
                yearOfService = salary * 0.9;
            } else if (difference >= 50 && difference < 55) {
                yearOfService = salary * 1;
            }
        }else{yearOfService = 0}
        if(worker.payments.apartmentPayment){
            apartmentPayment = worker.payments.apartmentPayment
        }else{apartmentPayment = 0}
        if(worker.payments.Fmc && salary && rank){
            Fmc = (salary + rank) * 0.1
        }else{Fmc = 0}
        if(worker.payments.foodMoney){
            foodMoney = worker.payments.foodMoney
        }else{ foodMoney= 0}
        if(worker.payments.wagesForHarm && salary && rank){
            wagesForHarm = salary + rank + yearOfService 
        }else{wagesForHarm = 0}
        // jami tolovlar
        totalPayments = salary + rank + yearOfService + apartmentPayment + Fmc + foodMoney + wagesForHarm + totalPayments 
        // ushlanmalar
        if(worker.deductionFromSalary.sportsFund && salary){
            sportsFund = salary * 0.001 
        }else {sportsFund = 0 }
        if(worker.deductionFromSalary.tradeUnion &&  totalPayments){
            tradeUnion = totalPayments * 0.001
        }else{ tradeUnion = 0}
        if(worker.deductionFromSalary.incomeTax && worker.privilege && totalPayments){
            incomeTax = (totalPayments - worker.privilege) * 0.12 
        }else{ incomeTax = 0 }
        if(worker.deductionFromSalary.alimony.percent && totalPayments && incomeTax){
            alimony = (totalPayments - incomeTax) * (worker.deductionFromSalary.alimony.percent / 100)
        }else{ alimony = 0}
        if(worker.deductionFromSalary.penalty.penalty){
            if(worker.deductionFromSalary.penalty.salary && worker.deductionFromSalary.penalty.percent){
                penalty = salary * (worker.deductionFromSalary.penalty.percent / 100)
            }else if(worker.deductionFromSalary.penalty.rank && worker.deductionFromSalary.penalty.percent){
                penalty = rank * (worker.deductionFromSalary.penalty.percent /100)
            }else if(worker.deductionFromSalary.penalty.totalPayments && worker.deductionFromSalary.penalty.percent){
                penalty = totalPayments * (worker.deductionFromSalary.penalty.percent / 100)
            }else{penalty = 0}
        }else{ penalty = 0}
        // jami ushlanmalar
        totalDeduction = sportsFund + tradeUnion + incomeTax + alimony + penalty
        const newWorker = await Worker.create({
            FIOlotin : worker.FIOlotin.trim(),
            FIOkril : worker.FIOkril.trim(),
            inn : worker.inn,
            inps : worker.inps,
            plastic : worker.plastic,
            dateOfEmployment : worker.dateOfEmployment,
            privilege : worker.privilege,
            payments : {
                salary : worker.payments.salary,
                rank : worker.payments.rank,
                yearOfService,
                apartmentPayment,
                Fmc,
                foodMoney,
                wagesForHarm,
                totalPayments
            },
            deductionFromSalary : {
                sportsFund,
                tradeUnion,
                incomeTax,
                alimony, 
                penalty,
                totalDeduction
            },
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
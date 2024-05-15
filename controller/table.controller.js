const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse =  require('../utils/errorResponse')
const Table = require('../models/table.model')
const File = require('../models/file.model')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const Folder = require('../models/folder.model')


// get open table for 
exports.openTableFor = asyncHandler(async (req, res, next)=> {
    let parent = null
    let folders = null 
    let files = null
    let tables = null  
    const republic = await Republic.findById(req.user.id)
    parent = republic
    if(!parent){
        const province = await Province.findById(res.user.id)
        parent = province 
    }
    if(!parent){
        return next(new ErrorResponse("Server xatolik", 403))
    }
    if(parent && parent.folders.length > 0){
        folders = await Folder.find({_id : {$in : parent.folders}}).sort({name : 1})
    }
    if(parent && parent.files.length > 0){
        files = await File.find({_id : {$in : parent.files}}).select("FIOlotin").sort({name : 1}) 
    }
    if(parent && parent.tables.length > 0){
        tables = await Table.find({_id : {$in : parent.tables}}).sort({createdAt : -1})
    }
    return res.status(200).json({
        success : true,
        folders, 
        files,
        tables
    })
})
// get open folder table
exports.getOpenFolder = asyncHandler(async (req, res, next) => {
    let folders = null 
    let files = null
    let tables = null 
    const folder = await Folder.findById(req.params.id)
    if(folder.folders.length > 0){
        folders = await Folder.find({_id : {$in : folder.folders}})
    }
    if(folder.files.length > 0){
        files = await File.find({_id : {$in : folder.files}}).select("FIOlotin")
    }
    if(folder.tables.length > 0){
        tables = await Table.find({_id : {$in : folder.tables}})
    }
    return res.status(200).json({
        success : true,
        folders,
        files,
        tables
    })
})
// create table 
exports.createTable = asyncHandler(async (req, res, next) => {
    let parent = null
    const republic = await Republic.findById(req.params.id)
    parent = republic 
    if(!parent){
        const province = await Province.findById(req.params.id)
        parent = province
    }
    if(!parent){
        const folder = await Folder.findById(req.params.id)
        parent = folder
    }
    if(!parent){
        return next(new ErrorResponse('Server xatolik', 403))
    }
    let result = []
    const {tables, date} = req.body 
    let summa = null 
    for(let table of tables){
        const file = await File.findOne({selectLotin : table.FIO, parent : parent._id})
        if(!file){
            return next(new ErrorResponse("Bu F.I.O ga ega fuqaro topilmadi", 403))
        }
        const test = await Table.findOne({parent : req.params.id, FIO : table.FIO, date : table.date})
        if(test){
            return next(new ErrorResponse(`Bu fuqaro ish haqisi avval hisoblangan :  ${test.FIO}`))
        }
        if(table.workerDay){
            let oneDaySumma = file.selectSalary / table.currentDay
            summa = oneDaySumma * table.workerDay
        }
        else if(table.workerHour){
            let oneHourSumma = file.selectSalary / table.currentHour
            summa = oneHourSumma * table.workerHour
        }else {return next(new ErrorResponse("Fuqaroning qancha vaqt ishlagini bilib bolmayapti", 403))}
        const newTable = await Table.create({
            FIO : table.FIO,
            summa,
            parent : parent._id,
            date
        })
        parent.tables.push(newTable._id)
        await parent.save()

        result.push(newTable)
    }
    return res.status(200).json({success : true, data  : result})
})
// table create for info 
exports.createTableForInfo = asyncHandler(async (req, res, next) => {
    const files = await File.find({parent : req.params.id}).select("selectLotin selectSumma selectRank -_id")
    return res.status(200).json({success : true, data : files})
}) 
// delete table 
exports.deleteTable = asyncHandler(async (req, res, next) => {
    const table = await Table.findById(req.params.id)
    parent = null
    const republic = await Republic.findById(table.parent)
    parent = republic 
    if(!parent){
        const province = await Province.findById(table.parent)
        parent = province
        if(!parent){
            const folder = await Folder.findById(table.parent)
            parent = folder
            if(!parent){
                return next(new ErrorResponse('Server xatolik', 500))
            }
        }
    }
    const index = parent.tables.indexOf(table._id)
    parent.tables.splice(index, 1)
    await parent.save()
    await table.deleteOne()
    return res.status(200).json({success : true, message : "Delete"})
})

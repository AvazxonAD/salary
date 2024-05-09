const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Folder = require('../models/folder.model')
const File = require('../models/file.model')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const testFileName = require('../utils/test.fileName')

// create file 
exports.createFile = asyncHandler(async (req, res, next) => {
    const {files} = req.body
    const result = []
    for(let file of files){
        if(!file.selectPosition || !file.selectSalary || !file.selectPercent || !file.limit || !file.selectLotin || !file.selectKril || !file.budget || !file.selectType || !file.selectRegion || !file.selectSumma || !file.selectRank){
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
        }
    }
    const id = req.params.id
    const folder = await Folder.findById(id)
    if(folder){
        let testArray = []
        for(let id of folder.file){
            const file = await File.findById(id)
            testArray.push(file)
        }
        for(let file of testArray){
            for(let newFile of files){
                if(newFile.selectLotin === file.selectLotin && (newFile.limit + file.limit) > 1){
                    return next(new ErrorResponse('Bu fuqaro oldin royhatdan otgan yoki ish stavkasi 1 dan oshib ketyapti', 403))
                }
            }
        }
        for(let file of files){
            const newFile = await File.create({
                selectPosition : file.selectPosition,
                selectSalary : file.selectSalary,
                selectPercent: file.selectPercent,
                limit : file.limit,
                selectLotin : file.selectLotin,
                selectKril : file.selectKril,
                budget : file.budget,
                selectType : file.selectType,
                selectRegion : file.selectRegion,
                selectSumma : file.selectSumma,
                selectRank : file.selectRank,
                master : folder._id
            })
            folder.file.push(newFile._id)
            await folder.save()
            result.push(newFile)
        }
        return res.status(200).json({
            success : true,
            data : result
        })
    }
    const republic = await Republic.findById(id)
    if(republic){
        let testArray = []
        for(let id of republic.file){
            const file = await File.findById(id)
            testArray.push(file)
        }
        for(let file of testArray){
            for(let newFile of files){
                if(newFile.selectLotin === file.selectLotin && (newFile.limit + file.limit) > 1){
                    return next(new ErrorResponse('Bu fuqaro oldin royhatdan otgan yoki ish stavkasi 1 dan oshib ketyapti', 403))
                }
            }
        }
        for(let file of files){
            const newFile = await File.create({
                selectPosition : file.selectPosition,
                selectSalary : file.selectSalary,
                selectPercent: file.selectPercent,
                limit : file.limit,
                selectLotin : file.selectLotin,
                selectKril : file.selectKril,
                budget : file.budget,
                selectType : file.selectType,
                selectRegion : file.selectRegion,
                selectSumma : file.selectSumma,
                selectRank : file.selectRank,
                master : republic._id
            })
            republic.file.push(newFile._id)
            await republic.save()
            
            result.push(newFile)
        }
        return res.status(200).json({
            success : true,
            data : result
        })
    }
    const province = await Province.findById(id)
    if(province){
        let testArray = []
        for(let id of province.file){
            const file = await File.findById(id)
            testArray.push(file)
        }
        for(let file of testArray){
            for(let newFile of files){
                if(newFile.selectLotin === file.selectLotin && (newFile.limit + file.limit) > 1){
                    return next(new ErrorResponse('Bu fuqaro oldin royhatdan otgan yoki ish stavkasi 1 dan oshib ketyapti', 403))
                }
            }
        }
        for(let file of files){
            const newFile = await File.create({
                selectPosition : file.selectPosition,
                selectSalary : file.selectSalary,
                selectPercent: file.selectPercent,
                limit : file.limit,
                selectLotin : file.selectLotin,
                selectKril : file.selectKril,
                budget : file.budget,
                selectType : file.selectType,
                selectRegion : file.selectRegion,
                selectSumma : file.selectSumma,
                selectRank : file.selectRank,
                master : province._id
            })
            province.file.push(newFile._id)
            await province.save()
            result.push(newFile)
        }
        return res.status(200).json({
            success : true,
            data : result
        })
    }
})
// get file by id 
exports.getById = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : file
    })
})
// update file  
exports.updateFile = asyncHandler(async (req, res, next) => {
    const {file} = req.body
    if(!file.selectPosition || !file.selectSalary || !file.selectPercent || !file.limit || !file.selectLotin || !file.selectKril || !file.budget || !file.selectType || !file.selectRegion || !file.selectSumma || !file.selectRank){
        return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403))
    }
    const id = req.params.id
    const oldFile = await File.findById(id)
    const folder = await Folder.findById(file.master)
    if(folder){
        if(file.selectLotin !== oldFile.selectLotin && file.selectKril !== oldFile.selectKril){
            const test = await testFileName(file, folder.file)
            if(!test){
                return next(new ErrorResponse(`Bu bolimda bunday odam royhatddan otkizilgan :  ${file.selectLotin} ${file.selectKril}` , 403))
            }
        }
        oldFile.selectLotin = file.selectLotin
        oldFile.selectKril = file.selectKril
        oldFile.selectPercent = file.selectPercent
        oldFile.selectPosition = file.selectPosition
        oldFile.selectSalary = file.selectSalary
        oldFile.limit = file.limit
        oldFile.selectRank = file.selectRank
        oldFile.selectSumma = file.selectSumma
        oldFile.selectRegion = file.selectRegion
        oldFile.selectType = file.selectType
        oldFile.budget = file.budget
        await oldFile.save()
        return res.status(200).json({
            success : true,
            data : oldFile
        })
    }
})
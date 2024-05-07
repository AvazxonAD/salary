const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const Folder = require('../models/folder.model')
const testFolderName = require('../utils/testFolderName')


// get folder 
exports.getFolder = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    let result = []
    const id = req.params.id
    const republic = await Republic.findById(id)
    if(republic){
        for(let folder of republic.folder){
            const folderResult = await Folder.findById(folder._id)
            result.push(folderResult)
        }
        return res.status(200).json({
            success : true,
            data : result
        })
    }
    const province = await Province.findById(id)
    if(province){
        for(let folder of province.folder){
            const folderResult = await Folder.findById(folder._id)
            result.push(folderResult)
        }
        return res.status(200).json({
            success : true,
            data : result
        })
    }
    const folderMaster = await Folder.findById(id)
    for(let folder of folderMaster.folder){
        const folderResult = await Folder.findById(folder._id)
        result.push(folderResult)
    }
    return res.status(200).json({
        success : true,
        data : result
    })
})
// create folder
exports.createFolder = asyncHandler(async (req, res, next) => {
    const {name} = req.body
    const id = req.params.id
    if(!name || name.length === 0){
        return next(new ErrorResponse('Bolim nomi bo\'sh bolmasligi kerak'))
    }
    const republic = await Republic.findById(id)
    if(republic){
        const test = await testFolderName(name, republic.folder)
        if(!test){
            return next(new ErrorResponse("Bu bolimdan bunday nomli bolim mavjud", 403))
        }
        const folder = await Folder.create({
            name : name.trim()
        })
        republic.folder.push(folder._id)
        await republic.save()

        folder.master = republic._id
        await folder.save()

        return res.status(200).json({
            success: true,
            data : folder
        })
    }
    const province = await Province.findById(id)
    if(province){
        const test = await testFolderName(name, province.folder)
        if(!test){
            return next(new ErrorResponse("Bu bolimdan bunday nomli bolim mavjud", 403))
        }
        const folder = await Folder.create({
            name : name.trim()
        })
        province.folder.push(folder._id)
        await province.save()
        
        folder.master = province._id
        await folder.save()
        
        return res.status(200).json({
            success : true,
            data : folder
        })
    }
    const folderMaster = await Folder.findById(id)
    const test = await testNameFolder(name, folderMaster.folder)
    if(!test){
        return next(new ErrorResponse("Bu bolimdan bunday nomli bolim mavjud", 403))
    }
    const folder = await Folder.create({
        name : name.trim()
    })
    folderMaster.folder.push(folder)
    await folderMaster.save()

    folder.master = folderMaster._id
    await folder.save()
    
    return res.status(200).json({
        success : true,
        data : folder
    })
})

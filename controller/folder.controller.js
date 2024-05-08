const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const Folder = require('../models/folder.model')
const testFolderName = require('../utils/testFolderName')


// get folder 
exports.openFolder = asyncHandler(async (req, res, next) => {
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
    const test = await testFolderName(name, folderMaster.folder)
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
// get folder ById 
exports.getFolderById = asyncHandler(async (req, res, next) => {
    if(!req.user){
        return next(new ErrorResponse('Siz tizimga kirmagansiz', 403))
    }
    const folder = await Folder.findById(req.params.id)
    res.status(200).json({
        success : true,
        data : folder
    })
})
// update folder 
exports.updateFolder = asyncHandler(async (req, res, next) => {
    const {name} = req.body

    const folder = await Folder.findById(req.params.id)
    const republic = await Republic.findById(folder.master)
    if(republic){
        for(let id of republic.folder){
            const folder = await Folder.findById(id)
            if(folder.name === name){
                return next(new ErrorResponse('Bu bolim avval kiritilgan', 403))
            }
        }
    }
    const province = await Province.findById(folder.master)
    if(province){
        for(let id of province.folder){
            const folder = await Folder.findById(id)
            if(folder.name === name){
                return next(new ErrorResponse('Bu bolim avval kiritilgan', 403))
            }
        }
    }
    const folderMaster = await Folder.findById(folder.master)
    if(folderMaster){
        for(let id of folderMaster.folder){
            const folder = await Folder.findById(id)
            if(folder.name === name){
                return next(new ErrorResponse('Bu bolim nomi allqachon kiritilgan', 403))
            }
        }
    }
    folder.name = name
    await folder.save()
    return res.status(200).json({
        success : true,
        data : folder
    })
})
// delete folder 
exports.deleteFolder = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findById(req.params.id)

    const masterFolder = await Folder.findById(folder.master)
    if(masterFolder){
        const index = masterFolder.folder.indexOf(folder._id)

        masterFolder.folder.splice(index, 1)
        await masterFolder.save()
        await Folder.findByIdAndDelete(req.params.id)
    }
    const republic = await Republic.findById(folder.master)
    if(republic){
        const index = republic.folder.indexOf(folder._id)

        republic.folder.splice(index, 1)
        await republic.save()
        await Folder.findByIdAndDelete(req.params.id)
    }
    const province = await Province.findById(folder.master)
    if(province){
        const index = province.folder.indexOf(folder._id)

        province.folder.splice(index, 1)
        await province.save()
        await Folder.findByIdAndDelete(req.params.id)
    }
    res.status(200).json({
        success : true,
        message : "delete"
    })
})
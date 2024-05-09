const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const Folder = require('../models/folder.model')
const File = require('../models/file.model')
const testFolderName = require('../utils/testFolderName')


// open folder 
exports.openFolder = asyncHandler(async (req, res, next) => {
    const folder = await Folder.findById(req.params.id)
    const republic = await Republic.findById(req.params.id)
    const province = await Province.findById(req.params.id)
    let result = []
    if(folder && folder.folders.length > 0){
        result = await Folder.find({ _id: { $in: folder.folders } });
    }
    else if(province && province.folders.length > 0){
        result = await Folder.find({ _id: { $in: province.folders } });
    }
    else if(republic && republic.folders.length > 0){
        result = await Folder.find({ _id: { $in: republic.folders } });
    }
    
    return res.status(200).json({
        success : true,
        data : result
    })
})




// create folder
exports.createFolder = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    if (!name || name.trim() === '') {
        return next(new ErrorResponse('Bolim nomi bo\'sh bolmasligi kerak'))
    }
    const republic = await Republic.findById(req.params.id)
    const province = await Province.findById(req.params.id)
    const folder = await Folder.findById(req.params.id)
    let newFolder = null
    let parentFolder = null 

    if(republic){
        parentFolder = republic

    }
    else if(province){
        parentFolder = province    
    }
    else if(folder){
        parentFolder = folder
    }
    if(!parentFolder){
        return next(new ErrorResponse('Bunday bolim topilmadi', 404))
    }
    const testName = await testFolderName(name.trim(), parentFolder.folders)
    if(!testName){
        return next(new ErrorResponse('Bu bolimda bu nom allaqachon foydalanilgan', 403))
    }
    newFolder = await Folder.create({name : name.trim(), parent : parentFolder._id})
    parentFolder.folders.push(newFolder._id)
    await parentFolder.save()

    return res.status(200).json({
        success : true,
        data : newFolder
    })
})  
// get folder ById 
exports.getFolderById = asyncHandler(async (req, res, next) => {

    const folder = await Folder.findById(req.params.id)
    
    res.status(200).json({
        success: true,
        data: folder
    })
})
// update folder 
exports.updateFolder = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    let parent = null
    const oldFolder = await Folder.findById(req.params.id)
    if(!oldFolder){
        return next(new ErrorResponse('Folder topilmadi', 500))
    }
    if(oldFolder.parent){
        parent = await Republic.findById(oldFolder.parent)
        if(!parent){
            parent = await Province.findById(oldFolder.parent)
        }
        if(!parent){
            parent = await Folder.findById(oldFolder.parent)
        }
    }
    if(oldFolder.name !== name.trim()){
        const testName = await testFolderName(name, parent.folders)
        if(!testName){
            return next(new ErrorResponse('Bu bolimda bu nom allaqachon foydalanilgan', 403))
        }
    }
    oldFolder.name = name.trim()
    await oldFolder.save()
    return res.status(200).json({
        success : true,
        data : oldFolder
    })
})
// delete folder
exports.deleteFolder = asyncHandler(async (req, res, next) => {
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return next(new ErrorResponse('Bunday bolim topilmadi', 404));
        }
        
        // Parent obyektni aniqlash
        let parent = null;
        if (folder.parent) {
            parent = await Folder.findById(folder.parent);
            if (!parent) {
                parent = await Province.findById(folder.parent);
            }
            if (!parent) {
                parent = await Republic.findById(folder.parent);
            }
        }
        
        // Agar parent obyekt mavjud bo'lmasa, xatolik qaytarish
        if (!parent) {
            return next(new ErrorResponse('Parent obyekt topilmadi', 404));
        }

        // Folderni parent obyektning folders ro'yxatidan o'chirish
        const index = parent.folders.indexOf(folder._id);
        if (index !== -1) {
            parent.folders.splice(index, 1);
            await parent.save();
        }

        // Folder va uning ichidagi barcha subfolderlarni o'chirish
        await folder.deleteAllFolders();


        return res.status(200).json({
            success: true,
            data: {}
        });
})
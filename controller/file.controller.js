const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Folder = require('../models/folder.model')
const File = require('../models/file.model')
const Republic = require('../models/republic.model')
const Province = require('../models/province.model')
const testFileName = require('../utils/test.fileName')
const testOneFileName = require('../utils/testOneFileName')

// create file 
exports.createFile = asyncHandler(async (req, res, next) => {
    const { files } = req.body;
    const result = [];

    let parent = null;
    parent = await Republic.findById(req.params.id);
    if (!parent) {
        parent = await Province.findById(req.params.id);
    }
    if (!parent) {
        parent = await Folder.findById(req.params.id);
    }

    if (!parent) {
        return next(new ErrorResponse('Bunday ota-ona bo\'lim topilmadi', 404));
    }
    const testFile = await testFileName(files, parent.files)
    if (testFile) {
        return next(new ErrorResponse(`Bu ma'lumot avval kiritilgan: ${testFile}`, 403));
    }

    for (let file of files) {
        if (!file.selectPosition || !file.selectSalary || !file.selectPercent || !file.limit || !file.selectLotin || !file.selectKril || !file.budget || !file.selectType || !file.selectRegion || !file.selectSumma || !file.selectRank) {
            return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403));
        }
    }
    for (let file of files) {
        const newFile = await File.create({
            selectPosition: file.selectPosition,
            selectSalary: file.selectSalary,
            selectPercent: file.selectPercent,
            limit: file.limit,
            selectLotin: file.selectLotin,
            selectKril: file.selectKril,
            budget: file.budget,
            selectType: file.selectType,
            selectRegion: file.selectRegion,
            selectSumma: file.selectSumma,
            selectRank: file.selectRank,
            parent: parent._id
        });

        result.push(newFile);
        parent.files.push(newFile._id);
        await parent.save();
    }

    return res.status(200).json({
        success: true,
        data: result
    });
});
// get file by id 
exports.getById = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params.id)
    res.status(200).json({
        success: true,
        data: file
    })
})
// update file by id 
exports.updateFile = asyncHandler(async (req, res, next) => {
    const { file } = req.body;

    if (!file.selectPosition || !file.selectSalary || !file.selectPercent || !file.limit || !file.selectLotin || !file.selectKril || !file.budget || !file.selectType || !file.selectRegion || !file.selectSumma || !file.selectRank) {
        return next(new ErrorResponse('Sorovlar bosh qolmasligi kerak', 403));
    }

    let parent = null;
    const oldFile = await File.findById(req.params.id);
    const folder = await Folder.findById(oldFile.parent);

    parent = folder;

    if (!parent) {
        const province = await Province.findById(oldFile.parent);
        parent = province;
    }

    if (!parent) {
        const republic = await Republic.findById(oldFile.parent);
        parent = republic;
    }

    if (!parent) {
        return next(new ErrorResponse('Server xatolik', 500));
    }

    if (oldFile.selectKril !== file.selectKril || oldFile.selectLotin !== file.selectKril) {
        const test = await testOneFileName(file, parent.files);
        if (test) {
            return next(new ErrorResponse(`Bu ma'lumotlardan oldin foydalanilgan : ${test}`, 403));
        }
    }
    oldFile.selectLotin = file.selectLotin;
    oldFile.selectKril = file.selectKril;
    oldFile.selectPercent = file.selectPercent;
    oldFile.selectPosition = file.selectPosition;
    oldFile.selectSalary = file.selectSalary;
    oldFile.limit = file.limit;
    oldFile.selectRank = file.selectRank;
    oldFile.selectSumma = file.selectSumma;
    oldFile.selectRegion = file.selectRegion;
    oldFile.selectType = file.selectType;
    oldFile.budget = file.budget;

    await oldFile.save();

    return res.status(200).json({
        success: true,
        data: oldFile
    });
});
// delete by id  
exports.deleteFile = asyncHandler(async (req, res, next) => {
    const file = await File.findById(req.params.id)
    if(!file){
        return next(new ErrorResponse("File topilmadi", 403))
    }
    let parent = null 
    const folder = await Folder.findById(file.parent)
    parent = folder
    if(!parent){
        const province = await Province.findById(file.parent)
        parent = province
    }
    if(!parent){
        const republic = await Republic.findById(file.parent)
        parent = republic
    }
    if(!parent){
        return next(new ErrorResponse('Server xatolik', 500))
    }
    const index = parent.files.indexOf(file._id)
    parent.files.splice(index, 1)
    await parent.save()
    await file.deleteOne()
    return res.status(200).json({
        success : true,
        data : 'Delete'
    })
})
const Folder = require('../models/folder.model')



async function testFolderName(name, foldersArray){
    let folders = await Folder.find({_id : {$in : foldersArray}})
    const test = folders.find(folder =>folder.name  === name)
    
    return !test
    
}

module.exports = testFolderName
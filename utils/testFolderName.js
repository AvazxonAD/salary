const Folder = require('../models/folder.model')



async function testFolderName(folderName, folderMaster){
    let names = []
    for(let object of folderMaster){
        const folder = await Folder.findById(object)
        if(folder){
            names.push(folder.name)
        }
    }

    for(let name of names){
        if(name === folderName.trim()){
            return false
        }
    }
    return true
}

module.exports = testFolderName
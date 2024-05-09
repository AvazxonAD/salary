const File = require('../models/file.model')


async function fileNameTest(updateFile, masterArray){
    let testArray = []
    for(let id of masterArray){
        const file = await File.findById(id)
        testArray.push(file)
    }
    for(let file of testArray){
        if(file.selectLotin === updateFile.selectLotin || file.selectKril === updateFile.selectKril){
            return false
        }

    }
    return true
}
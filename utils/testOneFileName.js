const File = require('../models/file.model')

async function testFileName(file, parent){
    let testFor = []
    for(let id of parent){
        const parentFile = await File.findById(id)
        testFor.push(parentFile)
    }
    for(let parentFile of testFor){
        if(parentFile.selectLotin === file.selectLotin || parentFile.selectKril === file.selectKril){
            return file
        }
    }
}

module.exports = testFileName

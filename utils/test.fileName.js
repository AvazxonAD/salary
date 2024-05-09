const File = require('../models/file.model');

async function testFileName(files, parentFiles) {
    let testFor = [];
    for (let id of parentFiles) {
        const file = await File.findById(id);
        testFor.push(file);
    }
    for (let parentFile of testFor) {
        for (let file of files) {
            if (file.selectLotin === parentFile.selectLotin || file.selectKril === parentFile.selectKril) {
                return file;
            }
        }
    }
    return false;
}

module.exports = testFileName;

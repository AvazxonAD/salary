// models/folder.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    }],
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    parent : {
        type : mongoose.Schema.Types.ObjectId
    }
});
// Rekursiv ravishda ichidagi barcha folderlarni o'chirish
FolderSchema.methods.deleteAllSubfolders = async function () {
    for (const subfolderId of this.folders) {
        const subfolder = await this.model('Folder').findById(subfolderId);
        if (subfolder) {
            await subfolder.deleteAllSubfolders();
            await subfolder.remove();
        }
    }
};

// Asosiy folder va undagi barcha subfolderlarni o'chirish
FolderSchema.methods.deleteAllFolders = async function () {
    await this.deleteAllSubfolders();
    await this.remove();
};


const Folder = mongoose.model('Folder', FolderSchema);

module.exports = Folder;

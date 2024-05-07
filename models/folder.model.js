const mongoose  = require('mongoose')

const folderSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    master : {
        type : mongoose.Schema.Types.ObjectId
    },
    folder: [{
        type : mongoose.Schema.Types.ObjectId
    }],
    file : [{
        type :mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps : true
}
)

module.exports = mongoose.model('Folder', folderSchema)


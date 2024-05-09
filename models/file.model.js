const mongoose = require('mongoose')

const fileSchema = new  mongoose.Schema({
    selectPosition : {
        type : String,
        required : true
    },
    selectSalary : {
        type : Number,
        required : true
    },
    selectPercent : {
        type : Number,
        required : true
    },
    limit : {
        type : Number,
        required : true
    },
    selectLotin : {
        type : String,
        required : true
    },
    selectKril : {
        type : String,
        required : true
    },
    selectRank : {
        type : String,
        required : true
    },
    selectSumma : {
        type : Number,
        required : true
    },
    selectRegion : {
        type : String,
        required : true
    },
    selectType : {
        type : String,
        required : true
    },
    budget : {
        type : String,
        required : true
    },
    folder: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Folder" 
    },
    republic : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Republic"
    },
    province : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Province"
    }
}, {timestamps : true}
)

module.exports = mongoose.model("File", fileSchema)

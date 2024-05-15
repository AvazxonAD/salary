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
    selectLotin : {
        type : String,
        required : true
    },
    selectKril : {
        type : String,
        required : true
    },
    selectRank : String,
    selectSumma : Number,
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
    parent : mongoose.Schema.Types.ObjectId,
    master : mongoose.Schema.Types.ObjectId,
    dateOfEmployment : {
        type : Date,
        required : true
    } 
}, {timestamps : true}
)

module.exports = mongoose.model("File", fileSchema)
